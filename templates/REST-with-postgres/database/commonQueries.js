const { executeQuery } = require("./connect");

const selectAll = async (tableName) => {
  return await executeQuery(`SELECT * from $1`, [tableName]);
};

const createTable = async (tableName, columns) => {
  const columnsAsString = columns
    .map(
      (column) =>
        `${column.name} ${column.dataType} ${
          column.lenth !== undefined && "(" + column.lenth + ")"
        } ${column.primaryKey && "PRIMARY KEY"} ${
          column.notNull && "NOT NULL"
        } ${column.unique && "UNIQUE"} `
    )
    .join(",");
  return await executeQuery(`CREATE TABLE IF NOT EXISTS $1 ($2)`, [
    tableName,
    columnsAsString,
  ]);
};

const insertRow = async (intoTableName, withValues) => {
  const columnNames = Object.keys(withValues).join(",");
  const valuesAsString = Object.values(withValues).join(",");
  return await executeQuery(`INSERT INTO $1($2) Values($3)`, [
    intoTableName,
    columnNames,
    valuesAsString,
  ]);
};

const updateRow = async (fromTableName, withValues, forIndex) => {
  const columnNames = Object.keys(withValues);
  const columnValues = Object.values(withValues);
  const setValueString = columnNames
    .map((columnName, index) => `${columnName} = ${columnValues[index]}`)
    .join(",");
  return await executeQuery(`UPDATE $1 SET $2 where id = $3`, [
    fromTableName,
    setValueString,
    forIndex,
  ]);
};

const deleteRow = async (fromTableName, forIndex) => {
  return await executeQuery(`DELETE FROM $1 where id = $2`, [
    fromTableName,
    forIndex,
  ]);
};

module.exports = {
  selectAll,
  insertRow,
  updateRow,
  deleteRow,
  createTable,
};
