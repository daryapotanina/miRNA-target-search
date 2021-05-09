import cp from "child_process";
const { chromium } = require("playwright");
import * as fs from "fs/promises";
import path from "path";
import { html2csv } from "./html2csv";

// let input0997 = `
// mmu-miR-486a-5p
// mmu-miR-486b-5p
// mmu-miR-451a
// mmu-miR-210-5p
// mmu-let-7a-1-3p
// mmu-miR-130b-5p
// mmu-miR-32-5p
// mmu-miR-29b-1-5p
// mmu-miR-122-5p
// `;

// no mmu-miR-486b-5p added mmu-miR-434-5p

let input1338 = `
mmu-miR-486a-5p
mmu-miR-486a-3p
mmu-miR-455-5p
mmu-miR-451a
mmu-miR-144-5p
mmu-miR-144-3p
mmu-miR-466i-3p
mmu-miR-379-5p
mmu-miR-434-5p
mmu-miR-409-3p
mmu-miR-300-3p
mmu-let-7c-1-3p
mmu-miR-134-5p
mmu-miR-99a-5p
mmu-miR-147-3p
mmu-miR-147-5p
mmu-miR-370-3p
mmu-miR-541-5p
mmu-miR-96-5p
mmu-miR-182-5p
mmu-miR-183-5p
`;

function onlyUnique(value: any, index: any, self: string | any[]) {
  return self.indexOf(value) === index;
}

async function runBrowserAndDownloadTable(input: string, outpurDir: string) {
  let list = input.trim().split("\n");
  let uniqueItems = list.filter(onlyUnique);
  await fs.mkdir(outpurDir, { recursive: true });
  console.log("uniqueItems:", uniqueItems);

  console.log("SIZE:", list.length);
  console.log("SIZE:", uniqueItems.length);

  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page: import("playwright").Page = await context.newPage();

  for (let index = 0; index < uniqueItems.length; index++) {
    const element = uniqueItems[index];
    console.log("element:", element);

    // Go to http://www.mirdb.org/
    await page.goto("http://mirdb.org/");

    // Select Mouse
    await page.selectOption("//select", "Mouse");

    // Click input[name="searchBox"]
    await page.click('input[name="searchBox"]');

    // Fill input[name="searchBox"]
    await page.fill('input[name="searchBox"]', element);

    // Click input[name="submitButton"]
    await page.click('input[name="submitButton"]');
    await page.waitForSelector('text="Gene Description"');
    await page.waitForLoadState();
    const bodyHandle = await page.$("body");
    const html = await page.evaluate(
      // @ts-ignore
      ([body, suffix]) => body.innerHTML + suffix,
      [bodyHandle, "hello"]
    );

    let fileName = path.join(outpurDir, "/", element + ".csv");

    console.log("fileName:", fileName);

    await page.waitForTimeout(2000);
    let csvRaw = await html2csv(html);
    await fs.writeFile(fileName, csvRaw);
    await page.waitForTimeout(300);
    console.log("\n----------------------------------\n");
  }

  browser.close();
  console.log("FINISH check:", outpurDir);
}

(async () => {
  // await runBrowserAndDownloadTable(input0997, "./0997");
  await runBrowserAndDownloadTable(input1338, "./db1338");
})();
