import _ from "lodash";
import * as R from "rambda";
import * as fs from "fs";
import csv from "async-csv";
import {
  deGenesTables,
  finalJoinDir,
  finalJoinFullDir,
} from "../lib/constants";

async function main() {
  let finalList: any[] = [];
  let files = fs.readdirSync(finalJoinFullDir);
  for (const file of files) {
    if (file.includes("list")) continue;

    let fileBody = fs.readFileSync(finalJoinFullDir + `/${file}`, "utf-8");
    let rows: any[] = await csv.parse(fileBody, {
      // delimiter: ",",
      columns: true,
    });
    // console.log(rows[0], rows[1]);
    // let columns = Object.keys(rows[0]);
    // // выводим массив из названий колонок, для удобства
    // console.log("columns:", columns);

    let fixedRows: any[] = rows.map((__) =>
      _.omit(__, [
        // "jtb_ts",
        // "jtb_db",
        "symbol_ts",
        "target_gene_ts",
        "representative_transcript_ts",
        "gene_name_ts",
        "representative_mi_rna_ts",
        "cumulative_weighted_context_score_ts",
        "ensembl_ts,fold_change_ts",
        "padj_ts",
        "target_score_db",
        // "mirna_db",
        // "gene_symbol_db",
        "gene_description_db",
        "ensembl_db",
        "symbol_db",
        // "fold_change_db",
        "padj_db",
        "ensembl_ts",
        "fold_change_ts",
      ])
    );
    finalList = finalList.concat(fixedRows);
  }

  for (const elem of deGenesTables) {
    let items = R.pipe(
      R.filter<any>((__) => __.jtb_ts === elem && __.jtb_db === elem),
      R.map((__) => R.omit(["jtb_ts", "jtb_db"], __))
      // R.uniqWith(R.equals)
    )(finalList) as any;

    console.log("element:", elem, items.length);

    let stringWithoutSomeColumns = await csv.stringify(items, {
      // delimiter: ",",
      header: true,
    });
    fs.writeFileSync(
      `cytoscape/interaction_full_list_FC_${elem}.csv`,
      stringWithoutSomeColumns
    );
  }
}

main();
