"""
AI-powered response generation for TaxDrop Social Media Monitor.

Generates contextual, high-quality responses that are helpful first,
with subtle brand integration when appropriate.
"""

from dataclasses import dataclass
from enum import Enum
from typing import Optional, List
import json

from config import AIConfig, MonitorConfig


class ResponseTone(Enum):
    HELPFUL = "helpful"  # Pure helpfulness, no brand mention
    SOFT_MENTION = "soft_mention"  # Helpful with subtle brand awareness
    DIRECT_RECOMMEND = "direct_recommend"  # Direct recommendation when appropriate


class Platform(Enum):
    REDDIT = "reddit"
    TWITTER = "twitter"


@dataclass
class ResponseDraft:
    """A generated response draft."""
    content: str
    tone: ResponseTone
    platform: Platform
    confidence: float  # 0-1, how confident the AI is this is a good response
    reasoning: str  # Why this response was crafted this way
    should_respond: bool  # Whether responding is advisable
    warnings: List[str]  # Any concerns about responding


class ResponseGenerator:
    """Generate high-quality, contextual responses for social media mentions."""

    # TaxDrop value propositions for context
    TAXDROP_INFO = """
    TaxDrop (taxdrop.com) is a modern tax filing platform designed for:
    - Freelancers and self-employed individuals
    - 1099 contractors and gig workers
    - Small business owners
    - Anyone looking for simpler, more affordable tax filing

    Key features:
    - Automatic expense categorization
    - Quarterly estimated tax calculations
    - 1099 and W-2 support
    - Clean, modern interface
    - Competitive pricing
    - Real-time tax liability tracking

    Brand voice: Friendly, helpful, knowledgeable, never pushy or salesy.
    """

    REDDIT_SYSTEM_PROMPT = """You are a helpful tax and finance expert who occasionally mentions TaxDrop when genuinely relevant. Your primary goal is to be helpful to the community.

CRITICAL RULES:
1. NEVER sound like an advertisement or shill
2. Provide genuinely helpful tax advice first
3. Only mention TaxDrop if it directly solves the user's problem
4. Acknowledge other solutions exist
5. Be honest about limitations
6. Use Reddit's casual, authentic tone
7. Format responses appropriately for Reddit (use markdown)
8. Keep responses concise but thorough
9. If the post is asking for help with a specific tax situation, focus on answering that
10. Never start responses with "Hey!" or similar overly casual greetings

{taxdrop_info}

Respond in JSON format:
{{
    "should_respond": true/false,
    "confidence": 0.0-1.0,
    "tone": "helpful" | "soft_mention" | "direct_recommend",
    "response": "Your response text here",
    "reasoning": "Why you crafted this response this way",
    "warnings": ["Any concerns about responding"]
}}"""

    TWITTER_SYSTEM_PROMPT = """You are a helpful tax expert who provides concise, valuable tax tips. Your responses must fit Twitter's 280 character limit (or be a short thread).

CRITICAL RULES:
1. Be extremely concise - Twitter requires brevity
2. Lead with value, not promotion
3. Only mention TaxDrop if directly solving their problem
4. Use appropriate hashtags sparingly (1-2 max)
5. Be conversational but professional
6. Don't use excessive emojis
7. If recommending TaxDrop, do so naturally
8. Consider if a reply is even appropriate

{taxdrop_info}

Respond in JSON format:
{{
    "should_respond": true/false,
    "confidence": 0.0-1.0,
    "tone": "helpful" | "soft_mention" | "direct_recommend",
    "response": "Your response text here (keep under 280 chars for single tweet)",
    "reasoning": "Why you crafted this response this way",
    "warnings": ["Any concerns about responding"]
}}"""

    def __init__(self, ai_config: AIConfig, monitor_config: MonitorConfig):
        self.ai_config = ai_config
        self.monitor_config = monitor_config
        self.provider = ai_config.provider

        if self.provider == "anthropic":
            import anthropic
            self.client = anthropic.Anthropic(api_key=ai_config.anthropic_api_key)
        elif self.provider == "openai":
            import openai
            self.client = openai.OpenAI(api_key=ai_config.openai_api_key)
        else:
            self.client = None

    def _call_anthropic(self, system_prompt: str, user_prompt: str) -> str:
        """Call Anthropic's Claude API."""
        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        return response.content[0].text

    def _call_openai(self, system_prompt: str, user_prompt: str) -> str:
        """Call OpenAI's API."""
        response = self.client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=1024,
        )
        return response.choices[0].message.content

    def _parse_response(self, raw_response: str, platform: Platform) -> ResponseDraft:
        """Parse the AI response into a ResponseDraft object."""
        try:
            # Try to extract JSON from the response
            # Handle case where response might have markdown code blocks
            if "```json" in raw_response:
                json_str = raw_response.split("```json")[1].split("```")[0]
            elif "```" in raw_response:
                json_str = raw_response.split("```")[1].split("```")[0]
            else:
                json_str = raw_response

            data = json.loads(json_str.strip())

            return ResponseDraft(
                content=data.get("response", ""),
                tone=ResponseTone(data.get("tone", "helpful")),
                platform=platform,
                confidence=float(data.get("confidence", 0.5)),
                reasoning=data.get("reasoning", ""),
                should_respond=data.get("should_respond", False),
                warnings=data.get("warnings", []),
            )
        except (json.JSONDecodeError, ValueError, KeyError) as e:
            # If parsing fails, return a safe default
            return ResponseDraft(
                content="",
                tone=ResponseTone.HELPFUL,
                platform=platform,
                confidence=0.0,
                reasoning=f"Failed to parse AI response: {e}",
                should_respond=False,
                warnings=["Response parsing failed - manual review required"],
            )

    def generate_reddit_response(
        self,
        post_title: str,
        post_body: str,
        subreddit: str,
        parent_context: Optional[str] = None,
        existing_comments: Optional[List[str]] = None,
    ) -> ResponseDraft:
        """
        Generate a response for a Reddit post or comment.
        """
        if not self.client:
            return ResponseDraft(
                content="",
                tone=ResponseTone.HELPFUL,
                platform=Platform.REDDIT,
                confidence=0.0,
                reasoning="No AI provider configured",
                should_respond=False,
                warnings=["Configure ANTHROPIC_API_KEY or OPENAI_API_KEY"],
            )

        system_prompt = self.REDDIT_SYSTEM_PROMPT.format(taxdrop_info=self.TAXDROP_INFO)

        user_prompt = f"""Analyze this Reddit content and generate an appropriate response:

SUBREDDIT: r/{subreddit}
POST TITLE: {post_title}
POST BODY: {post_body}

{"PARENT COMMENT CONTEXT: " + parent_context if parent_context else ""}

{"EXISTING COMMENTS (avoid repeating these points): " + chr(10).join(existing_comments[:5]) if existing_comments else ""}

Generate a response that is helpful first. Only mention TaxDrop if it genuinely solves their problem. If this isn't a good opportunity to engage, set should_respond to false."""

        try:
            if self.provider == "anthropic":
                raw_response = self._call_anthropic(system_prompt, user_prompt)
            else:
                raw_response = self._call_openai(system_prompt, user_prompt)

            return self._parse_response(raw_response, Platform.REDDIT)

        except Exception as e:
            return ResponseDraft(
                content="",
                tone=ResponseTone.HELPFUL,
                platform=Platform.REDDIT,
                confidence=0.0,
                reasoning=f"API error: {e}",
                should_respond=False,
                warnings=[f"API call failed: {e}"],
            )

    def generate_twitter_response(
        self,
        tweet_text: str,
        author_username: str,
        conversation_context: Optional[List[str]] = None,
        is_question: bool = False,
    ) -> ResponseDraft:
        """
        Generate a response for a Twitter/X post.
        """
        if not self.client:
            return ResponseDraft(
                content="",
                tone=ResponseTone.HELPFUL,
                platform=Platform.TWITTER,
                confidence=0.0,
                reasoning="No AI provider configured",
                should_respond=False,
                warnings=["Configure ANTHROPIC_API_KEY or OPENAI_API_KEY"],
            )

        system_prompt = self.TWITTER_SYSTEM_PROMPT.format(taxdrop_info=self.TAXDROP_INFO)

        user_prompt = f"""Analyze this tweet and generate an appropriate response:

TWEET BY @{author_username}: {tweet_text}

IS QUESTION: {"Yes" if is_question else "No"}

{"CONVERSATION CONTEXT: " + chr(10).join(conversation_context[:3]) if conversation_context else ""}

Generate a response under 280 characters that is helpful first. Only mention TaxDrop if genuinely relevant. If this isn't a good engagement opportunity, set should_respond to false."""

        try:
            if self.provider == "anthropic":
                raw_response = self._call_anthropic(system_prompt, user_prompt)
            else:
                raw_response = self._call_openai(system_prompt, user_prompt)

            return self._parse_response(raw_response, Platform.TWITTER)

        except Exception as e:
            return ResponseDraft(
                content="",
                tone=ResponseTone.HELPFUL,
                platform=Platform.TWITTER,
                confidence=0.0,
                reasoning=f"API error: {e}",
                should_respond=False,
                warnings=[f"API call failed: {e}"],
            )

    def refine_response(
        self,
        draft: ResponseDraft,
        feedback: str,
    ) -> ResponseDraft:
        """
        Refine a response based on user feedback.
        """
        if not self.client:
            return draft

        system_prompt = f"""You previously generated this response for {draft.platform.value}:

PREVIOUS RESPONSE: {draft.content}

The user wants you to refine it based on this feedback: {feedback}

Maintain the same JSON format in your response."""

        user_prompt = f"Please refine the response based on the feedback. Keep it appropriate for {draft.platform.value}."

        try:
            if self.provider == "anthropic":
                raw_response = self._call_anthropic(system_prompt, user_prompt)
            else:
                raw_response = self._call_openai(system_prompt, user_prompt)

            return self._parse_response(raw_response, draft.platform)

        except Exception:
            return draft
