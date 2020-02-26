import fs = require("fs");
import path = require("path");

import { conf } from "../conf";

export { List, View };

// state of models
interface Model {
  category: string[];
  date: number;
  state: string;
  update: any;
}

// map of viewmodels
interface ViewInfo {
  [key: string]: any;
}

let views: { [key: string]: ViewInfo } = {};
let models: { [key: string]: Model } = {};

(function loadModelTree(): void {
  function excludes(name: string): boolean {
    return (
      name.substring(0, 1) == "." ||
      ["index", "_options"].includes(name) ||
      (conf.releaseMode && name.substring(0, 5) == "_demo")
    );
  }

  interface CategoryInfo {
    id: string;
    name: string;
  }
  interface Entry {
    Init: {
      (
        views: { [key: string]: ViewInfo },
        models: { [key: string]: Model },
        category: string[]
      ): void;
    };
  }
  let entries: Entry[] = [];
  let categories: CategoryInfo[][] = [];

  function loadModelDir(dir: string, category: CategoryInfo[]): void {
    let files: string[] = fs.readdirSync(dir);
    for (let name of files) {
      let filepath: string = path.join(dir, name);
      if (fs.lstatSync(filepath).isFile()) {
        let modelname: string = path.basename(name, ".ts").replace(/\.js$/, "");
        if (excludes(modelname)) {
          continue;
        }
        console.log(`loading model ${modelname} ...`);
        entries.push(require(filepath));
        categories.push(category);
        continue;
      }

      let info: CategoryInfo = { id: name, name: name };
      function readDirInfo(file: string): boolean {
        if (fs.existsSync(file)) {
          info = require(file);
          return true;
        }
        return false;
      }
      readDirInfo(path.join(filepath, "index.ts")) ||
        readDirInfo(path.join(filepath, "index.js"));

      let categoryExt: CategoryInfo[] = category.slice();
      categoryExt.push(info);
      loadModelDir(filepath, categoryExt);
    }
  }

  loadModelDir(__dirname, []);

  for (let i in entries) {
    entries[i].Init(
      views,
      models,
      categories[i].map(c => c.name)
    );
  }
})();

function List(): object {
  let list: ViewInfo[] = [];
  for (let k in views) {
    let view = views[k];
    if (!view || !view.title || !view.title.text) {
      console.error("cannot find title text for view:", k);
      continue;
    }
    list.push({
      id: k,
      title: view.title.text
    });
  }
  return {
    view: list
  };
}

function View(name: string, callback: (err: string, data?: object) => void) {
  if (!name) {
    callback("view name is empty");
    return;
  }
  let option = views[name];
  if (!option) {
    callback(`cannot find view with name ${name}`);
    return;
  }
  callback("", {
    option: option
  });
}
