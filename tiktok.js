import { chromium } from "playwright";
import { exec } from "child_process";
import { promisify } from "util";
// import process from "process";
import { writeFile, readFile } from "fs/promises";
import https from "https";

let videos, posted;
async function _() {
  async function startMbps(retries = 29) {
    try {
      const waitMbps = await new Promise((reso, rej) => {
        let konJi = Date.now();
        let totalBytes = 0;
        const req = https.get(
          "https://nbg1-speed.hetzner.com/100MB.bin",
          { timeout: 10_000 },
          (res) => {
            res.on("data", (chunk) => {
              totalBytes += chunk.length;

              retries = 29;
              const elapsed = (Date.now() - konJi) / 1000;

              if (elapsed >= 5) {
                req.destroy();
                reso(totalBytes);
              }
            });

            res.on("error", rej);
          },
        );
        req.setTimeout(100_000);
        req.on("error", rej);
      });

      return (await waitMbps) * 0.000001;
      // return Math.floor(totalBytes * 0.001)
    } catch (err) {
      console.log("Request failed : ", err.code);

      if (retries > 0) {
        console.log("Retrying the network checking. ");

        return startMbps(retries - 1);
      } else {
        console.log("Have tried and tried and trie. Now I am tied.");
        console.log("Now Let's start the whole automation from Scratch.");
        setTimeout(_, 6e5);
        throw err.code;
        // throw () => {console.log("Hmm what are we throwing today.")};
        // return;
      }
    }
  }

  const foo = async (q, w) => {
    q = await startMbps();

    console.log("This is Q : ", q);
    w = 2e3 / (q + 0.1);

    return Math.floor(w);
  };

  const slowMo = (await foo()) * 2;

  console.log(slowMo);

  try {
    videos = JSON.parse(await readFile("videos.json"));
  } catch (e) {
    console.log(
      "There was a problem with the Videos Jason so i am assigning an empty array.",
    );
    videos = {};
  }

  try {
    posted = JSON.parse(await readFile("posted.json"));
  } catch (e) {
    console.log(
      "There was a problem with the posted Jason so i am assigning an empty array.",
    );
    posted = [];
  }

  console.log(videos);
  console.log(posted);

  const context = await chromium.launchPersistentContext("./thick_chrome", {
    headless: false,
    slowMo,
    args: ["--window-position=1300,0"],
    viewport: { width: 640, height: 1000 },
  });

  console.log(context.pages()[0].url());

  const tiktok = context.pages()[0];
  await __();
  async function __() {
    try {
      // await tiktok.pause();

      async function retry(fn, retries = 7, delay = 1000) {
        try {
          await fn();
        } catch (e) {
          if (retries === 0) throw e;
          await new Promise((r) => setTimeout(r, delay));
          console.log("Refreshing the web page.");
          await retry(fn, retries - 1, delay);
        }
      }

      async function gotoTiktok() {
        await retry(async () => {
          let shouldFind = true;
          console.log("Navigating to Tiktok.");
          try {
            await tiktok.goto("http://tiktok.com/foryou", {
              waitUntil: "load",
            });
          } catch (err) {
            console.log("There was an error navigating to tiktok.");
            console.log(err);
            shouldFind = false;
            throw err;
          } finally {
            // if (shouldFind) await findRightVid();
          }
        });
      }

      await gotoTiktok();

      console.log(tiktok.url());
      await tiktok.bringToFront();

      async function up_Down() {
        await tiktok.keyboard.press("ArrowUp");
        await tiktok.waitForTimeout(1000);
        await tiktok.keyboard.press("ArrowDown");
        await tiktok.waitForTimeout(1000);
      }

      console.log(tiktok.url());
      tiktok.setDefaultTimeout(200_000);

      //? LET's GET OBSTACLEs HERE

      const someWentWrongElement = tiktok.locator(
        "main#main-content-homepage_hot div[class*='DivErrorWrapper'] div[class*='DivErrorContainer']",
      );

      if (await someWentWrongElement.count()) await reloadFix();

      async function reloadFix() {
        console.log("Reloading because something went wrong.");
        // await tiktok.reload();
        await gotoTiktok();
        await tiktok.waitForTimeout(2000);
        await findRightVid();
      }

      try {
        //? Observer dependencies.
        await tiktok.exposeFunction("observedSomething", async () => {
          // console.log("I have observed something. "

          await tiktok.waitForTimeout(1000);

          const toktok = context.pages()[0];

          try {
            console.log(
              await tiktok
                .locator(
                  "main#main-content-homepage_hot div[class*='DivErrorWrapper'] div[class*='DivErrorContainer']",
                )
                .count(),
            );

            if (
              await tiktok
                .locator(
                  "main#main-content-homepage_hot div[class*='DivErrorWrapper'] div[class*='DivErrorContainer']",
                )
                .count()
            ) {
              console.log("Observed that there is an internet problem.");
              await reloadFix();
            }
            console.log(toktok.url());
            if (
              (await toktok
                .getByRole("heading", { name: "Choose your interests" })
                .count()) ||
              true
            ) {
              console.log("Then why stop here.");
            }

            console.log("This is after the If of observation.");

            if (
              await toktok
                .getByRole("heading", { name: "Choose your interests" })
                .count()
            ) {
              console.log(
                "Observed that the choose your interest dialogue has popped up.",
              );

              await toktok.waitForTimeout(1000);
              await toktok.getByRole("button", { name: "Skip" }).click();
              await toktok.waitForTimeout(1000);
            } else if (await toktok.getByText("Introducing keyboard").count()) {
              console.log(
                "Observed that the KeyBindings dialogue has popped up.",
              );
              await toktok.waitForTimeout(1000);

              await toktok
                .locator(".css-zgownm-7937d88b--DivXMarkWrapper > svg")
                .click();
              await toktok.waitForTimeout(1000);
            } else if (
              await toktok
                .getByText(
                  "We're having trouble playing this video. Please refresh and try again.",
                )
                .count()
            ) {
              console.log(
                "Observed that we are having trouble playing this video.",
              );
              await up_Down();
              await toktok.waitForTimeout(1000);
              await findRightVid();
            } else {
              console.log("Charlie it is stopping at If oo. ");
            }
          } catch (err) {
            console.log(err);
            console.log("This is the Observers conditions Catch.");
          }

          console.log("This is after everything run inside the observatory.");
        });

        //! Observer dependencies.
        await tiktok.exposeFunction("closeKeybinds", async () => {
          await tiktok
            .locator(
              "[class*='--DivFixedBottomContainer'] [class*='--DivXMarkWrapper'] svg",
            )
            .click();
        });
      } catch (err) {
        console.log("Close key binds has already been exposed. ", err);
      }

      await tiktok.evaluate(() => {
        const observer = new MutationObserver(async () => {
          console.log("We are observing something right now.");
          if (
            document.querySelector(
              "#column-list-container [id^='one-column-item'] [class*='--DivContentContainer'] p[class*='--StyledErrorText']",
            )
          ) {
            console.log("Log This fucking thing into the.");
            window.observedSomething();
          } else if (
            document.querySelector(
              "[class*='--BaseBodyContainer'] [class*='--DivFixedBottomContainer'] [class*='--DivKeyboardShortcutTitle']",
            )
          ) {
            await window.closeKeybinds();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      });

      await findRightVid();

      async function findRightVid() {
        const o = { K: 1, M: 1000 };

        console.log("Lets find the right video.");
        // console.log("Waiting for 2 seconds.");
        // await tiktok.waitForTimeout(2_000);

        if (
          await tiktok
            .locator(
              /* Related videos*/ ".TUXTabBar-list .TUXTabBar-itemTitle--active [style='display: block; white-space: nowrap;']",
            )
            .count()
        ) {
          console.log(
            await tiktok
              .locator(
                /*Related videos*/ ".TUXTabBar-list .TUXTabBar-itemTitle--active [style='display: block; white-space: nowrap;']",
              )
              .count(),
          );

          await retry(async () => {
            let shouldFind = true;

            console.log("Navigating to Tiktok.");
            try {
              await tiktok.goto("http://tiktok.com/foryou", {
                waitUntil: "load",
              });
            } catch (err) {
              console.log("There was an error navigating to tiktok.");
              console.log(err);
              shouldFind = false;
              throw err;
            } finally {
              if (shouldFind) await findRightVid();
            }
          });
        }

        console.log("Scroling down.");
        await tiktok.keyboard.press("ArrowDown");

        console.log("Watching video for 2 seconds.");
        await tiktok.waitForTimeout(2_000);
        const page = async () =>
          (
            await tiktok
              .locator(
                /* Main content */
                "main #column-list-container article[id^='one-column-item-']",
              )
              .all()
          )[1];

        const video = (await page()).locator(
          /* Active video */
          " section[id^='media-card-'][aria-label='Watch in full screen']",
        );

        //  console.log(await video.locator("[class*='DivOverlayBottomContent'] [class*='DivMediaCardDescriptionContainer'] [data-e2e='video-desc']").textContent())

        const shouldDownload = async () => {
          const likesCount = await (
            await page()
          )
            .locator(
              /*Likes Button*/
              "[class*='--SectionActionBarContainer']  button[aria-label^='Like video'] strong",
            )
            .textContent();

          const [, num, k_m] = /(.*)([a-zA-Z])/.exec(likesCount) ?? [
            null,
            null,
            null,
          ];
          const x = k_m ? num * o[k_m] : 0;

          console.log("This is X : ", x);

          await video.click({ button: "right" });

          return (
            (await tiktok
              .locator(
                /*Download button*/
                "[data-floating-ui-portal] .TUXPopover-popover .TUXMenuItem[data-e2e='right-click-menu-popover_download-video']",
              )
              .count()) && x > 500
          );
        };

        async function writeVideos() {
          try {
            await writeFile("videos.json", JSON.stringify(videos));
          } catch (e) {
            await writeFile("videos.json", JSON.stringify(videos));
          }
        }

        let vidLink;
        if (!(await shouldDownload())) {
          console.log("Not downloading this video.");
          console.log("Pressing Escape key.");
          await tiktok.keyboard.press("Escape");
          // console.log("waiting for half second.")
          await tiktok.waitForTimeout(100);
          await findRightVid();
          console.log("Log this in.");
        } else {
          console.log("I love this video.");
          if (
            await tiktok
              .locator(
                /*Details button*/ "[data-floating-ui-portal] .TUXPopover-popover a",
              )
              .count()
          ) {
            vidLink =
              "tiktok.com" +
              (await tiktok
                .locator(
                  /*Details button*/ "[data-floating-ui-portal] .TUXPopover-popover a.link-a11y-focus",
                )
                .getAttribute("href"));

            console.log("vidLink : ", vidLink);
          } else {
            await findRightVid();
          }

          const fileName = /(?<=\/video\/)\d+(?=\?)/.exec(vidLink);

          if (videos[fileName]) {
            console.log("We already have this video. So will find another. ");
            findRightVid();
          }
          const command = `bash bashVideo.sh "${vidLink}"`;
          const execAsync = promisify(exec);
          const { stdout, stderr } = await execAsync(command);
          console.log("Stdout : ", stdout);
          console.log("Stderr : ", stderr);

          if (await video.getByRole("button", { name: "more" }).count())
            await video.getByRole("button", { name: "more" }).click();

          const comment =
            (await video
              .locator(
                "[class*='DivOverlayBottomContent'] [class*='DivMediaCardDescriptionContainer'] [data-e2e='video-desc']",
              )
              .textContent()) || "🥳🎉";

          // videos.unshift({ fileName, isPosted: false, comment });

          // await writeVideos();

          const caption = comment
            .replace(/#[^\s#]+/g, "")
            .replace(/\s{2,}/g, " ")
            .trim();
          const tags = comment.match(/#[^\s#]+/g) || [];

          const newVidObj = {
            [fileName]: {
              caption,
              tags,
            },
          };

          Object.assign(videos, newVidObj);

          console.log("This is the new Obj", newVidObj);


          await writeVideos();
        }

        await tiktok.waitForTimeout(2_000);
        console.log("Lets start all over.");
        await findRightVid();
      }

      await context.close();
    } catch (err) {
      console.log("This is a javascript err.");
      console.log(err);
      console.log("Restarting the whole this once again.");

      await __();
    }
  }
}

await _();
