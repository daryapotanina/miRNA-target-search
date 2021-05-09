import knex from "knex";
import * as fs from "fs";
import { deGenesTables, sql, targetscanDirName } from "../lib/constants";

async function main() {
  let files = fs.readdirSync(targetscanDirName);
  let joinTable = `mf_wt`;

  for (const file of files) {
    let tableName = file
      .replace(".csv", "_targetscan")
      .replace(/-/g, "_")
      .toLowerCase();
    // let tableNameFianl_old = tableName + "_result_" + joinTable;
    let tableNameFianl = tableName + "_final";

    // await sql.schema.dropTableIfExists(tableNameFianl_old);
    await sql.schema.dropTableIfExists(tableNameFianl);

    let joinList = deGenesTables;

    let unionAllList = joinList.map((__) =>
      sql
        .select(sql.raw(`'${__}' as join_table_name_ts, *`))
        .from(tableName)
        .join(__, `${tableName}.target_gene`, "=", `${__}.symbol`)
        .where(`${tableName}.cumulative_weighted_context_score`, "<=", -0.4)
    );

    let xxx = await sql
      .select(sql.raw(`* into ${tableNameFianl}`))
      .from(sql.unionAll(unionAllList).as("al"));
    console.log("xxx:", xxx);
  }

  await sql.destroy();
}

main();
