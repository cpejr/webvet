$(document).ready(() => {
    var ctx = document.getElementById("DotPlot").getContext("2d");

    // Define the data
    var data = [
        {
            x: 5,
            y: 4
        },
        {
            x: 2,
            y: 14
        },
        {
            x: 4,
            y: 12
        },
        {
            x: 2,
            y: 10
        },
        {
            x: 3,
            y: 4
        },
        {
            x: 3,
            y: 5
        },
        {
            x: 3,
            y: 8
        },
        {
            x: 6,
            y: 12
        }
    ]; // Add data values to array
    // End Defining data
    var options = {
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false // Add to prevent default behaviour of full-width/height
    };

    // End Defining data
    var DotPlot = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [
                {
                    label: "Population", // Name the series
                    data: data, // Specify the data values array
                    borderColor: "#6BA05C", // Add custom color border
                    backgroundColor: "#6BA05C" // Add custom color background (Points and Fill)
                }
            ]
        },
        options: {
            title: {
                fontSize: 20,
                display: true,
                text: 'Distribuição de resultados das análises de Aflatoxina',
                padding: 25,
            },
            legend: {
                display: false,
            },
            scales: {
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
});



// $(document).ready(() => {
//     var ctx = $('#DotPlot');

//     var chart = new Chart(ctx, {
//         plugins: [ChartDataLabels],
//         // The type of chart we want to create
//         type: 'bar',

//         // The data for our dataset
//         data: {
//             datasets: [{
//                 label: 'Frequencia',
//                 backgroundColor: 'rgb(252, 186, 3)',
//                 borderColor: 'rgb(252, 186, 3)',
//             }]
//         },

//         // Configuration options go here
//         options: {
//             title: {
//                 fontSize: 20,
//                 display: true,
//                 text: 'Distribuição de frequência referente aos Estados brasileiros',
//                 padding: 25,
//             },
//             legend: {
//                 display: false,
//             },
//             scales: {
//                 yAxes: [{
//                     ticks: {
//                         //max: 100,
//                         min: 0
//                     },
//                     scaleLabel: {
//                         display: true,
//                         labelString: 'Frequência (%)',
//                     }
//                 }]
//             },
//             plugins: {
//                 // Change options for ALL labels of THIS CHART
//                 datalabels: {
//                     anchor: 'end',
//                     align: 'top',
//                     color: '#676767',
//                     font: {
//                         weight: "bold",
//                     }
//                 }
//             }
//         }
//     });
//     $.get('/statistics/statesData').then(result => {

//         let eixo_x = [];
//         let eixo_y = [];

//         //Order by the frenquecy
//         result.sort(dynamicSort('frequency')).reverse();

//         for (let i = 0; i < result.length; i++) {
//             const element = result[i];
//             eixo_x.push(element._id);
//             eixo_y.push((element.frequency * 100).toFixed(2));
//         }
//         //console.log(result);

//         chart.data.labels = eixo_x;
//         chart.data.datasets[0].data = eixo_y;
//         chart.update();
//     });
// });