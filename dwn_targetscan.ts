import cp, { execSync } from "child_process";
const { chromium } = require("playwright");
import * as fs from "fs/promises";
import path from "path";
// import { html2csv } from "./html2csv";

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

let columnList = `
Target gene	
Representative transcript	
Gene name	
Representative miRNA	
Cumulative weighted context++ score
`;

function onlyUnique(value: any, index: any, self: string | any[]) {
  return self.indexOf(value) === index;
}

async function runBrowserAndDownloadTable(input: string, outpurDir: string) {
  let list = input.trim().split("\n");
  let uniqueItems = list.filter(onlyUnique);
  await fs.mkdir(outpurDir, { recursive: true });
  // console.log("uniqueItems:", uniqueItems);

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

    await page.goto("http://www.targetscan.org/mmu_72/");

    await page.fill('input[name="mirg"]', element);

    await page.click("text=Submit");

    await page.click("text=Download table");

    await page.waitForSelector("[href*='.txt']");

    let href =
      (await page.evaluate(() =>
        document.querySelector("[href*='.txt']")?.getAttribute("href")
      )) || "";

    let fileName = href.split("temp/")[1];
    let fullLink = `http://www.targetscan.org` + href;

    console.log("href:", href);
    console.log("fileName:", fileName);

    let command = [
      `wget ${fullLink}`,
      ` && `,
      `mv ${fileName} ${outpurDir}/${element}.csv`,
    ].join(" ");
    console.log("command:", command);

    execSync(command, { stdio: "inherit" });

    console.log("\n----------------------------------\n");
  }

  browser.close();
  console.log("FINISH check:", outpurDir);
}

(async () => {
  // await runBrowserAndDownloadTable(input0997, "./0997");
  await runBrowserAndDownloadTable(input1338, "./ts1338");
})();
