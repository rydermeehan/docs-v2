"""
Reddit monitoring module for TaxDrop Social Media Monitor.

Monitors specified subreddits for relevant discussions about taxes,
tax software, and potential opportunities to engage with users.
"""

import time
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import List, Optional, Generator
import praw
from praw.models import Submission, Comment

from config import RedditConfig, MonitorConfig


@dataclass
class RedditMention:
    """Represents a relevant Reddit mention."""
    id: str
    type: str  # 'post' or 'comment'
    subreddit: str
    title: str
    body: str
    author: str
    url: str
    score: int
    created_utc: datetime
    parent_context: Optional[str] = None
    relevance_score: float = 0.0
    matched_keywords: List[str] = None

    def __post_init__(self):
        if self.matched_keywords is None:
            self.matched_keywords = []


class RedditMonitor:
    """Monitor Reddit for relevant TaxDrop discussions."""

    # Keywords indicating high-relevance opportunities
    HIGH_RELEVANCE_KEYWORDS = [
        "looking for", "recommend", "suggestion", "best tax",
        "which tax software", "anyone use", "thoughts on",
        "help with taxes", "need tax help", "tax question",
        "freelancer tax", "1099 tax", "self-employed",
        "small business tax", "quarterly taxes", "estimated taxes"
    ]

    # Keywords indicating user is asking a question (high engagement opportunity)
    QUESTION_INDICATORS = [
        "?", "how do", "how can", "what is", "should i",
        "is there", "does anyone", "has anyone", "can someone",
        "advice", "help", "recommend"
    ]

    # Competitor mentions (opportunities to present TaxDrop as alternative)
    COMPETITOR_KEYWORDS = [
        "turbotax", "h&r block", "taxact", "freetaxusa",
        "credit karma tax", "cash app taxes", "taxslayer"
    ]

    def __init__(self, reddit_config: RedditConfig, monitor_config: MonitorConfig):
        self.config = monitor_config
        self.reddit = praw.Reddit(
            client_id=reddit_config.client_id,
            client_secret=reddit_config.client_secret,
            user_agent=reddit_config.user_agent,
        )
        self._seen_ids: set = set()

    def calculate_relevance(self, text: str, title: str = "") -> tuple[float, List[str]]:
        """
        Calculate relevance score for a piece of content.
        Returns (score, matched_keywords).
        """
        combined_text = f"{title} {text}".lower()
        score = 0.0
        matched = []

        # Check for direct brand mentions (highest priority)
        for keyword in self.config.keywords:
            if keyword.lower() in combined_text:
                score += 30
                matched.append(keyword)

        # Check for high-relevance keywords
        for keyword in self.HIGH_RELEVANCE_KEYWORDS:
            if keyword in combined_text:
                score += 10
                matched.append(keyword)

        # Check for question indicators (engagement opportunity)
        for indicator in self.QUESTION_INDICATORS:
            if indicator in combined_text:
                score += 5
                break  # Only count once

        # Check for competitor mentions (opportunity to present alternative)
        for competitor in self.COMPETITOR_KEYWORDS:
            if competitor in combined_text:
                score += 15
                matched.append(f"competitor:{competitor}")

        return score, matched

    def _process_submission(self, submission: Submission) -> Optional[RedditMention]:
        """Process a Reddit submission and return a mention if relevant."""
        if submission.id in self._seen_ids:
            return None

        self._seen_ids.add(submission.id)

        text = submission.selftext if submission.selftext else ""
        relevance, matched = self.calculate_relevance(text, submission.title)

        if relevance < 10:  # Minimum threshold
            return None

        return RedditMention(
            id=submission.id,
            type="post",
            subreddit=submission.subreddit.display_name,
            title=submission.title,
            body=text[:2000],  # Truncate long posts
            author=str(submission.author) if submission.author else "[deleted]",
            url=f"https://reddit.com{submission.permalink}",
            score=submission.score,
            created_utc=datetime.fromtimestamp(submission.created_utc, tz=timezone.utc),
            relevance_score=relevance,
            matched_keywords=matched,
        )

    def _process_comment(self, comment: Comment) -> Optional[RedditMention]:
        """Process a Reddit comment and return a mention if relevant."""
        if comment.id in self._seen_ids:
            return None

        self._seen_ids.add(comment.id)

        relevance, matched = self.calculate_relevance(comment.body)

        if relevance < 10:
            return None

        # Get parent context if it's a reply
        parent_context = None
        try:
            if hasattr(comment, 'parent') and comment.parent():
                parent = comment.parent()
                if isinstance(parent, Comment):
                    parent_context = parent.body[:500]
                elif isinstance(parent, Submission):
                    parent_context = f"[Post: {parent.title}] {parent.selftext[:300]}"
        except Exception:
            pass

        return RedditMention(
            id=comment.id,
            type="comment",
            subreddit=comment.subreddit.display_name,
            title="",
            body=comment.body[:2000],
            author=str(comment.author) if comment.author else "[deleted]",
            url=f"https://reddit.com{comment.permalink}",
            score=comment.score,
            created_utc=datetime.fromtimestamp(comment.created_utc, tz=timezone.utc),
            parent_context=parent_context,
            relevance_score=relevance,
            matched_keywords=matched,
        )

    def search_subreddits(self, limit: int = 100) -> Generator[RedditMention, None, None]:
        """
        Search configured subreddits for relevant posts and comments.
        Yields RedditMention objects sorted by relevance.
        """
        mentions = []

        for subreddit_name in self.config.subreddits:
            try:
                subreddit = self.reddit.subreddit(subreddit_name)

                # Search new posts
                for submission in subreddit.new(limit=limit):
                    mention = self._process_submission(submission)
                    if mention:
                        mentions.append(mention)

                # Search by keywords
                for keyword in self.config.keywords[:5]:  # Limit to avoid rate limits
                    try:
                        for submission in subreddit.search(keyword, sort="new", limit=25):
                            mention = self._process_submission(submission)
                            if mention:
                                mentions.append(mention)
                    except Exception:
                        continue

                # Small delay to respect rate limits
                time.sleep(0.5)

            except Exception as e:
                print(f"Error searching r/{subreddit_name}: {e}")
                continue

        # Sort by relevance and yield
        mentions.sort(key=lambda m: m.relevance_score, reverse=True)
        for mention in mentions:
            yield mention

    def stream_mentions(self) -> Generator[RedditMention, None, None]:
        """
        Stream new mentions in real-time from configured subreddits.
        This is a blocking generator that yields mentions as they appear.
        """
        subreddit_str = "+".join(self.config.subreddits)
        subreddit = self.reddit.subreddit(subreddit_str)

        # Stream comments
        for comment in subreddit.stream.comments(skip_existing=True):
            mention = self._process_comment(comment)
            if mention:
                yield mention

    def get_post_with_comments(self, post_id: str, comment_limit: int = 50) -> dict:
        """
        Get a full post with its comments for context.
        Useful for understanding the full discussion before responding.
        """
        submission = self.reddit.submission(id=post_id)
        submission.comments.replace_more(limit=0)

        return {
            "post": {
                "title": submission.title,
                "body": submission.selftext,
                "author": str(submission.author),
                "score": submission.score,
                "url": f"https://reddit.com{submission.permalink}",
            },
            "comments": [
                {
                    "body": comment.body,
                    "author": str(comment.author),
                    "score": comment.score,
                }
                for comment in submission.comments[:comment_limit]
            ],
        }
