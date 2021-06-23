function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

function randomValues(count, min, max) {
  const delta = max - min;
  return Array.from({ length: count }).map(() => Math.random() * delta + min);
}

let chart1, chart2, chart3, chart4;

function buildCharts() {
  let ctx1 = $("#StateFrequency");
  chart1 = new Chart(ctx1, {
    plugins: [ChartDataLabels],
    // The type of chart we want to create
    type: "bar",

    // The data for our dataset
    data: {
      datasets: [
        {
          label: "Frequencia",
          backgroundColor: "rgb(252, 186, 3)",
          borderColor: "rgb(252, 186, 3)",
        },
      ],
    },

    // Configuration options go here
    options: {
      title: {
        fontSize: 20,
        display: true,
        text: "Distribuição de frequência referente aos Estados brasileiros",
        padding: 25,
      },
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              //max: 100,
              min: 0,
            },
            scaleLabel: {
              display: true,
              labelString: "Frequência (%)",
            },
          },
        ],
      },
      plugins: {
        // Change options for ALL labels of THIS CHART
        datalabels: {
          anchor: "end",
          align: "top",
          color: "#676767",
          font: {
            weight: "bold",
          },
        },
      },
    },
  });

  let ctx2 = $("#SampleFrequency");
  chart2 = new Chart(ctx2, {
    plugins: [ChartDataLabels],
    // The type of chart we want to create
    type: "bar",

    // The data for our dataset
    data: {
      datasets: [
        {
          label: "Frequencia",
          backgroundColor: "rgb(252, 186, 3)",
          borderColor: "rgb(252, 186, 3)",
        },
      ],
    },

    // Configuration options go here
    options: {
      title: {
        fontSize: 20,
        display: true,
        text: "Distribuição de frequência referente aos tipos de amostra",
        padding: 25,
      },
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              // max: 100,
              min: 0,
            },
            scaleLabel: {
              display: true,
              labelString: "Frequência (%)",
            },
          },
        ],
      },
      plugins: {
        // Change options for ALL labels of THIS CHART
        datalabels: {
          anchor: "end",
          align: "top",
          color: "#676767",
          font: {
            weight: "bold",
          },
        },
      },
    },
  });

  let ctx3 = $("#AnimalsFrequency");
  chart3 = new Chart(ctx3, {
    plugins: [ChartDataLabels],
    // The type of chart we want to create
    type: "bar",

    // The data for our dataset
    data: {
      datasets: [
        {
          label: "Frequencia",
          backgroundColor: "rgb(252, 186, 3)",
          borderColor: "rgb(252, 186, 3)",
        },
      ],
    },

    // Configuration options go here
    options: {
      title: {
        fontSize: 20,
        display: true,
        text: "Distribuição de frequência referente a destinação do alimento",
        padding: 25,
      },
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              // max: 100,
              min: 0,
            },
            scaleLabel: {
              display: true,
              labelString: "Frequência (%)",
            },
          },
        ],
      },
      plugins: {
        // Change options for ALL labels of THIS CHART
        datalabels: {
          anchor: "end",
          align: "top",
          color: "#676767",
          font: {
            weight: "bold",
          },
        },
      },
    },
  });

  let ctx4 = $("#FinalizedPorcentage");
  chart4 = new Chart(ctx4, {
    plugins: [ChartDataLabels],
    // The type of chart we want to create
    type: "bar",

    // The data for our dataset
    data: {
      datasets: [
        {
          label: "Contaminado",
          backgroundColor: "rgb(252, 186, 3)",
          borderColor: "rgb(252, 186, 3)",
        },
        {
          label: "Não contaminado",
          backgroundColor: "rgb(219, 140, 13)",
          borderColor: "rgb(219, 140, 13)",
        },
      ],
    },

    // Configuration options go here
    options: {
      title: {
        fontSize: 20,
        display: true,
        text: "Distribuição de frequência referente a detecção de toxinas",
        padding: 25,
      },
      legend: {
        display: true,
        position: "bottom",
      },
      scales: {
        xAxes: [
          {
            stacked: true,
          },
        ],
        yAxes: [
          {
            stacked: true,
            ticks: {
              max: 100,
              min: 0,
            },
            scaleLabel: {
              display: true,
              labelString: "Frequência (%)",
            },
          },
        ],
      },
      plugins: {
        // Change options for ALL labels of THIS CHART
        datalabels: {
          anchor: "center",
          align: "center",
          color: "#ffffff",
          font: {
            weight: "bold",
          },
        },
      },
    },
  });
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

  const query = buildQueryParams();
  // GRAFICO ESTADOS
  $.get(`/statistics/statesData?${query}`).then((result) => {
    let eixo_x = [];
    let eixo_y = [];

    //Order by the frenquecy
    result.sort(dynamicSort("frequency")).reverse();

    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      eixo_x.push(element._id);
      eixo_y.push((element.frequency * 100).toFixed(2));
    }

    chart1.data.labels = eixo_x;
    chart1.data.datasets[0].data = eixo_y;
    chart1.update();
  });

  // GRAFICO DO TIPO DE SAMPLES
  $.get(`/statistics/samplesData?${query}`).then((result) => {
    let eixo_x = [];
    let eixo_y = [];

    //Order by the frenquecy
    result.sort(dynamicSort("frequency")).reverse();

    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      eixo_x.push(element._id);
      eixo_y.push((element.frequency * 100).toFixed(2));
    }

    chart2.data.labels = eixo_x;
    chart2.data.datasets[0].data = eixo_y;
    chart2.update();
  });

  // GRAFICO RAÇA ANIMAIS
  $.get(`/statistics/animalsData?${query}`).then((result) => {
    let eixo_x = [];
    let eixo_y = [];

    //Order by the frenquecy
    result.sort(dynamicSort("frequency")).reverse();

    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      eixo_x.push(element._id);
      eixo_y.push((element.frequency * 100).toFixed(2));
    }

    chart3.data.labels = eixo_x;
    chart3.data.datasets[0].data = eixo_y;
    chart3.update();
  });

  // GRAFICO TOXINAS DETECTADAS
  $.get(`/statistics/finalizationData?${query}`).then((counterVector) => {
    let eixo_x = [];
    let eixo_y = [];
    let eixo2_y = [];

    counterVector.forEach((element) => {
      let porcentage = (element.trueCounter * 100) / element.totalNumber;
      eixo_x.push(element.name);
      eixo_y.push(porcentage.toFixed(2));
      eixo2_y.push((100 - porcentage.toFixed(2)).toFixed(2));
    });

    chart4.data.labels = eixo_x;
    chart4.data.datasets[0].data = eixo_y;
    chart4.data.datasets[1].data = eixo2_y;
    chart4.update();
  });
}

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
    chart1.canvas.parentNode.style.width = "800px";
    chart2.canvas.parentNode.style.width = "800px";
    chart3.canvas.parentNode.style.width = "800px";
    chart4.canvas.parentNode.style.width = "800px";
    print();
  });

  window.onbeforeprint = function () {
    chart1.resize();
    chart2.resize();
    chart3.resize();
    chart4.resize();
  };

  window.onafterprint = function () {
    chart1.canvas.parentNode.style.width = "auto";
    chart2.canvas.parentNode.style.width = "auto";
    chart3.canvas.parentNode.style.width = "auto";
    chart4.canvas.parentNode.style.width = "auto";
  };
});
