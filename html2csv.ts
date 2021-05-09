import cp from "child_process";
import csvStringify from "csv-stringify/lib/sync";
import * as cheerio from "cheerio";
import * as fs from "fs/promises";

export async function html2csv(html: string): Promise<string> {
  const $ = cheerio.load(html);
  const trList: string[] = [];

  $("table")
    .eq(1)
    .find("tr")
    .each(function (i, elem) {
      trList[i] = $(elem).text();
    });

  let final = trList.slice(1).map((item) => {
    return item
      .split("\n")
      .filter((__) => __.trim())
      .filter((__, index) => index !== 0) // удаляем TargetDetail
      .map((__) => __.trim());
  });

  console.log("final:", final);

  let x = csvStringify([
    [
      // "TargetDetail",
      "TargetRank",
      "TargetScore",
      "miRNA",
      "GeneSymbol",
      "GeneDescription",
    ],
    ...final,
  ]);

  return x;
}

// (async () => {
//   let dir = await fs.readdir("./html");
//   await fs.mkdir("csv", { recursive: true });
//   for (let index = 0; index < dir.length; index++) {
//     const file = dir[index];
//     let x = await fs.readFile("./html/" + file);
//     let csvRaw = await html2csv(x.toString());
//     await fs.writeFile("./csv/" + file.replace("html", "csv"), csvRaw);
//   }
// })();
