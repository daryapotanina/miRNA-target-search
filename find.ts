import cp from "child_process";
const { chromium } = require("playwright");
import * as fs from "fs/promises";

let x = `
mmu-miR-486a-5p
mmu-miR-486b-5p
mmu-miR-486a-3p
mmu-miR-455-5p
mmu-miR-451a
mmu-miR-144-5p
mmu-miR-144-3p
mmu-miR-466i-3p
mmu-miR-379-5p
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
mmu-miR-486a-5p
mmu-miR-486b-5p
mmu-miR-210-5p
mmu-let-7a-1-3p
mmu-miR-130b-5p
mmu-miR-32-5p
mmu-miR-29b-1-5p
mmu-miR-122-5p
`;

function onlyUnique(value: any, index: any, self: string | any[]) {
  return self.indexOf(value) === index;
}

let list = x.trim().split("\n");
let uniqueItems = list.filter(onlyUnique);

(async () => {
  let dir = await fs.readdir("./html");

  for (let index = 0; index < list.length; index++) {
    const mir = list[index];
    let x = dir.find((__) => __ ===   `${mir}.html`);
    console.log("element:", mir, x);
    // console.log("element:", miR);
  }
})();
