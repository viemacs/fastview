import cors = require("cors");
import express = require("express");
import path = require("path");

import { conf } from "./conf";
import * as viewmodel from "./viewmodel";

export { InitRouter };

const corsOptions: { [key: string]: number | string | string[] } = {
  origin: ["http://github.com:80", "https://github.com:443"],
  optionsSuccessStatus: 200
};

function InitRouter(app: express.Application): void {
  app.post("/viewmodel/list", cors(corsOptions), listView);
  app.post("/viewmodel/:name", cors(corsOptions), getViewmodel);
  app.post("*", cors(corsOptions), code404);

  if (!conf.releaseMode) {
    app.get("/viewmodel/list", cors(corsOptions), listView);
    app.get("/viewmodel/:name", cors(corsOptions), getViewmodel);
  }

  app.use("/js", express.static(path.join(__dirname, "public")));
  app.use("/css", express.static(path.join(__dirname, "public")));
  app.use("/", express.static(path.join(__dirname, "public")));

  app.get("*", cors(corsOptions), code404);
}

function code404(req: express.Request, res: express.Response) {
  res.send(JSON.stringify({ code: 404, error: `cannot get: ${req.url}` }));
}

function listView(req: express.Request, res: express.Response): void {
  res.send(JSON.stringify(viewmodel.List()));
}

function getViewmodel(req: express.Request, res: express.Response): void {
  let name: string = req.params.name;
  if (!name) {
    code404(req, res);
    return;
  }

  viewmodel.View(name, function(err: string, result?: Object): void {
    if (err) {
      res.send(JSON.stringify({ error: err }));
      return;
    }
    res.send(JSON.stringify(result));
  });
}
