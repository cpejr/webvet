ToxinasIds = [
  "60a5a63d45c7b21d74ac59fd",
  "60a5a68a88ade51d74703066",
  "60a5a69388ade51d74703067",
  "60a5a6a388ade51d74703068",
  "60a5a6bf88ade51d74703069",
  "60a5a6ca88ade51d7470306a",
];

ToxinasFormal = [
  "Aflatoxinas",
  "Deoxinivalenol",
  "Fumonisina",
  "Ocratoxina A",
  "T-2 toxina",
  "Zearalenona",
];

const ANNOTATION_DEFAULT = {
  type: "line",
  mode: "horizontal",
  scaleID: "y-axis-1",
  value: 0,
  borderColor: "#111",
  borderWidth: 1,
  label: {},
};

const LABEL_DEFAULT = {
  // Background color of label, default below
  backgroundColor: "rgba(0,0,0,0)",

  // Font family of text, inherits from global
  fontFamily: "sans-serif",

  // Font size of text, inherits from global
  fontSize: 12,

  // Font style of text, default below
  fontStyle: "bold",

  // Font color of text, default below
  fontColor: "#000",

  // Padding of label to add left/right, default below
  xPadding: 6,

  // Padding of label to add top/bottom, default below
  yPadding: 6,

  // Radius of label rectangle, default below
  cornerRadius: 0,

  // Anchor position of label on line, can be one of: top, bottom, left, right, center. Default below.
  position: "left",

  // Adjustment along x-axis (left-right) of label relative to above number (can be negative)
  // For horizontal lines positioned left or right, negative values move
  // the label toward the edge, and positive values toward the center.
  xAdjust: 0,

  // Adjustment along y-axis (top-bottom) of label relative to above number (can be negative)
  // For vertical lines positioned top or bottom, negative values move
  // the label toward the edge, and positive values toward the center.
  yAdjust: 8,

  // Whether the label is enabled and should be displayed
  enabled: true,

  // Text to display in label - default is null. Provide an array to display values on a new line
  content: "Test label",

  // Rotation of label, in degrees, default is 0
  rotation: 90,
};

const charts = {};

$(() => {
  buildCharts();
  populateCharts();

  $("#clearStartDate").on("click", () => {
    $("#startDateFilter").val("");
  });

  $("#clearEndDate").on("click", () => {
    $("#limitDateFilter").val("");
  });

  $("#applyFilter").on("click", () => {
    populateCharts();
  });

  $("#print").on("click", () => {
    for (let i = 0; i < ToxinasFormal.length; i++) {
      const toxina = ToxinasFormal[i];
      charts[toxina].canvas.parentNode.style.width = "800px";
    }
    print();
  });

  window.onbeforeprint = function () {
    for (let i = 0; i < ToxinasFormal.length; i++) {
      const toxina = ToxinasFormal[i];
      charts[toxina].resize();
    }
  };

  window.onafterprint = function () {
    for (let i = 0; i < ToxinasFormal.length; i++) {
      const toxina = ToxinasFormal[i];
      charts[toxina].canvas.parentNode.style.width = "auto";
    }
  };
});

function buildCharts() {
  for (let i = 0; i < ToxinasFormal.length; i++) {
    const toxina = ToxinasFormal[i];
    var ctx = document.getElementById(ToxinasIds[i]).getContext("2d");
    charts[toxina] = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Resultado", // Name the series
            data: [],
            borderColor: "#6BA05C", // Add custom color border
            backgroundColor: "#6BA05C", // Add custom color background (Points and Fill)
          },
        ],
      },
      options: {
        responsive: true, // Instruct chart js to respond nicely.
        // maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
        title: {
          fontSize: 20,
          display: true,
          text: `Distribuição de resultados das análises de ${ToxinasFormal[i]}`,
          padding: 25,
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              ticks: {
                // max: 100,
                // min: 0
              },
              scaleLabel: {
                display: true,
                labelString: "Resultados",
              },
            },
          ],
        },
        annotation: {
          annotations: [
            {
              ...ANNOTATION_DEFAULT,
              value: 12000,
              label: { ...LABEL_DEFAULT, content: "Milho e derivados" },
            },
            {
              ...ANNOTATION_DEFAULT,
              value: 8000,
              label: {
                ...LABEL_DEFAULT,
                content: "Cereais e derivados, exceto milho",
              },
            },
            {
              ...ANNOTATION_DEFAULT,
              value: 5000,
              label: { ...LABEL_DEFAULT, content: "Ingredientes da dieta" },
            },
            {
              ...ANNOTATION_DEFAULT,
              value: 2000,
              label: { ...LABEL_DEFAULT, content: "Bezerros(as)" },
            },
          ],
        },
      },
    });
  }
}

function populateCharts() {
  function buildQueryParams() {
    const queryParams = [];

    const startDate = $("#startDateFilter").val();
    const endDate = $("#limitDateFilter").val();
    const state = $("#stateFilter").val();
    const typeFilter = $("#typeFilter").val();
    const destinationFilter = $("#destinationFilter").val();
    const userFilter = $("#userFilter").val();

    if (startDate) queryParams.push(`startDate=${startDate}`);
    if (endDate) queryParams.push(`endDate=${endDate}`);
    if (state) queryParams.push(`state=${state}`);
    if (typeFilter) queryParams.push(`type=${typeFilter}`);
    if (destinationFilter) queryParams.push(`destination=${destinationFilter}`);
    if (userFilter) queryParams.push(`user=${userFilter}`);

    return queryParams.join("&");
  }

  // Define the data
  $.get(`/statistics/resultsData?${buildQueryParams()}`).then((result) => {
    let data = {};

    result.forEach((toxinGroup) => {
      let count = 0;
      data[toxinGroup.toxin.name] = [];

      toxinGroup.analysis.forEach((analysis) => {
        if (typeof analysis.resultChart !== "undefined") {
          data[toxinGroup.toxin.name].push({
            y: analysis.resultChart,
            x: count,
          });
          count++;
        }
      });
    });

    for (let i = 0; i < ToxinasFormal.length; i++) {
      let chart = charts[ToxinasFormal[i]];
      chart.data.datasets[0].data = data[ToxinasFormal[i]];
      chart.update();
    }
  });

  // End Defining data
}
