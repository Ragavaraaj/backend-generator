const { executeQuery } = require("./connect");

const selectAll = async (tableName) => {
  return await executeQuery(`SELECT * from ${tableName}`);
};

const createTable = async (tableName, columns) => {
  const columnsAsString = columns
    .map((column) => {
      const {
        name: NAME,
        dataType: DATA_TYPE,
        dataTypeLength = "",
        notNull = false,
        unique = false,
        primaryKey = false,
      } = column;

      const DATATYPE_LENGTH = dataTypeLength ? `(${dataTypeLength}) ` : "";
      const PRIMARY_KEY = primaryKey ? "PRIMARY KEY " : "";
      const NOT_NULL = notNull ? "NOT NULL " : "";
      const UNIQUE = unique ? "UNIQUE " : "";

      return `${NAME} ${DATA_TYPE} ${DATATYPE_LENGTH}${PRIMARY_KEY}${NOT_NULL}${UNIQUE}`;
    })
    .join(",");
  const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsAsString})`;
  return await executeQuery(query);
};

const insertRow = async (intoTableName, withValues) => {
  const columnNames = Object.keys(withValues).join(",");
  const valuesAsString = Object.values(withValues).join(",");
  return await executeQuery(
    `INSERT INTO ${intoTableName}(${columnNames}) Values($1)`,
    [valuesAsString]
  );
};

const updateRow = async (fromTableName, withValues, forIndex) => {
  const columnNames = Object.keys(withValues);
  const columnValues = Object.values(withValues);
  const setValueString = columnNames
    .map((columnName, index) => `${columnName} = '${columnValues[index]}'`)
    .join(",");
  return await executeQuery(
    `UPDATE ${fromTableName} SET ${setValueString} where id = $1`,
    [forIndex]
  );
};

const deleteRow = async (fromTableName, forIndex) => {
  return await executeQuery(`DELETE FROM ${fromTableName} where id = $1`, [
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
