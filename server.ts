import express = require("express");
import process = require("process");

import { db } from "./db";
import * as rpc from "./rpc";

const port: number = 4000;

const app: express.Application = express();
rpc.InitRouter(app);

app.listen(port, () => console.log(`Node server starts @ :${port}`));

// handle external resources before exit
function handleSignal(signal: string): void {
  console.log(`received signal ${signal}`);

  console.log("closing database connection");
  db.end(function(err: Error): void {
    if (err) {
      console.error(err);
    } else {
      console.log("database connections are closed");
    }
    console.log("application exits now");
    process.exit(0);
  });
}
process.stdin.resume();
process.on("SIGINT", handleSignal);
process.on("SIGTERM", handleSignal);
