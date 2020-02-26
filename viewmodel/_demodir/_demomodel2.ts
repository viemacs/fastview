// an example of model modules
import path = require("path");

import { db, FieldInfo } from "../../db";
import * as options from "../_options";

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

  views[id] = options.Line();
  views[id].title.text = "Demonstration2";
  views[id].xAxis.name = "Date";
  views[id].yAxis[0].name = "Visits";
  views[id].yAxis[0].max = 31;
  views[id].yAxis[0].axisLabel.formatter = "{value} times";
  views[id].series[0].itemStyle = { normal: { label: { show: true } } };
  // views[id].yAxis[1].name = "Ratio";
  // views[id].yAxis[1].max = 100

  models[id] = {
    category: category,
    date: new Date().valueOf(),
    state: "init",
    update: (): void => {
      let query: string =
        "select visits, `date` from (select 1 as id, 21 as visits, '2020-02-01' as date union select 2 as id, 22 as visits, '2020-02-02' as date) as tt";
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
