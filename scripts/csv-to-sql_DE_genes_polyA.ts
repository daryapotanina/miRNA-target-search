import knex from "knex";
import * as fs from "fs";
import { execSync } from "child_process";
import { dbName, degenesDirName, sql } from "../lib/constants";

async function main() {
  let files = fs.readdirSync(degenesDirName);
  for (const file of files) {
    let tableName = file.replace(".csv", "").toLowerCase();
    let tableTemp = tableName + "_temp";

    await sql.schema.dropTableIfExists(tableName);
    await sql.schema.dropTableIfExists(tableTemp);
    await sql.schema.createTable(tableName, function (table) {
      table.string("ensembl");
      table.string("symbol");
      table.float("fold_change");
      table.double("padj");
    });
    let command = `psql -d ${dbName} -c "\\copy \\"${tableName}\\" FROM './${degenesDirName}/${file}' DELIMITER ';' CSV HEADER"`;
    console.log("command:", command);
    execSync(command, { stdio: "inherit" });

    console.log("element:", file, tableName);
  }

  await sql.destroy();
}

main();
