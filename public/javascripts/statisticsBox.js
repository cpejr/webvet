ToxinasFull = ['aflatoxina', 'deoxinivalenol', 'fumonisina', 'ocratoxina', 't2toxina', 'zearalenona'];
ToxinasFormal = ['Aflatoxinas', 'Deoxinivalenol', 'Fumonisina', 'Ocratoxina A', 'T-2 toxina', 'Zearalenona'];

$(document).ready(() => {
    const charts = {}
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
                        backgroundColor: "#6BA05C" // Add custom color background (Points and Fill)
                    }
                ]
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
                    xAxes: [{
                        display: false,
                    }],
                    yAxes: [{
                        ticks: {
                            // max: 100,
                            // min: 0
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Resultados',
                        }
                    }],
                },
                plugins: {
                    // Change options for ALL labels of THIS CHART
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        color: '#676767',
                        font: {
                            weight: "bold",
                        }
                    }
                }
            }
        });
    }

    // Define the data
    $.get('/statistics/resultsData').then(result => {
        console.log(result);
        let data = {};
        for (let j = 0; j < result.length; j++) {
            for (let i = 0; i < ToxinasFull.length; i++) {
                if (!data[ToxinasFull[i]]) {
                    data[ToxinasFull[i]] = [];
                }
                let resultData = (result[j][ToxinasFull[i]].result);
                if (isNaN(resultData)) {
                    resultData = 0;
                }
                else {
                    resultData = Number(resultData);
                }
                if (resultData) data[ToxinasFull[i]].push({ y: resultData, x: data[ToxinasFull[i]].length });
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

});


