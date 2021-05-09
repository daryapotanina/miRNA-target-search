import knex from "knex";
import * as fs from "fs";
import { execSync } from "child_process";
import { deGenesTables, mirdbDirName, sql } from "../lib/constants";

async function main() {
  let files = fs.readdirSync(mirdbDirName);

  for (const file of files) {
    let tableName = file
      .replace(".csv", "_mirdb")
      .replace(/-/g, "_")
      .toLowerCase();
    let tableNameFianl = tableName + "_final";
    console.log(process.cwd());

    let xx = await sql.raw(
      `Copy (Select * From ${tableNameFianl}) To '${process.cwd()}/mirdb/${tableNameFianl}.csv' With CSV DELIMITER ',' HEADER;`
    );
  }

  await sql.destroy();
}

main();
