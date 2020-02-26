import fs = require("fs");
import path = require("path");

export { conf };

const configFile = "fastview.json";
const f = fs.readFileSync(path.join(__dirname, configFile), "utf8");

interface Conf {
  [category: string]: {
    [key: string]: string;
  };
}

let conf: Conf = JSON.parse(f.replace(new RegExp(/\/\/.*/, "g"), ""));
