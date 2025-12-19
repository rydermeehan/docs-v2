"""
X (Twitter) monitoring module for TaxDrop Social Media Monitor.

Monitors X for relevant discussions about taxes, tax software,
and opportunities to engage with users.
"""

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import List, Optional, Generator
import tweepy

from config import TwitterConfig, MonitorConfig


@dataclass
class TwitterMention:
    """Represents a relevant Twitter/X mention."""
    id: str
    text: str
    author_id: str
    author_username: str
    author_name: str
    url: str
    created_at: datetime
    retweet_count: int = 0
    like_count: int = 0
    reply_count: int = 0
    conversation_id: Optional[str] = None
    in_reply_to_user_id: Optional[str] = None
    relevance_score: float = 0.0
    matched_keywords: List[str] = field(default_factory=list)
    is_question: bool = False


class TwitterMonitor:
    """Monitor X (Twitter) for relevant TaxDrop discussions."""

    # Keywords indicating high engagement opportunities
    HIGH_RELEVANCE_PHRASES = [
        "looking for tax",
        "recommend tax software",
        "best tax software",
        "tax help",
        "file my taxes",
        "filing taxes",
        "1099 taxes",
        "self-employed tax",
        "freelancer tax",
        "small business tax",
        "quarterly taxes",
        "estimated taxes",
        "tax season",
        "owe taxes",
        "tax refund",
    ]

    # Question patterns
    QUESTION_PATTERNS = [
        "?",
        "how do i",
        "how can i",
        "what is the best",
        "anyone recommend",
        "suggestions for",
        "help me",
        "need help",
        "advice on",
    ]

    # Competitor mentions
    COMPETITORS = [
        "turbotax",
        "h&r block",
        "hrblock",
        "taxact",
        "freetaxusa",
        "taxslayer",
        "credit karma",
    ]

    def __init__(self, twitter_config: TwitterConfig, monitor_config: MonitorConfig):
        self.config = monitor_config
        self.twitter_config = twitter_config

        # Initialize Twitter API v2 client
        self.client = tweepy.Client(
            bearer_token=twitter_config.bearer_token,
            consumer_key=twitter_config.api_key,
            consumer_secret=twitter_config.api_secret,
            access_token=twitter_config.access_token,
            access_token_secret=twitter_config.access_secret,
            wait_on_rate_limit=True,
        )

        self._seen_ids: set = set()

    def calculate_relevance(self, text: str) -> tuple[float, List[str], bool]:
        """
        Calculate relevance score for a tweet.
        Returns (score, matched_keywords, is_question).
        """
        text_lower = text.lower()
        score = 0.0
        matched = []
        is_question = False

        # Check for direct brand mentions (highest priority)
        for keyword in self.config.keywords:
            if keyword.lower() in text_lower:
                score += 50
                matched.append(keyword)

        # Check for high-relevance phrases
        for phrase in self.HIGH_RELEVANCE_PHRASES:
            if phrase in text_lower:
                score += 15
                matched.append(phrase)

        # Check for questions (high engagement opportunity)
        for pattern in self.QUESTION_PATTERNS:
            if pattern in text_lower:
                score += 10
                is_question = True
                break

        # Check for competitor mentions
        for competitor in self.COMPETITORS:
            if competitor in text_lower:
                score += 20
                matched.append(f"competitor:{competitor}")

        # Boost for engagement metrics would be applied separately

        return score, matched, is_question

    def _process_tweet(
        self,
        tweet: tweepy.Tweet,
        users_map: dict,
    ) -> Optional[TwitterMention]:
        """Process a tweet and return a mention if relevant."""
        if str(tweet.id) in self._seen_ids:
            return None

        self._seen_ids.add(str(tweet.id))

        relevance, matched, is_question = self.calculate_relevance(tweet.text)

        if relevance < 10:
            return None

        # Get author info
        author = users_map.get(tweet.author_id, {})
        author_username = author.get("username", "unknown")
        author_name = author.get("name", "Unknown")

        # Get engagement metrics
        metrics = tweet.public_metrics or {}

        return TwitterMention(
            id=str(tweet.id),
            text=tweet.text,
            author_id=str(tweet.author_id),
            author_username=author_username,
            author_name=author_name,
            url=f"https://twitter.com/{author_username}/status/{tweet.id}",
            created_at=tweet.created_at or datetime.now(timezone.utc),
            retweet_count=metrics.get("retweet_count", 0),
            like_count=metrics.get("like_count", 0),
            reply_count=metrics.get("reply_count", 0),
            conversation_id=str(tweet.conversation_id) if tweet.conversation_id else None,
            in_reply_to_user_id=str(tweet.in_reply_to_user_id) if tweet.in_reply_to_user_id else None,
            relevance_score=relevance,
            matched_keywords=matched,
            is_question=is_question,
        )

    def search_recent(self, max_results: int = 100) -> Generator[TwitterMention, None, None]:
        """
        Search recent tweets for relevant content.
        Note: Requires Twitter API Basic or higher access level.
        """
        mentions = []

        # Build search queries
        queries = []

        # Direct brand mentions
        for keyword in self.config.keywords[:3]:
            queries.append(f'"{keyword}" -is:retweet lang:en')

        # Tax-related questions
        queries.append('"tax software" (recommend OR best OR looking for) -is:retweet lang:en')
        queries.append('"file taxes" (help OR how OR question) -is:retweet lang:en')
        queries.append('"1099" (tax OR file OR help) -is:retweet lang:en')
        queries.append('"self-employed" (tax OR taxes) -is:retweet lang:en')

        # Competitor comparisons
        queries.append('(turbotax OR "h&r block" OR taxact) (alternative OR switch OR hate OR expensive) -is:retweet lang:en')

        for query in queries:
            try:
                response = self.client.search_recent_tweets(
                    query=query,
                    max_results=min(max_results, 100),
                    tweet_fields=["created_at", "public_metrics", "conversation_id", "in_reply_to_user_id"],
                    user_fields=["username", "name"],
                    expansions=["author_id"],
                )

                if not response.data:
                    continue

                # Build users map
                users_map = {}
                if response.includes and "users" in response.includes:
                    for user in response.includes["users"]:
                        users_map[user.id] = {
                            "username": user.username,
                            "name": user.name,
                        }

                for tweet in response.data:
                    mention = self._process_tweet(tweet, users_map)
                    if mention:
                        # Boost relevance based on engagement
                        mention.relevance_score += mention.like_count * 0.5
                        mention.relevance_score += mention.retweet_count * 1.0
                        mention.relevance_score += mention.reply_count * 0.3
                        mentions.append(mention)

            except tweepy.TooManyRequests:
                print("Rate limited. Waiting...")
                break
            except tweepy.Forbidden as e:
                print(f"Access forbidden for query. Check API access level: {e}")
                continue
            except Exception as e:
                print(f"Error searching Twitter: {e}")
                continue

        # Sort by relevance and deduplicate
        seen = set()
        unique_mentions = []
        for m in sorted(mentions, key=lambda x: x.relevance_score, reverse=True):
            if m.id not in seen:
                seen.add(m.id)
                unique_mentions.append(m)

        for mention in unique_mentions:
            yield mention

    def get_conversation(self, conversation_id: str, max_results: int = 50) -> List[TwitterMention]:
        """
        Get the full conversation thread for context.
        """
        try:
            response = self.client.search_recent_tweets(
                query=f"conversation_id:{conversation_id}",
                max_results=max_results,
                tweet_fields=["created_at", "public_metrics", "in_reply_to_user_id"],
                user_fields=["username", "name"],
                expansions=["author_id"],
            )

            if not response.data:
                return []

            users_map = {}
            if response.includes and "users" in response.includes:
                for user in response.includes["users"]:
                    users_map[user.id] = {
                        "username": user.username,
                        "name": user.name,
                    }

            mentions = []
            for tweet in response.data:
                mention = self._process_tweet(tweet, users_map)
                if mention:
                    mentions.append(mention)

            return sorted(mentions, key=lambda x: x.created_at)

        except Exception as e:
            print(f"Error fetching conversation: {e}")
            return []

    def stream_mentions(self) -> Generator[TwitterMention, None, None]:
        """
        Stream mentions in real-time using Twitter's streaming API.
        Note: Requires appropriate API access level.
        """
        # Set up stream rules
        rules_to_add = []
        for keyword in self.config.keywords[:5]:
            rules_to_add.append(tweepy.StreamRule(f'"{keyword}" lang:en'))

        # Tax-related rules
        rules_to_add.append(tweepy.StreamRule('"tax software" lang:en'))
        rules_to_add.append(tweepy.StreamRule('"file taxes" lang:en'))

        class MentionStream(tweepy.StreamingClient):
            def __init__(self, bearer_token, monitor):
                super().__init__(bearer_token, wait_on_rate_limit=True)
                self.monitor = monitor
                self.mentions_queue = []

            def on_tweet(self, tweet):
                mention = self.monitor._process_tweet(tweet, {})
                if mention:
                    self.mentions_queue.append(mention)

        stream = MentionStream(self.twitter_config.bearer_token, self)

        try:
            # Get existing rules and delete them
            existing_rules = stream.get_rules()
            if existing_rules.data:
                stream.delete_rules([rule.id for rule in existing_rules.data])

            # Add new rules
            stream.add_rules(rules_to_add)

            # Start streaming (this blocks)
            stream.filter(
                tweet_fields=["created_at", "public_metrics"],
                expansions=["author_id"],
            )

        except Exception as e:
            print(f"Streaming error: {e}")
