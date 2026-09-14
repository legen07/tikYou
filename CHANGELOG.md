# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project structure with Playwright automation
- TikTok video downloading module
- YouTube publishing module
- Browser session management
- Video queue configuration via `videos.json`
- Published video logging via `posted.json`

## [1.0.0] - 2026-01-10

### 🎉 Initial Release

#### Added
- **Automated TikTok to YouTube pipeline** — Full end-to-end video downloading and publishing automation
- **Playwright integration** — Headless Chrome browser control for web automation
- **Video scraper** (`tiktok.js`) — Scrapes and downloads TikTok videos
- **YouTube uploader** (`youtube.js`) — Automates YouTube video publishing
- **Smart automation engine** (`smartAutomation.js`) — Intelligent scheduling and automation logic
- **Organic typer** (`organicTyper.js`) — Simulates organic user interaction patterns
- **Main orchestrator** (`index.js`) — Central pipeline management
- **Configuration system** — `videos.json` for video queue, `posted.json` for published log
- **MIT License** — Full open-source licensing
- **Comprehensive .gitignore** — 139 entries covering Node.js, Playwright, browser caches
- **Project documentation** — README with setup instructions and usage guide

#### Technical Details
- **Runtime**: Node.js with ES modules (`"type": "module"`)
- **Browser**: Google Chrome via Playwright
- **Debugging**: Remote debugging port 9222
- **User Data Directory**: Persistent Chrome profiles for session management

---

## [0.1.0] - Initial Development

### Added
- First automation scripts
- Basic browser automation logic
- Initial project scaffolding

---

## Commit History

| Commit | Description |
|--------|-------------|
| `ee83209` | Initial commit |
| `5edfe8a` | First commitment |

---

## Links

- [Repository](https://github.com/legen07/tikYou)
- [Issues](https://github.com/legen07/tikYou/issues)
- [Releases](https://github.com/legen07/tikYou/releases)
