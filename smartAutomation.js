import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import { existsSync, mkdirSync } from 'fs';

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  // Maximum time for any operation (ms)
  operationTimeout: 200_000,

  // Check if page is frozen every X ms
  watchdogInterval: 500_000,

  // Maximum time page can be idle
  maxIdleTime: 6_000_000,

  // Retry failed operations
  maxRetries: 3,

  // Screenshot on error
  screenshotOnError: true,
  screenshotPath: './error-screenshots'
};

// ============================================
// ERROR HANDLER CLASS
// ============================================
class PlaywrightWatchdog {
  constructor(page, onError) {
    this.page = page;
    this.onError = onError;
    this.lastActivity = Date.now();
    this.isRunning = false;
    this.watchdogTimer = null;
    this.errorCount = 0;

    this.setupListeners();
  }

  // Setup all error listeners
  setupListeners() {
    // Page crash
    this.page.on('crash', () => {
      this.handleError('PAGE_CRASH', 'Page crashed unexpectedly');
    });

    // Request failures
    this.page.on('requestfailed', (request) => {
      if (request.isNavigationRequest()) {
        this.handleError('REQUEST_FAILED', `Failed to load: ${request.url()}`);
      }
    });

    // Dialog appears (alert, confirm, prompt)
    this.page.on('dialog', async (dialog) => {
      this.handleError('UNEXPECTED_DIALOG', `Dialog appeared: ${dialog.message()}`);
      await dialog.dismiss();
    });

    // Page close
    this.page.on('close', () => {
      this.handleError('PAGE_CLOSED', 'Page was closed unexpectedly');
    });
  }

  // Start monitoring
  start() {
    this.isRunning = true;
    this.startWatchdog();
  }

  // Stop monitoring
  stop() {
    this.isRunning = false;
    if (this.watchdogTimer) {
      clearInterval(this.watchdogTimer);
    }
  }

  // Update last activity timestamp
  updateActivity() {
    this.lastActivity = Date.now();
  }

  // Start watchdog timer
  startWatchdog() {
    this.watchdogTimer = setInterval(() => {
      this.checkPageHealth();
    }, CONFIG.watchdogInterval);
  }

  // Check if page is healthy
  async checkPageHealth() {
    if (!this.isRunning) return;

    try {
      // Check if page is idle too long
      const idleTime = Date.now() - this.lastActivity;
      if (idleTime > CONFIG.maxIdleTime) {
        this.handleError('PAGE_IDLE', `Page idle for ${idleTime}ms`);
        return;
      }

      // Check if page is responsive
      const isResponsive = await Promise.race([
        this.page.evaluate(() => document.readyState),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]).catch(() => false);

      if (!isResponsive) {
        this.handleError('PAGE_UNRESPONSIVE', 'Page not responding');
      }

    } catch (error) {
      this.handleError('WATCHDOG_ERROR', `Watchdog check failed: ${error.message}`);
    }
  }

  // Handle errors
  async handleError(type, message) {
    this.errorCount++;

    const errorInfo = {
      type,
      message,
      timestamp: new Date().toISOString(),
      url: this.page.url(),
      errorCount: this.errorCount
    };

    console.error('🚨 ERROR DETECTED:', errorInfo);

    // Take screenshot
    if (CONFIG.screenshotOnError) {
      try {
        if (!existsSync(CONFIG.screenshotPath)) {
          mkdirSync(CONFIG.screenshotPath, { recursive: true });
        }

        const screenshotFile = `${CONFIG.screenshotPath}/error-${Date.now()}.png`;
        await this.page.screenshot({ path: screenshotFile });
        errorInfo.screenshot = screenshotFile;
        console.log('📸 Screenshot saved:', screenshotFile);
      } catch (e) {
        console.error('Failed to take screenshot:', e.message);
      }
    }

    // Call user-defined error handler
    if (this.onError) {
      await this.onError(errorInfo);
    }
  }
}

export { PlaywrightWatchdog, CONFIG };