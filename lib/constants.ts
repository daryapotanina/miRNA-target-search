import knex from "knex";

export let mirdbDirName = "db1338";
export let targetscanDirName = "ts1338";
export let degenesDirName = "DE_genes_polyA";
export let dbName = "mir_targets";
export let finalJoinDir = "res_join";
export let finalJoinFullDir = "res_join_full";
export let deGenesTables = ["wt_d1338", "mf_d1338", "mf_wt"];

export const sql = knex({
  debug: true,
  client: "pg",
  connection: {
    database: dbName,
  },
});

export let tsFields = [
  "symbol",
  "target_gene",
  "representative_transcript",
  "gene_name",
  "representative_mi_rna",
  "cumulative_weighted_context_score",
  "ensembl",
  "fold_change",
  "padj",
];

export let mirdbFields = [
  "target_score",
  "mirna",
  "gene_symbol",
  "gene_description",
  "ensembl",
  "symbol",
  "fold_change",
  "padj",
];
