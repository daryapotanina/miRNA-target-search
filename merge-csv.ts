import _ from "lodash";
import csvParse from "csv-parse/lib/sync";
import csvStringify from "csv-stringify/lib/sync";
import * as fs from "fs/promises";
import path from "path";

interface Line {
  MirName: string;
  PolyAFileName: string;
  ENSEMBL: string;
  GeneSymbol: string;
  GeneDescription: string;
}
interface Response {
  res: Line[];
  before: number;
  after: number;
}

async function awesome(file: string, html: string): Promise<Response> {
  let newArray: Line[] = [];
  let tempSymbolList: string[] = [];
  let changedIndex: number[] = [];
  const records: Line[] = csvParse(html, {
    columns: true,
    skip_empty_lines: true,
  });

  for (let index = 0; index < records.length; index++) {
    const iter = records[index];
    if (tempSymbolList.includes(iter.GeneSymbol)) {
      let index = newArray.findIndex((__) => __.GeneSymbol === iter.GeneSymbol);
      changedIndex.push(index);
      let PolyAFileName =
        newArray[index].PolyAFileName + ", " + iter.PolyAFileName;
      newArray[index] = {
        ...newArray[index],
        PolyAFileName,
      };
      continue;
    }
    newArray.push(iter);
    tempSymbolList.push(iter.GeneSymbol);
  }
  // console.log("records:", records.length);
  // console.log("newArray:", newArray.length);
  // console.log("changedIndex:", changedIndex);
  // console.log("file:", file);

  // for (const iterator of changedIndex) {
  //   console.log(newArray[iterator]);
  // }

  let sorted = _.sortBy(newArray, [
    function (o: Line) {
      return o.PolyAFileName.length;
    },
  ]).reverse();

  // for (const iterator of sorted) {
  //   console.log(iterator.PolyAFileName);
  // }

  return {
    res: sorted,
    after: newArray.length,
    before: records.length,
  };
}

(async () => {
  let folder = "../results";
  let dir = await fs.readdir(path.join(folder));
  let i = 0;
  for (const iterator of dir) {
    // if (i >= 1) continue;
    let folderInResult = path.join(folder, "/", iterator);
    const stat = await fs.lstat(folderInResult);

    if (!stat.isDirectory() || iterator.includes("_final")) {
      continue;
    }
    let dir = await fs.readdir(folderInResult);
    console.log(" ----------------------------- ");
    console.log(" ");
    console.log("Start folder:", folderInResult);
    console.log(" ");

    let folderResults = [];
    for (const iter of dir) {
      // if (i >= 1) continue;
      let pathForFinalFile = path.join(folder, "/", iterator + "_final", "/");

      let fileBody = await fs.readFile(path.join(folderInResult, "/", iter));
      let { after, before, res } = await awesome(iter, fileBody.toString());

      // console.log("pathForFinalFile:", pathForFinalFile);
      await fs.mkdir(pathForFinalFile, { recursive: true });
      await fs.writeFile(
        path.join(pathForFinalFile, "/", iter),
        csvStringify(res, {
          header: true,
        })
      );
      folderResults.push({ file: iter, before, after });

      // console.log("element:", iter);
      i++;
    }

    console.table(folderResults);
  }
  //   // await fs.writeFile("./csv/" + file.replace("html", "csv"), csvRaw);
})();
