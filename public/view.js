// Package model renders models
export { Ajax };

if (typeof echarts == "undefined") {
  console.error(`error: module "echarts" is missing, cannot render views`);
}

function Ajax(uri, callback) {
  if (!uri || !callback) {
    console.error("ajax() is called without uri or callback");
    return;
  }
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let ss = xhr.responseText;
      let obj = JSON.parse(ss);
      if (obj.error) {
        console.log(obj.error);
        return;
      }
      callback(obj);
    }
  };
  xhr.open("POST", uri);
  xhr.send(JSON.stringify());
}

window.showView = function showView(viewname) {
  if (!viewname) {
    console.error("cannot fetch view with an empty name");
    return;
  }
  Ajax(`/viewmodel/${viewname}`, res => {
    if (res.error) {
      console.error(res.error);
      return;
    }
    let option = res.option;
    if (!option) {
      console.error("cannot find option in ajax response:", res);
      return;
    }

    option.xAxis.data.unshift("");
    option.xAxis.data.push("");
    option.series[0].data.unshift(null);
    if (option.yAxis.length > 1) {
      option.series[1].data.unshift(null);
    }

    render("viewA", viewname, option);

    // a cache can be used to save view layout
    // let option = options[elemID]
  });
};

function render(elemID, viewName, option) {
  let chart = echarts.init(document.getElementById(elemID), "light");
  chart.setOption(option);
}
