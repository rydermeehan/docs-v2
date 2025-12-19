# TaxDrop Social Media Monitor

Monitor Reddit and X (Twitter) for relevant tax-related discussions and generate high-quality, contextual responses for taxdrop.com.

## Features

- **Reddit Monitoring**: Scans configured subreddits for tax-related posts and comments
- **Twitter/X Monitoring**: Searches for relevant tweets about taxes and tax software
- **AI-Powered Responses**: Generates contextual, helpful responses using Claude or GPT-4
- **Relevance Scoring**: Prioritizes mentions based on engagement opportunity
- **Interactive Mode**: Review mentions and refine responses before posting
- **Continuous Monitoring**: Watch mode for ongoing monitoring

## Quick Start

### 1. Install Dependencies

```bash
cd tools/social-monitor
pip install -r requirements.txt
```

### 2. Configure API Keys

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your API keys:

**Reddit API** (https://www.reddit.com/prefs/apps):
- Create a "script" type application
- Copy client ID and secret

**Twitter/X API** (https://developer.twitter.com/):
- Apply for API access (Basic tier minimum for search)
- Get bearer token and API keys

**AI Provider** (choose one):
- Anthropic: https://console.anthropic.com/
- OpenAI: https://platform.openai.com/

### 3. Run the Monitor

```bash
# Interactive mode (recommended for first use)
python monitor.py interactive

# One-time scan
python monitor.py scan

# Continuous monitoring
python monitor.py watch --interval 15
```

## Usage Modes

### Interactive Mode
```bash
python monitor.py interactive
```
- Browse mentions sorted by relevance
- Generate AI responses for specific mentions
- Refine responses with feedback
- Best for actively engaging with the community

### Scan Mode
```bash
python monitor.py scan           # All platforms
python monitor.py scan reddit    # Reddit only
python monitor.py scan twitter   # Twitter only
```
- One-time scan for relevant mentions
- Displays results in a table format
- Good for quick checks

### Watch Mode
```bash
python monitor.py watch
python monitor.py watch --interval 30  # Custom interval
```
- Continuous monitoring at set intervals
- Runs until interrupted (Ctrl+C)
- Best for background monitoring

## Configuration

### Environment Variables

| Variable | Description |
|----------|-------------|
| `REDDIT_CLIENT_ID` | Reddit app client ID |
| `REDDIT_CLIENT_SECRET` | Reddit app client secret |
| `REDDIT_USER_AGENT` | User agent string for Reddit API |
| `TWITTER_BEARER_TOKEN` | Twitter API bearer token |
| `ANTHROPIC_API_KEY` | Anthropic API key (for Claude) |
| `OPENAI_API_KEY` | OpenAI API key (alternative to Anthropic) |
| `SUBREDDITS` | Comma-separated list of subreddits to monitor |
| `KEYWORDS` | Comma-separated list of keywords to search |
| `MONITOR_INTERVAL_MINUTES` | Default interval for watch mode |

### Default Subreddits
- r/tax, r/taxes, r/personalfinance
- r/smallbusiness, r/Entrepreneur, r/freelance
- r/selfemployed, r/accounting, r/taxpros, r/IRS

### Default Keywords
- taxdrop, tax drop, taxdrop.com
- tax software, tax filing, tax preparation
- 1099, W2, self-employed tax

## Response Generation

The AI generates responses following these principles:

1. **Helpful First**: Primary goal is to provide genuine value
2. **Contextual**: Responses match the platform's tone and norms
3. **Non-Promotional**: TaxDrop is only mentioned when genuinely relevant
4. **Honest**: Acknowledges other solutions and limitations

### Response Tones

| Tone | Description |
|------|-------------|
| `helpful` | Pure helpfulness, no brand mention |
| `soft_mention` | Helpful with subtle brand awareness |
| `direct_recommend` | Direct recommendation when appropriate |

## Best Practices

1. **Review Before Posting**: Always review AI-generated responses before posting
2. **Be Authentic**: Modify responses to match your voice
3. **Follow Platform Rules**: Respect subreddit rules and Twitter guidelines
4. **Disclose Affiliation**: If required by platform, disclose your connection to TaxDrop
5. **Add Value**: Only respond when you can genuinely help
6. **Don't Spam**: Quality over quantity - be selective about responses

## Architecture

```
social-monitor/
├── monitor.py           # Main entry point and CLI
├── config.py            # Configuration management
├── reddit_monitor.py    # Reddit monitoring logic
├── twitter_monitor.py   # Twitter/X monitoring logic
├── response_generator.py # AI response generation
├── requirements.txt     # Python dependencies
├── .env.example         # Environment template
└── README.md            # This file
```

## API Rate Limits

- **Reddit**: 60 requests/minute (be mindful in scan loops)
- **Twitter**: Varies by API tier (Basic: 10,000 tweets/month read)
- **AI APIs**: Check your plan limits

## Troubleshooting

### "Reddit monitor not configured"
- Verify `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET` are set in `.env`

### "Twitter monitor not configured"
- Verify `TWITTER_BEARER_TOKEN` is set in `.env`
- Check your Twitter API access level supports recent search

### "Response generator not configured"
- Set either `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` in `.env`

### Rate limit errors
- Reduce scan frequency
- Use more specific subreddit/keyword lists
