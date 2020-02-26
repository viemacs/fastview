// const process = require("process");
import * as mysql from "mysql";

import { conf } from "./conf";

type FieldInfo = mysql.FieldInfo;

export { db, FieldInfo };

let connConfig: { [key: string]: any } = {
  connectionLimit: 16,
  multipleStatements: true,
  host: conf.database.host,
  user: conf.database.user,
  password: conf.database.password,
  database: conf.database.database
};

let connection: mysql.Connection = mysql.createConnection(connConfig);
connection.connect(function(err: Error): void {
  if (err) {
    console.error("application exits on database connection error", err.stack);
    process.exit(2);
  }
  console.log("connected to database");
});
connection.query(
  "select version() as version",
  (err: Error, results: any, fields: mysql.FieldInfo[]): void => {
    if (err) {
      throw err;
    }
    console.log("database version:", results[0].version);
  }
);
connection.end();

let db: mysql.Pool = mysql.createPool(connConfig);

function query(sql: string, values: number[] | string[]): Promise<unknown> {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, rows, fields) => {
      if (err) {
        reject(err);
        return;
      }
      // orphan param: fields
      resolve(rows);
    });
  });
}
