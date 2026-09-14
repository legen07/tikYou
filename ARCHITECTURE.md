# Architecture

## Overview

**tikYou** is a multi-module automation pipeline built with Node.js and Playwright. The architecture follows a modular design pattern where each module handles a specific responsibility.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    tikYou Pipeline                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐    ┌──────────┐    ┌───────────────────┐ │
│  │  index.js │───▶│ tiktok.js │───▶│  youtube.js      │ │
│  │  (Orchestrator)│  │(Scraper) │    │  (Uploader)      │ │
│  └──────────┘    └──────────┘    └───────────────────┘ │
│       │               │                │               │
│       ▼               ▼                ▼               │
│  ┌──────────┐    ┌──────────┐    ┌───────────────────┐ │
│  │smartAuto-│    │organic-  │    │  videos.json     │ │
│  │mation.js │    │Typer.js  │    │  (Config)         │ │
│  └──────────┘    └──────────┘    └───────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Module Responsibilities

### index.js — Orchestrator
- Central pipeline management
- Coordinates between modules
- Handles error propagation
- Manages the overall execution flow

### tiktok.js — Video Scraper
- Scrapes TikTok for target videos
- Downloads video files
- Extracts metadata (title, author, duration)
- Handles TikTok API interactions

### youtube.js — Video Uploader
- Authenticates with YouTube API
- Uploads processed videos
- Sets metadata (title, description, tags)
- Manages YouTube playlist organization

### smartAutomation.js — Automation Engine
- Schedules video processing
- Implements intelligent retry logic
- Manages browser session lifecycle
- Implements rate limiting

### organicTyper.js — Interaction Simulation
- Simulates organic user interactions
- Adds random delays and behaviors
- Mimics human typing patterns
- Prevents bot detection

## Data Flow

1. **Configuration**: `videos.json` defines the video queue
2. **Scraping**: `tiktok.js` fetches videos from TikTok
3. **Processing**: Videos are processed through the pipeline
4. **Upload**: `youtube.js` uploads to YouTube
5. **Logging**: `posted.json` tracks published content

## Configuration

| File | Purpose | Format |
|------|---------|--------|
| `package.json` | Project config & dependencies | JSON |
| `videos.json` | Video queue configuration | JSON |
| `posted.json` | Published video log | JSON |
| `.nvmrc` | Node.js version requirement | Text |

## Browser Management

- **Engine**: Playwright with Chromium
- **Debug Mode**: Remote debugging on port 9222
- **Profile**: Persistent Chrome profile at `chromeum/`
- **Session**: Cached sessions to avoid re-authentication

## Error Handling Strategy

- Try/catch blocks around all async operations
- Automatic retry with exponential backoff
- Detailed error logging for debugging
- Graceful degradation on failure

## Security Architecture

- No hardcoded credentials
- Environment-based configuration
- `.gitignore` excludes sensitive runtime data
- Pre-commit hooks validate no secrets are committed
