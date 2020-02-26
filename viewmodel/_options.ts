function Bar() {
  return {
    title: {
      text: "view title"
    },
    tooltip: {},
    legend: {
      data: ["legend"]
    },
    xAxis: {
      boundaryGap: false,
      name: "x",
      data: []
    },
    yAxis: [
      {
        name: "y0",
        type: "value",
        axisLabel: {
          formatter: "{value} Unit"
        }
      }
    ],
    series: [
      {
        type: "bar",
        barWidth: 20,
        color: "DeepSkyblue"
      }
    ]
  };
}

function BarLine() {
  return {
    title: {
      text: "view title"
    },
    tooltip: {},
    legend: {
      data: ["legend"]
    },
    xAxis: {
      boundaryGap: false,
      name: "x",
      data: []
    },
    yAxis: [
      {
        name: "y0",
        type: "value",
        axisLabel: {
          formatter: "{value} Unit"
        }
      },
      {
        name: "y1",
        type: "value"
        // max: 100,
      }
    ],
    series: [
      {
        type: "bar",
        barWidth: 20,
        color: "DeepSkyblue"
      },
      {
        yAxisIndex: 1,
        type: "line",
        smooth: true,
        max: 100,
        color: "DarkDrange"
      }
    ]
  };
}

function Line() {
  return {
    title: {
      text: "view title"
    },
    tooltip: {},
    legend: {
      data: ["legend"]
    },
    xAxis: {
      boundaryGap: false,
      name: "x",
      data: []
    },
    yAxis: [
      {
        name: "y0",
        type: "value",
        axisLabel: {
          formatter: "{value} Unit"
        }
      }
    ],
    series: [
      {
        type: "line",
        smooth: true,
        max: 100,
        color: "DeepSkyblue"
      }
    ]
  };
}

export { Bar, BarLine, Line };
