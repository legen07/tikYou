# README

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-blue.svg)](https://nodejs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-v1.57.0-green.svg)](https://playwright.dev/)
[![npm](https://img.shields.io/badge/npm-%3E%3D9.0.0-orange.svg)](https://www.npmjs.org/)
[![GitHub last commit](https://img.shields.io/github/last-commit/legen07/tikYou)](https://github.com/legen07/tikYou/commits/main)
[![GitHub contributors](https://img.shields.io/github/contributors/legen07/tikYou)](https://github.com/legen07/tikYou/graphs/contributors)
[![Open Issues](https://img.shields.io/github/issues/legen07/tikYou)](https://github.com/legen07/tikYou/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen)](CONTRIBUTING.md)

---

**tikYou** is a fully automated pipeline that downloads videos from TikTok and posts them to YouTube. It uses **Playwright** to control a headless Chrome browser, handling the end-to-end workflow of scraping, processing, and publishing content — with zero manual intervention.

> ⚡ *One command. Every video. Every day.*

---

## 🚀 Features

- **Automated TikTok Scraping** — Fetches videos from TikTok based on configurable criteria
- **Zero-Click YouTube Publishing** — Automatically uploads processed videos to YouTube
- **Headless Browser Automation** — Powered by Playwright with full Chrome control
- **Configurable Pipeline** — JSON-driven configuration for videos, schedules, and metadata
- **Session Persistence** — Maintains browser sessions to avoid re-authentication
- **Robust Error Handling** — Automatic retries and detailed logging

---

## 📦 Installation

### Prerequisites

- [Node.js ≥ 18.0.0](https://nodejs.org/en/download/)
- [Google Chrome](https://www.google.com/chrome/)
- [Git](https://git-scm.com/)

### Clone & Setup

```bash
# Clone the repository
git clone git@github.com:legen07/tikYou.git
cd tikYou

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

---

## 🛠️ Usage

### Development

```bash
# Start Chrome with remote debugging
npm run dev

# Run the automation
npm start
```

### Configuration

Edit `videos.json` to manage your video queue:

```json
{
  "videos": [
    {
      "id": "video_id",
      "url": "https://www.tiktok.com/@user/video/id",
      "status": "pending"
    }
  ]
}
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Run the main automation pipeline |
| `npm run dev` | Launch Chrome with remote debugging enabled |
| `npm test` | Run test suite |

---

## 📁 Project Structure

```
tikYou/
├── index.js              # Main entry point & orchestration logic
├── tiktok.js             # TikTok scraping & downloading module
├── youtube.js            # YouTube upload & publishing module
├── smartAutomation.js    # Intelligent scheduling & automation engine
├── organicTyper.js       # Organic content typing simulation
├── package.json          # Project configuration & dependencies
├── videos.json           # Video queue configuration
├── posted.json           # Published video log
├── .gitignore            # Git ignore rules
├── LICENSE               # MIT License
├── README.md             # This file
├── CONTRIBUTING.md       # Contribution guidelines
├── CODE_OF_CONDUCT.md    # Community guidelines
└── test/                 # Test suite
```

---

## 🤝 Contributing

Contributions are what make the open source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

See the [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev/) — Browser automation framework
- [Node.js](https://nodejs.org/) — JavaScript runtime
- [Google Chrome](https://www.google.com/chrome/) — Browser engine

---

<div align="center">

**Built with ❤️ by [Joe Legen](https://github.com/legen07)**

[![GitHub profile views](https://visit-count.vercel.app/api?user=legen07)](https://github.com/legen07)

</div>