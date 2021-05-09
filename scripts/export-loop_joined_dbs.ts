import knex from "knex";
import * as fs from "fs";
import { execSync } from "child_process";
import { deGenesTables, mirdbDirName, sql } from "../lib/constants";

async function main() {
  let files = fs.readdirSync(mirdbDirName);

  for (const file of files) {
    let tableName = file.replace(".csv", "").replace(/-/g, "_").toLowerCase();
    let tableNameFianl = tableName + "_res_join";
    console.log(process.cwd());

    let xx = await sql.raw(
      `Copy (Select * From ${tableNameFianl}) To '${process.cwd()}/res_join/${tableNameFianl}.csv' With CSV DELIMITER ',' HEADER;`
    );
  }
  // .replace("_full", "")

  await sql.destroy();
}

main();
