import knex from "knex";
import * as fs from "fs";
import {
  deGenesTables,
  mirdbFields,
  sql,
  targetscanDirName,
  tsFields,
} from "../lib/constants";

async function main() {
  let filesTs = fs.readdirSync(targetscanDirName);
  // let filesTs = fs.readdirSync(mirdbDirName);

  // let filesDb = fs.readdirSync(mirdbDirName);

  for (const file of filesTs) {
    let tableName = file.replace(".csv", "").replace(/-/g, "_").toLowerCase();
    // let tableNameFianl_old = tableName + "_result_" + joinTable;
    let tableNameDb = tableName + "_mirdb_final";
    let tableNameTs = tableName + "_targetscan_final";
    let tableNameFinal = tableName + "_res_join";

    // await sql.schema.dropTableIfExists(tableNameFianl_old);
    await sql.schema.dropTableIfExists(tableNameFinal);

    let select_fields_ts = tsFields
      .map((__) => tableNameTs + "." + __ + " as " + __ + "_ts")
      .join(",");
    let select_fields_db = mirdbFields
      .map((__) => tableNameDb + "." + __ + " as " + __ + "_db")
      .join(",");

    let xxx = await sql
      .select(sql.raw(`* into ${tableNameFinal}`))
      .from(
        sql
          .select(
            sql.raw(
              [
                `${tableNameTs}.join_table_name_ts as jtb_ts`,
                `${tableNameDb}.join_table_name_db as jtb_db`,

                select_fields_ts,
                select_fields_db,
              ].join(",")
            )
          )
          .from(tableNameTs)
          .join(
            tableNameDb,
            `${tableNameDb}.gene_symbol`,
            `=`,
            `${tableNameTs}.target_gene`
          )
          // fullOuterJoin
          .as("gd")
      )
      .as("al");

    console.log("xxx:", xxx);
  }

  await sql.destroy();
}

main();
