#!/usr/bin/env python3
"""
TaxDrop Social Media Monitor

A tool to monitor Reddit and X (Twitter) for relevant tax-related discussions
and generate high-quality, contextual responses.

Usage:
    python monitor.py scan          # One-time scan of all platforms
    python monitor.py scan reddit   # Scan Reddit only
    python monitor.py scan twitter  # Scan Twitter only
    python monitor.py watch         # Continuous monitoring mode
    python monitor.py interactive   # Interactive mode for reviewing mentions
"""

import argparse
import sys
import time
from datetime import datetime
from typing import List, Optional, Union

from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.prompt import Prompt, Confirm
from rich.markdown import Markdown
from rich.live import Live
from rich.layout import Layout
from rich.text import Text
from rich import box

from config import get_config, Config
from reddit_monitor import RedditMonitor, RedditMention
from twitter_monitor import TwitterMonitor, TwitterMention
from response_generator import ResponseGenerator, ResponseDraft, ResponseTone

console = Console()


def format_time_ago(dt: datetime) -> str:
    """Format a datetime as a human-readable 'time ago' string."""
    now = datetime.now(dt.tzinfo) if dt.tzinfo else datetime.now()
    delta = now - dt

    if delta.days > 0:
        return f"{delta.days}d ago"
    elif delta.seconds >= 3600:
        return f"{delta.seconds // 3600}h ago"
    elif delta.seconds >= 60:
        return f"{delta.seconds // 60}m ago"
    else:
        return "just now"


def truncate(text: str, length: int = 100) -> str:
    """Truncate text to a maximum length."""
    if len(text) <= length:
        return text
    return text[:length - 3] + "..."


def display_reddit_mention(mention: RedditMention, index: int) -> Panel:
    """Display a Reddit mention as a Rich panel."""
    content = Text()
    content.append(f"r/{mention.subreddit}", style="cyan bold")
    content.append(f" | Score: {mention.score} | ", style="dim")
    content.append(format_time_ago(mention.created_utc), style="dim")
    content.append("\n\n")

    if mention.title:
        content.append(mention.title, style="bold")
        content.append("\n\n")

    content.append(truncate(mention.body, 300))
    content.append("\n\n")
    content.append("Keywords: ", style="yellow")
    content.append(", ".join(mention.matched_keywords[:5]), style="yellow dim")
    content.append(f"\nRelevance: {mention.relevance_score:.0f}", style="green")

    return Panel(
        content,
        title=f"[{index}] Reddit {mention.type.title()} by u/{mention.author}",
        subtitle=mention.url,
        box=box.ROUNDED,
    )


def display_twitter_mention(mention: TwitterMention, index: int) -> Panel:
    """Display a Twitter mention as a Rich panel."""
    content = Text()
    content.append(f"@{mention.author_username}", style="cyan bold")
    content.append(f" ({mention.author_name})", style="dim")
    content.append(f" | ", style="dim")
    content.append(format_time_ago(mention.created_at), style="dim")
    content.append("\n\n")

    content.append(mention.text)
    content.append("\n\n")

    content.append(f"Likes: {mention.like_count} | ", style="dim")
    content.append(f"Retweets: {mention.retweet_count} | ", style="dim")
    content.append(f"Replies: {mention.reply_count}", style="dim")

    if mention.matched_keywords:
        content.append("\n\nKeywords: ", style="yellow")
        content.append(", ".join(mention.matched_keywords[:5]), style="yellow dim")

    content.append(f"\nRelevance: {mention.relevance_score:.0f}", style="green")
    if mention.is_question:
        content.append(" [QUESTION]", style="green bold")

    return Panel(
        content,
        title=f"[{index}] Tweet",
        subtitle=mention.url,
        box=box.ROUNDED,
    )


def display_response_draft(draft: ResponseDraft) -> Panel:
    """Display a generated response draft."""
    if not draft.should_respond:
        return Panel(
            f"[yellow]AI suggests NOT responding.[/yellow]\n\nReason: {draft.reasoning}",
            title="Response Analysis",
            box=box.ROUNDED,
        )

    tone_colors = {
        ResponseTone.HELPFUL: "blue",
        ResponseTone.SOFT_MENTION: "green",
        ResponseTone.DIRECT_RECOMMEND: "yellow",
    }

    content = Text()
    content.append(f"Tone: ", style="dim")
    content.append(draft.tone.value, style=f"{tone_colors.get(draft.tone, 'white')} bold")
    content.append(f" | Confidence: {draft.confidence:.0%}\n\n", style="dim")

    content.append("--- DRAFT RESPONSE ---\n\n", style="bold")
    content.append(draft.content)
    content.append("\n\n--- END DRAFT ---\n\n", style="bold")

    content.append("Reasoning: ", style="dim")
    content.append(draft.reasoning, style="italic dim")

    if draft.warnings:
        content.append("\n\nWarnings: ", style="red")
        content.append(", ".join(draft.warnings), style="red dim")

    return Panel(content, title="Generated Response", box=box.DOUBLE)


class SocialMonitor:
    """Main social media monitoring application."""

    def __init__(self, config: Config):
        self.config = config
        self.reddit_monitor: Optional[RedditMonitor] = None
        self.twitter_monitor: Optional[TwitterMonitor] = None
        self.response_generator: Optional[ResponseGenerator] = None

        # Initialize monitors if credentials are available
        if config.reddit.client_id and config.reddit.client_secret:
            try:
                self.reddit_monitor = RedditMonitor(config.reddit, config.monitor)
                console.print("[green]Reddit monitor initialized[/green]")
            except Exception as e:
                console.print(f"[red]Failed to initialize Reddit monitor: {e}[/red]")

        if config.twitter.bearer_token:
            try:
                self.twitter_monitor = TwitterMonitor(config.twitter, config.monitor)
                console.print("[green]Twitter monitor initialized[/green]")
            except Exception as e:
                console.print(f"[red]Failed to initialize Twitter monitor: {e}[/red]")

        if config.ai.provider != "none":
            try:
                self.response_generator = ResponseGenerator(config.ai, config.monitor)
                console.print(f"[green]Response generator initialized ({config.ai.provider})[/green]")
            except Exception as e:
                console.print(f"[red]Failed to initialize response generator: {e}[/red]")

    def scan_reddit(self, limit: int = 50) -> List[RedditMention]:
        """Scan Reddit for relevant mentions."""
        if not self.reddit_monitor:
            console.print("[yellow]Reddit monitor not configured[/yellow]")
            return []

        console.print("[cyan]Scanning Reddit...[/cyan]")
        mentions = list(self.reddit_monitor.search_subreddits(limit=limit))
        console.print(f"[green]Found {len(mentions)} relevant Reddit mentions[/green]")
        return mentions

    def scan_twitter(self, limit: int = 50) -> List[TwitterMention]:
        """Scan Twitter for relevant mentions."""
        if not self.twitter_monitor:
            console.print("[yellow]Twitter monitor not configured[/yellow]")
            return []

        console.print("[cyan]Scanning Twitter...[/cyan]")
        mentions = list(self.twitter_monitor.search_recent(max_results=limit))
        console.print(f"[green]Found {len(mentions)} relevant Twitter mentions[/green]")
        return mentions

    def generate_response(
        self,
        mention: Union[RedditMention, TwitterMention],
    ) -> Optional[ResponseDraft]:
        """Generate a response for a mention."""
        if not self.response_generator:
            console.print("[yellow]Response generator not configured[/yellow]")
            return None

        if isinstance(mention, RedditMention):
            return self.response_generator.generate_reddit_response(
                post_title=mention.title,
                post_body=mention.body,
                subreddit=mention.subreddit,
                parent_context=mention.parent_context,
            )
        else:
            return self.response_generator.generate_twitter_response(
                tweet_text=mention.text,
                author_username=mention.author_username,
                is_question=mention.is_question,
            )

    def interactive_mode(self):
        """Run interactive mode for reviewing and responding to mentions."""
        console.print(Panel(
            "[bold cyan]TaxDrop Social Media Monitor[/bold cyan]\n\n"
            "Interactive mode - review mentions and generate responses",
            title="Welcome",
            box=box.DOUBLE,
        ))

        while True:
            console.print("\n[bold]Options:[/bold]")
            console.print("  [1] Scan Reddit")
            console.print("  [2] Scan Twitter")
            console.print("  [3] Scan All")
            console.print("  [q] Quit")

            choice = Prompt.ask("Select option", choices=["1", "2", "3", "q"], default="3")

            if choice == "q":
                console.print("[yellow]Goodbye![/yellow]")
                break

            mentions: List[Union[RedditMention, TwitterMention]] = []

            if choice in ["1", "3"]:
                mentions.extend(self.scan_reddit())

            if choice in ["2", "3"]:
                mentions.extend(self.scan_twitter())

            if not mentions:
                console.print("[yellow]No relevant mentions found.[/yellow]")
                continue

            # Sort all mentions by relevance
            mentions.sort(key=lambda m: m.relevance_score, reverse=True)

            # Display mentions
            console.print(f"\n[bold]Found {len(mentions)} mentions (sorted by relevance):[/bold]\n")

            for i, mention in enumerate(mentions[:20], 1):  # Show top 20
                if isinstance(mention, RedditMention):
                    console.print(display_reddit_mention(mention, i))
                else:
                    console.print(display_twitter_mention(mention, i))

            # Interactive response generation
            while True:
                selection = Prompt.ask(
                    "\nEnter mention number to generate response (or 'b' to go back)",
                    default="b",
                )

                if selection.lower() == "b":
                    break

                try:
                    idx = int(selection) - 1
                    if 0 <= idx < len(mentions):
                        mention = mentions[idx]

                        console.print("\n[cyan]Generating response...[/cyan]")
                        draft = self.generate_response(mention)

                        if draft:
                            console.print(display_response_draft(draft))

                            if draft.should_respond:
                                # Offer refinement
                                if Confirm.ask("Would you like to refine this response?"):
                                    feedback = Prompt.ask("Enter your feedback")
                                    refined = self.response_generator.refine_response(draft, feedback)
                                    console.print(display_response_draft(refined))

                                # Copy to clipboard option
                                console.print(f"\n[dim]URL: {mention.url}[/dim]")
                                console.print("[green]Response ready to post![/green]")
                    else:
                        console.print("[red]Invalid selection[/red]")
                except ValueError:
                    console.print("[red]Please enter a valid number[/red]")

    def scan_mode(self, platform: Optional[str] = None):
        """Run a one-time scan and display results."""
        mentions: List[Union[RedditMention, TwitterMention]] = []

        if platform in [None, "reddit"]:
            mentions.extend(self.scan_reddit())

        if platform in [None, "twitter"]:
            mentions.extend(self.scan_twitter())

        if not mentions:
            console.print("[yellow]No relevant mentions found.[/yellow]")
            return

        # Sort by relevance
        mentions.sort(key=lambda m: m.relevance_score, reverse=True)

        # Display as table
        table = Table(title="Relevant Mentions", box=box.ROUNDED)
        table.add_column("#", style="dim", width=4)
        table.add_column("Platform", width=8)
        table.add_column("Source", width=20)
        table.add_column("Content", width=50)
        table.add_column("Relevance", justify="right", width=10)
        table.add_column("URL", width=40)

        for i, mention in enumerate(mentions[:30], 1):
            if isinstance(mention, RedditMention):
                table.add_row(
                    str(i),
                    "Reddit",
                    f"r/{mention.subreddit}",
                    truncate(mention.title or mention.body, 50),
                    f"{mention.relevance_score:.0f}",
                    mention.url,
                )
            else:
                table.add_row(
                    str(i),
                    "Twitter",
                    f"@{mention.author_username}",
                    truncate(mention.text, 50),
                    f"{mention.relevance_score:.0f}",
                    mention.url,
                )

        console.print(table)

    def watch_mode(self, interval_minutes: Optional[int] = None):
        """Continuous monitoring mode."""
        interval = interval_minutes or self.config.monitor.interval_minutes

        console.print(Panel(
            f"[bold cyan]Continuous Monitoring Mode[/bold cyan]\n\n"
            f"Checking every {interval} minutes\n"
            f"Press Ctrl+C to stop",
            title="Watch Mode",
            box=box.DOUBLE,
        ))

        try:
            while True:
                console.print(f"\n[dim]{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}[/dim]")
                self.scan_mode()
                console.print(f"\n[dim]Next scan in {interval} minutes...[/dim]")
                time.sleep(interval * 60)
        except KeyboardInterrupt:
            console.print("\n[yellow]Monitoring stopped.[/yellow]")


def main():
    parser = argparse.ArgumentParser(
        description="TaxDrop Social Media Monitor",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    python monitor.py scan              # One-time scan of all platforms
    python monitor.py scan reddit       # Scan Reddit only
    python monitor.py scan twitter      # Scan Twitter only
    python monitor.py watch             # Continuous monitoring
    python monitor.py watch --interval 30  # Check every 30 minutes
    python monitor.py interactive       # Interactive review mode
        """,
    )

    subparsers = parser.add_subparsers(dest="command", help="Command to run")

    # Scan command
    scan_parser = subparsers.add_parser("scan", help="One-time scan for mentions")
    scan_parser.add_argument(
        "platform",
        nargs="?",
        choices=["reddit", "twitter"],
        help="Platform to scan (default: all)",
    )

    # Watch command
    watch_parser = subparsers.add_parser("watch", help="Continuous monitoring")
    watch_parser.add_argument(
        "--interval",
        type=int,
        help="Minutes between scans",
    )

    # Interactive command
    subparsers.add_parser("interactive", help="Interactive review mode")

    args = parser.parse_args()

    # Load configuration
    config = get_config()

    # Create monitor
    monitor = SocialMonitor(config)

    # Run appropriate command
    if args.command == "scan":
        monitor.scan_mode(args.platform)
    elif args.command == "watch":
        monitor.watch_mode(args.interval)
    elif args.command == "interactive":
        monitor.interactive_mode()
    else:
        # Default to interactive mode
        monitor.interactive_mode()


if __name__ == "__main__":
    main()
