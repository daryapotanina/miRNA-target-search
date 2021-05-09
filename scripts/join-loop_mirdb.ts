import knex from "knex";
import * as fs from "fs";
import { deGenesTables, mirdbDirName, sql } from "../lib/constants";

async function main() {
  let files = fs.readdirSync(mirdbDirName);
  let joinTable = `mf_wt`;

  for (const file of files) {
    let tableName = file
      .replace(".csv", "_mirdb")
      .replace(/-/g, "_")
      .toLowerCase();
    let tableNameFianl_old = tableName + "_final_mirdb";
    let tableNameFianl = tableName + "_final";

    await sql.schema.dropTableIfExists(tableNameFianl_old);
    await sql.schema.dropTableIfExists(tableNameFianl);

    let joinList = deGenesTables;

    let unionAllList = joinList.map((__) =>
      sql
        .select(sql.raw(`'${__}' as join_table_name_db, *`))
        .from(tableName)
        .join(__, `${tableName}.gene_symbol`, "=", `${__}.symbol`)
        .where(`${tableName}.target_score`, ">=", 80)
    );

    let xxx = await sql
      .select(sql.raw(`* into ${tableNameFianl}`))
      .from(sql.unionAll(unionAllList).as("al"));
    console.log("xxx:", xxx);
  }

  await sql.destroy();
}

main();
