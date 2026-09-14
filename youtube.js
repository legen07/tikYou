import { chromium } from "playwright";
import fs from "fs/promises";
import { organicTyper } from "./organicTyper.js";

const c = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  brightRed: "\x1b[91m",
  brightGreen: "\x1b[92m",
};

let videos, posted;

try {
  videos = JSON.parse(await fs.readFile("videos.json", "utf8"));
} catch (e) {
  console.log(c.red, "There was an error reading the videos.json file", e);
  videos = [];
}

try {
  posted = JSON.parse(await fs.readFile("posted.json", "utf8"));
} catch (e) {
  console.log(c.red, "There was an error reading the posted.json file.", e);
  posted = [];
}

const browser = await chromium.connectOverCDP("http://localhost:9222", {
  headless: false,
  slowMo: 3000,
});
const context = browser.contexts()[0];
const youtube = context.pages()[0];
// await youtube.pause();

async function _(isRerun) {
  try {
    await youtube.bringToFront();
    //await youtube.pause();

    youtube.setDefaultTimeout(200_000);

    //? LET's GET OBSTACLEs HERE

    async function retry(fn, retries = 3, delay = 1000) {
      try {
        await fn();
      } catch (e) {
        if (retries === 0) throw e;
        await new Promise((r) => setTimeout(r, delay));
        console.log("Refreshing the web page.");
        await retry(fn, retries - 1, delay);
      }
    }

    if (!youtube.url().includes("studio.youtube.com") || isRerun) {
      console.log("Navigating to Youtube.");
      await retry(async () => {
        try {
          await youtube.goto("https://studio.youtube.com", {
            waitUntil: "domcontentloaded",
          });
        } catch (err) {
          console.log("There was an error navigating to youtube.");
          console.log(err);
          throw err;
        }
      });
    }

    //? Post you dependencies
    const updateJasons = async (id) => {
      fs.writeFile("videos.json", JSON.stringify(videos));

      await fs.writeFile(
        "posted.json",
        JSON.stringify([...posted, id]),
      );

      delete videos[id];

      await fs.writeFile(
        "videos.json",
        JSON.stringify(videos)
      )

      await fs.rename(`./videos/${id}.mp4`, `./posted/${id}.mp4`);
    };

    await postYou();
    async function postYou() {
      const firstId = Object.keys(videos)[0];
      console.log(firstId);

      const { caption, tags } = videos[firstId];

      if (posted.includes(firstId)) {
        await youtube.waitForTimeout(10000);
        await updateJasons(firstId);
        await postYou();
      }

      await youtube
        .getByRole("button", { name: "Create", exact: true })
        .click();

      await youtube
        .getByRole("menuitem", { name: "Upload videos" })
        .locator("yt-formatted-string")
        .click();

      await youtube.setInputFiles(
        "ytcp-uploads-file-picker#ytcp-uploads-dialog-file-picker input[name='Filedata']",
        `./videos/${firstId}.mp4`,
      );

      await youtube.waitForTimeout(1000);

      await organicTyper(
        tags.join(" "),
        async (text) => {
          await youtube
            .getByRole("textbox", { name: "Add a title that describes" })
            .fill(text);
        },
        {
          baseDelay: 320,
          typoRate: 0.02,
          burstRate: 0.2,
          pauseRate: 0.05,
          pauseDuration: 800,
          backspaceDelay: 50,
          correctionGap: 25,
        },
      );

      await organicTyper(
        caption,
        async (text) => {
          await youtube
            .getByRole("textbox", { name: "Tell viewers about your video" })
            .fill(text);
        },
        {
          baseDelay: 320,
          typoRate: 0.04,
          burstRate: 0.2,
          pauseRate: 0.15,
          pauseDuration: 1200,
          backspaceDelay: 100,
          correctionGap: 250,
        },
      );

      await youtube
        .getByRole("radio", { name: "No, it's not made for kids" })
        .click();

      await youtube.getByRole("button", { name: "Next", exact: true }).click();

      await youtube.getByRole("button", { name: "Next", exact: true }).click();

      await youtube.getByRole("button", { name: "Next", exact: true }).click();

      await youtube.getByRole("radio", { name: "Public" }).click();

      await youtube.getByRole("button", { name: "Publish" }).click();

      console.log({firstId : videos[firstId]})
      
      await updateJasons(firstId);
      console.log("The video i just posted is ...");


      await youtube.waitForTimeout(100_000);

      if (
        await youtube.getByRole("heading", { name: "Video published" }).count()
      ) {
        await youtube
          .locator("#close-button")
          .getByRole("button", { name: "Close" })
          .click();
      }

      if (
        await youtube.getByRole("heading", { name: "Video processing" }).count()
      ) {
        await youtube
          .getByRole("button", { name: "Close", exact: true })
          .click();
      }

      if (
        await youtube.getByRole("heading", { name: "Video uploading" }).count()
      ) {
        await youtube
          .getByRole("button", { name: "Close", exact: true })
          .click();
      }

      const nextTime = Math.floor(Math.random() * 300) * 30_000;

      console.log(
        `Next video will be posted in ${nextTime / 60_000 + 10_000} minutes.`,
      );

      await youtube.waitForTimeout(nextTime + 10_000);
      await postYou();
    }

    await context.close();
  } catch (err) {
    console.log(err);
    if (err.name === "TimeoutError") {
      console.log(
        "There was a time out error so I am restarting in 10 minutes.",
      );
      await youtube.waitForTimeout(600_000);
      await _(true);
    }
  }
}
await _(true);
