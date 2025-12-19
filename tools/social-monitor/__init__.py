"""
TaxDrop Social Media Monitor

Monitor Reddit and X (Twitter) for relevant tax discussions
and generate high-quality responses.
"""

from .config import get_config, Config
from .reddit_monitor import RedditMonitor, RedditMention
from .twitter_monitor import TwitterMonitor, TwitterMention
from .response_generator import ResponseGenerator, ResponseDraft, ResponseTone

__all__ = [
    "get_config",
    "Config",
    "RedditMonitor",
    "RedditMention",
    "TwitterMonitor",
    "TwitterMention",
    "ResponseGenerator",
    "ResponseDraft",
    "ResponseTone",
]

__version__ = "1.0.0"
