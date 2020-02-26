// an example of model modules
import path = require("path");

import { db, FieldInfo } from "../db";
import * as options from "./_options";

export { Init };

interface Map {
  [key: string]: any;
}

function Init(views: Map, models: Map, category: string[]) {
  let id: string = path.basename(__filename, ".ts").replace(/\.js$/, "");
  if (views[id]) {
    console.error(`view (${id}) already exists`);
    return;
  }

  views[id] = options.Bar();
  views[id].title.text = "Demonstration";
  views[id].xAxis.name = "Date";
  views[id].yAxis[0].name = "Visits";
  views[id].yAxis[0].max = null;
  views[id].yAxis[0].axisLabel.formatter = "{value} times";
  views[id].series[0].itemStyle = { normal: { label: { show: true } } };
  // views[id].yAxis[1].name = "Ratio";
  // views[id].yAxis[1].max = 100

  models[id] = {
    category: category,
    date: new Date().valueOf(),
    state: "init",
    update: (): void => {
      let query: string = "select 1 as id, 20 as visits, '2020-02-02' as date";
      db.query(query, (err: Error, results: any, fields: FieldInfo[]) => {
        if (err) {
          console.error("failed to exec query:", query);
          models[id].date = new Date().valueOf();
          models[id].state = "failed";
          return;
        }

        let x: string[] = [];
        let y: number[] = [];

        // analyze and fill x, y
        let m: { [key: string]: number } = {};
        for (let record of results) {
          m[record.date] = (m[record.date] || 0) + record.visits;
        }
        for (let key in m) {
          x.push(key);
        }
        x.sort();
        for (let key of x) {
          y.push(m[key]);
        }

        views[id].xAxis.data = x;
        views[id].series[0].data = y;

        models[id].date = new Date().valueOf();
        models[id].state = "success";
      });
    }
  };
  models[id].update();
}
