import { test } from "@playwright/test";
import start from "../index.js";

test("basic test", async ({page}) => {
  await start(page);
});
