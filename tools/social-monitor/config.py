"""
Configuration management for TaxDrop Social Media Monitor.
"""

import os
from dataclasses import dataclass, field
from typing import List
from dotenv import load_dotenv

load_dotenv()


@dataclass
class RedditConfig:
    client_id: str = field(default_factory=lambda: os.getenv("REDDIT_CLIENT_ID", ""))
    client_secret: str = field(default_factory=lambda: os.getenv("REDDIT_CLIENT_SECRET", ""))
    user_agent: str = field(default_factory=lambda: os.getenv("REDDIT_USER_AGENT", "TaxDropMonitor/1.0"))


@dataclass
class TwitterConfig:
    api_key: str = field(default_factory=lambda: os.getenv("TWITTER_API_KEY", ""))
    api_secret: str = field(default_factory=lambda: os.getenv("TWITTER_API_SECRET", ""))
    access_token: str = field(default_factory=lambda: os.getenv("TWITTER_ACCESS_TOKEN", ""))
    access_secret: str = field(default_factory=lambda: os.getenv("TWITTER_ACCESS_SECRET", ""))
    bearer_token: str = field(default_factory=lambda: os.getenv("TWITTER_BEARER_TOKEN", ""))


@dataclass
class AIConfig:
    openai_api_key: str = field(default_factory=lambda: os.getenv("OPENAI_API_KEY", ""))
    anthropic_api_key: str = field(default_factory=lambda: os.getenv("ANTHROPIC_API_KEY", ""))

    @property
    def provider(self) -> str:
        if self.anthropic_api_key:
            return "anthropic"
        elif self.openai_api_key:
            return "openai"
        return "none"


@dataclass
class MonitorConfig:
    brand_name: str = field(default_factory=lambda: os.getenv("BRAND_NAME", "TaxDrop"))
    brand_domain: str = field(default_factory=lambda: os.getenv("BRAND_DOMAIN", "taxdrop.com"))
    interval_minutes: int = field(default_factory=lambda: int(os.getenv("MONITOR_INTERVAL_MINUTES", "15")))

    subreddits: List[str] = field(default_factory=lambda: [
        s.strip() for s in os.getenv(
            "SUBREDDITS",
            "tax,taxes,personalfinance,smallbusiness,Entrepreneur,freelance,selfemployed,accounting,taxpros,IRS"
        ).split(",")
    ])

    keywords: List[str] = field(default_factory=lambda: [
        k.strip() for k in os.getenv(
            "KEYWORDS",
            "taxdrop,tax drop,taxdrop.com,tax software,tax filing,tax preparation,file taxes,tax return,1099,W2,self-employed tax"
        ).split(",")
    ])


@dataclass
class Config:
    reddit: RedditConfig = field(default_factory=RedditConfig)
    twitter: TwitterConfig = field(default_factory=TwitterConfig)
    ai: AIConfig = field(default_factory=AIConfig)
    monitor: MonitorConfig = field(default_factory=MonitorConfig)


def get_config() -> Config:
    """Get the application configuration."""
    return Config()
