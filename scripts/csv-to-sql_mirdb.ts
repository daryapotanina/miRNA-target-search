import knex from "knex";
import * as fs from "fs";
import { execSync } from "child_process";
import { dbName, mirdbDirName, sql } from "../lib/constants";

async function main() {
  let files = fs.readdirSync(mirdbDirName);
  for (const file of files) {
    let tableName = file
      .replace(".csv", "_mirdb")
      .replace(/-/g, "_")
      .toLowerCase();
    console.log("tableName:", tableName);

    await sql.schema.dropTableIfExists(tableName);
    await sql.schema.createTable(tableName, function (table) {
      table.float("target_score");
      table.string("mirna");
      table.string("gene_symbol");
      table.string("gene_description");
    });

    let command = `psql -d ${dbName} -c "\\copy \\"${tableName}\\" FROM './${mirdbDirName}/${file}' DELIMITER ',' CSV HEADER"`;
    console.log("command:", command);
    execSync(command, { stdio: "inherit" });

    console.log("element:", file, tableName);
  }

  await sql.destroy();
}

main();
