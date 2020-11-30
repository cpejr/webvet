ToxinasFull = [
  "aflatoxina",
  "deoxinivalenol",
  "fumonisina",
  "ocratoxina",
  "t2toxina",
  "zearalenona",
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
});

function buildCharts() {
  for (let i = 0; i < ToxinasFull.length; i++) {
    const toxina = ToxinasFull[i];
    var ctx = document.getElementById(toxina).getContext("2d");
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

    if (startDate) queryParams.push(`startDate=${startDate}`);
    if (endDate) queryParams.push(`endDate=${endDate}`);
    if (state) queryParams.push(`state=${state}`);
    if (typeFilter) queryParams.push(`type=${typeFilter}`);

    return queryParams.join("&");
  }

  // Define the data
  $.get(`/statistics/resultsData?${buildQueryParams()}`).then((result) => {
    let data = {};
    for (let j = 0; j < result.length; j++) {
      for (let i = 0; i < ToxinasFull.length; i++) {
        if (!data[ToxinasFull[i]]) {
          data[ToxinasFull[i]] = [];
        }
        let resultData = result[j][ToxinasFull[i]].resultChart;
        if (isNaN(resultData)) {
          resultData = 0;
        } else {
          resultData = Number(resultData);
        }
        if (resultData)
          data[ToxinasFull[i]].push({
            y: resultData,
            x: data[ToxinasFull[i]].length,
          });
      }
    }
    for (let i = 0; i < ToxinasFull.length; i++) {
      let chart = charts[ToxinasFull[i]];
      // chart.data.labels = [...dates];
      // chart.data.labels = [0,1,2,3];
      chart.data.datasets[0].data = data[ToxinasFull[i]];
      // chart.data.datasets[0].data = [0,1,2,3];
      chart.update();
    }
  });

  // End Defining data
}
