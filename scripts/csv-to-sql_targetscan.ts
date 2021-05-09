import knex from "knex";
import * as fs from "fs";
import { execSync } from "child_process";
import { dbName, sql, targetscanDirName } from "../lib/constants";

async function main() {
  let files = fs.readdirSync(targetscanDirName);
  for (const file of files) {
    let tableName = file
      .replace(".csv", "_targetscan")
      .replace(/-/g, "_")
      .toLowerCase();
    console.log("tableName:", tableName, file);

    await sql.schema.dropTableIfExists(tableName);
    await sql.schema.createTable(tableName, function (table) {
      table.string("target_gene");
      table.string("representative_transcript");
      table.string("gene_name");
      table.string("representative_mi_rna");
      table.float("cumulative_weighted_context_score");
    });

    let command = `psql -d ${dbName} -c "\\copy \\"${tableName}\\" FROM './${targetscanDirName}/${file}' DELIMITER E'\t' CSV HEADER"`;
    console.log("command:", command);

    execSync(command, { stdio: "inherit" });

    console.log("element:", file, tableName);

    console.log("................................");
  }
  await sql.destroy();
}

main();
