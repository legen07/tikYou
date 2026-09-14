# Contributing to tikYou

Welcome, and thank you for your interest in contributing to **tikYou**! 🎉

This document provides guidelines and instructions for contributing to this project. Please read carefully before submitting contributions.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Reporting Issues](#reporting-issues)
- [Style Guides](#style-guides)
- [Questions?](#questions)

---

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the maintainers.

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **Google Chrome** (latest stable version)
- **Git** ≥ 2.30.0

### Fork & Clone

```bash
# Fork the repository on GitHub
# Then clone your fork locally:

git clone https://github.com/YOUR_USERNAME/tikYou.git
cd tikYou

# Add the upstream remote
git remote add upstream https://github.com/legen07/tikYou.git

# Keep your fork synced
git fetch upstream
git checkout main
git merge upstream/main
```

---

## Development Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Verify the setup
npx playwright install --dry-run
```

### Create a Feature Branch

Always create a new branch for your work. Never commit directly to `main`.

```bash
# Create a feature branch from main
git checkout -b feature/your-feature-name
```

---

## Commit Guidelines

This project follows the **[Conventional Commits](https://www.conventionalcommits.org/)** specification.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, semicolons, etc.) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks, dependency updates, build changes |
| `ci` | Changes to CI/CD configuration files |
| `perf` | Performance improvements |
| `revert` | Reverts a previous commit |

### Examples

```bash
# Feature addition
git commit -m "feat: add automatic video scheduling module"

# Bug fix
git commit -m "fix: resolve session timeout issue in youtube.js"

# Documentation
git commit -m "docs: update README with installation instructions"

# With scope
git commit -m "feat(tiktok): improve video metadata extraction"

# With body
git commit -m "feat: add video quality selection option

- Add support for 720p, 1080p, and 4K quality settings
- Update configuration schema to include quality parameter
- Add validation for quality values in videos.json"
```

### Commit Best Practices

1. **Write meaningful commit messages** — Explain *why*, not just *what*
2. **Keep commits focused** — One logical change per commit
3. **Use the imperative mood** — "Add feature" not "Added feature"
4. **Limit the subject line to 50 characters**
5. **Wrap the body at 72 characters**
6. **Never commit secrets, credentials, or API keys**

---

## Pull Request Process

### Before Creating a PR

1. **Ensure all tests pass:** `npm test`
2. **Update documentation** if your changes affect the public API or usage
3. **Squash related commits** into logical units
4. **Rebase against `main`** to ensure a clean merge

### Creating the Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request on the `legen07/tikYou` repository
3. Fill out the PR template completely
4. Assign appropriate labels
5. Request review from maintainers

### PR Review Workflow

- All PRs require at least **one approval** before merging
- CI checks must pass before merging
- Maintainers may request changes or ask for clarification
- **Squash and merge** is the preferred merge strategy
- Delete the feature branch after merging

### Commit Message Conventions for PRs

When you push commits, follow conventional commit format. Automated tools will use these messages to generate the `CHANGELOG.md`.

---

## Coding Standards

### JavaScript Style

- Use **ES6+** module syntax (`import`/`export`)
- Use `const` by default; use `let` only when reassignment is needed
- Avoid `var` entirely
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes and constructors
- Use **UPPER_SNAKE_CASE** for constants
- Use **2-space indentation**
- Always use **single quotes** (`'`) for strings
- Always use **semicolons**
- Use trailing commas in multiline objects and arrays

### File Organization

- Each module should have a single responsibility
- File names should be lowercase with hyphens: `tiktok-scraper.js`
- Place utility functions in a `utils/` directory
- Keep configuration in JSON or `.js` config files at the root

### Error Handling

- Always use `try/catch` blocks for async operations
- Throw descriptive error messages
- Never silently swallow errors
- Log errors with appropriate severity levels

### Naming Conventions

```javascript
// ✅ Good
const videoUrl = 'https://...';
function downloadVideo() { ... }
class VideoProcessor { ... }
const MAX_RETRIES = 3;

// ❌ Bad
const url = 'https://...';
function dVid() { ... }
class videoProcessor { ... }
const max_retries = 3;
```

---

## Reporting Issues

Use the [GitHub Issue Tracker](https://github.com/legen07/tikYou/issues). Before filing an issue:

1. **Search existing issues** to avoid duplicates
2. **Check the `main` branch** for recent fixes
3. **Read the documentation** (README, wiki)

### Issue Template

When reporting a bug, include:

- **Description**: What happened?
- **Expected behavior**: What should have happened?
- **Steps to reproduce**: How can we recreate the issue?
- **Environment**: OS, Node.js version, Chrome version
- **Logs**: Relevant error messages or stack traces
- **Screenshots**: If applicable

---

## Style Guides

### Git Workflow

```
main ────────────────────────────────────────
        \          \          \
         feature/   fix/       hotfix/
          branch     branch      branch
              \      /
               └────┘
               Merge via PR
```

- **Feature branches** for new functionality
- **Fix branches** for bug fixes
- **Hotfix branches** for urgent production fixes
- **Never commit to `main` directly**

### Branch Naming Convention

```
<type>/<short-description>
```

Examples:
- `feature/automatic-scheduling`
- `fix/session-timeout`
- `hotfix/critical-upload-bug`
- `docs/readme-update`
- `chore/dependency-update`
- `test/playwright-tests`

---

## Questions?

- **Email**: Open an issue and tag it with `question`
- **Discussions**: Use GitHub Discussions for general questions
- **Direct**: Reach out to maintainers via GitHub mentions

---

## 🎁 Recognition

Contributors are recognized in the [CONTRIBUTORS](CONTRIBUTORS.md) file and on the project's contributor graph.

---

Thank you for contributing! 🚀
