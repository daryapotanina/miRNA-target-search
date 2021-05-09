# Названия скриптов
* "dwn_mirdb.ts" и "dwn_targetscan.ts" запускают скачивание таблиц с мишенями микроРНК с сайтов соответствующих баз данных мишеней
* "csv-to-sql_***.ts" создают таблицы PSQL из скачанных таблиц с мишенями в формате CSV
* "join-loop_***.ts" делают inner join таблиц с мишенями с таблицами ДЭ генов
* "joined_dbs.ts" делает inner join таблиц из предыдущего пункта для получения только тех мишеней, которые есть в обеих базах даннных
* "export-loop_***.ts" экспортирует таблицы PSQL в CSV
* "csv-remove-column.ts" подготавливает CSV таблицу для импорта в Cytoscape (три разные таблицы для mf_wt, mf_d1338 и wt_d1338)
  
  Примечание: скачанные с сайтов таблицы подвергались удалению лишних столбцов и специфических символов.
# Запуск скриптов
```
npm install
node --require ts-node/register scripts/scriptName.ts
```
# Заметки по PSQL
https://gist.github.com/daryapotanina/b07fb32c8b6a4a858c23336200ca766d

# Запуск PSQL локально, обращение к базе данных

```
dropbd *** // удаление существующей базы данных
createdb *** // создание новой базы даннных
psql -d *** // подключение к базе
\d // показать список таблиц
\q // выход
```
# Критерии отбора достоверных мишеней
miRDB: target_score >=80
TargetScan: cumulative weighted context++ scores (cumulative_weighted_context_score) ≤ − 0.4