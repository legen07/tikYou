import { chromium } from "playwright";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, readFile } from "fs/promises";
let videos;

try {
  videos = JSON.parse(await readFile("videos.json"));
} catch (e) {
  videos = [];
}

const browser = await chromium.connectOverCDP("http://localhost:9222");

/* const context = await chromium.connectOverCDP("http://localhost:9222",{
  headless: false,
  slowMo: 3000,
  args: ["--window-position=1300,0"],
  viewport: { width: 640, height: 1000 },
}); */

const context = browser.contexts()[0];

/* const context = await browser.newContext({
  args: ["--window-position=1300,0"],
}); */


const youtube = await context.newPage();
// let tiktok() = await context.newPage();

function tiktok() {
  for (let i = 0; i < context.pages().length; i++) {
    if (context.pages()[i].url().includes("tiktok.com")) {
      console.log(context.pages()[i].url());
      return context.pages()[i];
    }
  }
}

// console.log(toktik().url())


// await tiktok().pause()
try {
  await youtube.bringToFront();
  await youtube.pause();


  /* class TiktokMethods {
    constructor(stages) {
      this.stages = stages || [];

      console.log("This is the class working hard")
      this.startWatchers();
    }

    async startWatchers() {
      await tiktok().on("close", async (error) => {
        console.log("Tiktok is closed");


        if (await tiktok().getByText("We're having trouble playing this video. Please refresh and try again.").count()) {
          console.log("We're having trouble some Uping and downing.")
          console.log("Does this code gets here ? ")
          await up_Down();
        }
      })
    }

    add(fn) {
      this.stages.push(fn);
    }

    async run(stage = 0) {
      console.trace("This is the methods class.")
      for (; stage < this.stages.length; stage++) {
        await (async () => { await this.stages[stage] })();
      }
    }
  }
 */
  async function up_Down() {
    await tiktok().keyboard.press("ArrowUp");
    await tiktok().waitForTimeout(1000);
    await tiktok().keyboard.press("ArrowDown");
    await tiktok().waitForTimeout(1000);
  }

  console.log(tiktok().url())
  tiktok().setDefaultTimeout(200_000);
  youtube.setDefaultTimeout(200_000);

  //? LET's GET OBSTACLEs HERE

  const someWentWrongElement = tiktok().locator("main#main-content-homepage_hot div[class*='DivErrorWrapper'] div[class*='DivErrorContainer']");

  if (await someWentWrongElement.count()) await reloadFix();

  async function reloadFix() {
    console.log("Reloading because something went wrong.")
    await tiktok().reload();
    await tiktok().waitForTimeout(2000);
    await findRightVid();

  };

  await tiktok().evaluate(() => {
    const observer = new MutationObserver(async () => {

      if (await tiktok().locator("main#main-content-homepage_hot div[class*='DivErrorWrapper'] div[class*='DivErrorContainer']").count()) {
        await reloadFix();

      } else if (await tiktok().getByRole('heading', { name: 'Choose your interests' }).count()) {
        await tiktok().waitForTimeout(1000);
        await tiktok().getByRole('button', { name: 'Skip' }).click();
        await tiktok().waitForTimeout(1000);
      } else if (await tiktok().getByText('Introducing keyboard').count()) {
        await tiktok().waitForTimeout(1000);

        await tiktok().locator('.css-zgownm-7937d88b--DivXMarkWrapper > svg').click();
        await tiktok().waitForTimeout(1000);
      } else if (await tiktok().getByText("We're having trouble playing this video. Please refresh and try again.").count()) {
        await up_Down();
        await tiktok().waitForTimeout(1000);
        await findRightVid();
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    document.addEventListener("something", async () => {
      console.log("Something happened.");
      await reloadFix();
    })
  })

  async function retry(fn, retries = 3, delay = 1000) {
    try {
      await fn()
    } catch (e) {
      if (retries === 0) throw e;
      await new Promise((r) => setTimeout(r, delay));
      console.log("Refreshing the web page.");
      await retry(fn, retries - 1, delay);
    }
  }

  if (!youtube.url().includes("studio.youtube.com")) {
    console.log("Navigating to Youtube.");
    await retry(async () => {
      if ((await youtube.getByRole('link', { name: 'YouTube Studio dashboard' }).count())) {
        return
      }
      try {
        await youtube.goto("https://studio.youtube.com", { waitUntil: "domcontentloaded" });
      } catch (err) {
        console.log("There was an error navigating to youtube.");
        console.log(err);
        throw err
      }

    });
  }

  await retry(async () => {

    let shouldFind = true;

    if (!tiktok().url().includes("tiktok.com") || (await tiktok().evaluate(() => document.readyState)) !== "complete") {
      console.log("Navigating to Tiktok.")
      try {
        await tiktok().goto("http://tiktok.com/foryou", { waitUntil: "domcontentloaded" });
      } catch (err) {
        console.log("There was an error navigating to tiktok().");
        console.log(err);
        shouldFind = false;
        throw err;
      } finally {
        if (shouldFind) await findRightVid();
      }
    } else {
      await findRightVid();
    }
  });


  // const tik = new TiktokMethods(stages);

  async function findRightVid() {
    const o = { K: 1, M: 1000 };

    console.log("Lets find the right video.")
    // tik.run();
    await tiktok().waitForTimeout(2_000)
    await tiktok().keyboard.press("ArrowDown")
    const page = async () => (
      await tiktok()
        .locator(
          "main #column-list-container article[id^='one-column-item-']"
        )
        .all()
    )[1]
    console.log("Line 207")

    const video = (await page()).locator(
      " section[id^='media-card-'][aria-label='Watch in full screen']"
    );

    console.log("Line 213")

    const shouldDownload = async () => {
      const likesCount = await (await page()).locator(
          "[class*='--SectionActionBarContainer']  button[aria-label^='Like video'] strong"
        )
        .textContent();

      const [full, num, k_m] = /(.*)([a-zA-Z])/.exec(likesCount) ?? [
        null,
        null,
        null,
      ];
      const x = k_m ? num * o[k_m] : 0;

      await video.click({ button: "right" });

      return (
        (await tiktok()
          .locator(
            "[data-floating-ui-portal] .TUXPopover-popover .TUXMenuItem[data-e2e='right-click-menu-popover_download-video']"
          )
          .count()) && x > 100
      );
    };

    async function writeVideos(isPosted = false) {

      videos[0].isPosted = isPosted;

      try {
        JSON.parse(await writeFile("videos.json", JSON.stringify(videos)));
      } catch (e) {
        JSON.parse(await writeFile("videos.json", JSON.stringify(videos)));
      }
    }

    async function postYou() {

      const { fileName, comment, isPosted } = videos[0];

      if (isPosted) findRightVid();


      await youtube.getByRole('button', { name: 'Create', exact: true }).click();

      await youtube.getByRole('menuitem', { name: 'Upload videos' }).locator('yt-formatted-string').click();

      console.log(await youtube.locator(
        "ytcp-uploads-file-picker#ytcp-uploads-dialog-file-picker input[name='Filedata']"
      ))
      await youtube.setInputFiles(
        "ytcp-uploads-file-picker#ytcp-uploads-dialog-file-picker input[name='Filedata']",
        `./downloads/${fileName}.mp4`
      );

      await youtube.getByRole('textbox', { name: 'Add a title that describes' }).fill(comment);

      await youtube.getByRole('radio', { name: 'No, it\'s not made for kids' }).click();

      await youtube.getByRole('button', { name: 'Next' }).click();
      await youtube.getByRole('button', { name: 'Next' }).click();
      await youtube.getByRole('button', { name: 'Next' }).click();

      await youtube.getByRole('radio', { name: 'Public' }).click();
      await youtube.getByRole('button', { name: 'Publish' }).click();

      await writeVideos(true);
    }

    if (!(await shouldDownload())) {
      findRightVid();
      await tiktok().keyboard.press("Escape")
      console.log("Log this in.")
    } else {
      (await tiktok()
        .locator("[data-floating-ui-portal] .TUXPopover-popover a")
        .count()) &&
        (await tiktok()
          .locator("[data-floating-ui-portal] .TUXPopover-popover a")
          .click());

      const fileName = /(?<=\/video\/)\d+(?=\?)/.exec(tiktok().url());

      const command = `yt-dlp -o "./downloads/${fileName}.mp4" "${tiktok().url()}"`;
      const execAsync = promisify(exec);
      const { stdout, stderr } = await execAsync(command);
      console.log("Stdout : ", stdout);
      console.log("Stderr : ", stderr);

      if (await video.locator('#media-card-3').getByRole('button', { name: 'more' }).count()) await video.locator('#media-card-3').getByRole('button', { name: 'more' }).click();


      const comment = await (await page()).locator("[class*='DivOverlayBottomContent'] [class*='DivMediaCardDescriptionContainer'] [data-e2e='desc-span-0']").textContent() || "🥳🎉";

      videos.unshift({ fileName, isPosted: false, comment });
      await postYou();

      await writeVideos();

      const caption = comment.replace(/#[^\s#]+/g, "").replace(/\s{2,}/g, " ").trim();
      const tags = comment.match(/#[^\s#]+/g) || [];
    }

    console.log("Are you reaching here ? ")
  }

  await context.close();
} catch (err) {
  console.log("This is a javascript err.");
  console.log(err);
  /* await tiktok().evaluate(() => {
    document.dispatchEvent(new Event("something"))
  }) */
};
