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
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}


$(document).ready(() => {
    var ctx = $('#StateFrequency');

    var chart = new Chart(ctx, {
        plugins: [ChartDataLabels],
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            datasets: [{
                label: 'Frequencia',
                backgroundColor: 'rgb(252, 186, 3)',
                borderColor: 'rgb(252, 186, 3)',
            }]
        },

        // Configuration options go here
        options: {
            title: {
                fontSize: 20,
                display: true,
                text: 'Distribuição de frequência referente aos Estados brasileiros',
                padding: 25,
            },
            legend: {
                display: false,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        max: 100,
                        min: 0
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Frequência (%)',
                    }
                }]
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

    $.get('/statistics/statesData').then(result => {

        let eixo_x = [];
        let eixo_y = [];

        //Order by the frenquecy
        result.sort(dynamicSort('frequency')).reverse();

        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            eixo_x.push(element._id);
            eixo_y.push((element.frequency*100).toFixed(2));
        }
        //console.log(result);

        chart.data.labels = eixo_x;
        chart.data.datasets[0].data = eixo_y;
        chart.update();
    });

});
// --------------------------------------------------------
// GRAFICO DO TIPO DE SAMPLES AQUI 
$(document).ready(() => {
    var ctx2 = $('#SampleFrequency');

    var chart2 = new Chart(ctx2, {
        plugins: [ChartDataLabels],
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            datasets: [{
                label: 'Frequencia',
                backgroundColor: 'rgb(252, 186, 3)',
                borderColor: 'rgb(252, 186, 3)',
            }]
        },

        // Configuration options go here
        options: {
            title: {
                fontSize: 20,
                display: true,
                text: 'Distribuição de frequência referente aos tipos de amostra',
                padding: 25,
            },
            legend: {
                display: false,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        max: 100,
                        min: 0
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Frequência (%)',
                    }
                }]
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

    $.get('/statistics/samplesData').then(result => {

        let eixo_x = [];
        let eixo_y = [];

        //Order by the frenquecy
        result.sort(dynamicSort('frequency')).reverse();

        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            eixo_x.push(element._id);
            eixo_y.push((element.frequency*100).toFixed(2));
        }
        console.log(result);

        chart2.data.labels = eixo_x;
        chart2.data.datasets[0].data = eixo_y;
        chart2.update();
    });

});
// -------------------------------------------------------------------------
// GRAFICO RAÇA ANIMAIS
$(document).ready(() => {
    var ctx3 = $('#AnimalsFrequency');

    var chart3 = new Chart(ctx3, {
        plugins: [ChartDataLabels],
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            datasets: [{
                label: 'Frequencia',
                backgroundColor: 'rgb(252, 186, 3)',
                borderColor: 'rgb(252, 186, 3)',
            }]
        },

        // Configuration options go here
        options: {
            title: {
                fontSize: 20,
                display: true,
                text: 'Distribuição de frequência referente a destinação do alimento',
                padding: 25,
            },
            legend: {
                display: false,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        max: 100,
                        min: 0
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Frequência (%)',
                    }
                }]
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

    $.get('/statistics/animalsData').then(result => {

        let eixo_x = [];
        let eixo_y = [];

        //Order by the frenquecy
        result.sort(dynamicSort('frequency')).reverse();

        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            eixo_x.push(element._id);
            eixo_y.push((element.frequency*100).toFixed(2));
        }
        console.log(result);

        chart3.data.labels = eixo_x;
        chart3.data.datasets[0].data = eixo_y;
        chart3.update();
    });

});

// -------------------------------------------------------------------------
// GRAFICO TOXINAS DETECTADAS
$(document).ready(() => {
    var ctx4 = $('#FinalizedPorcentage');

    var chart4 = new Chart(ctx4, {
        plugins: [ChartDataLabels],
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            datasets: [{
                label: 'Porcentagem de detecção',
                backgroundColor: 'rgb(252, 186, 3)',
                borderColor: 'rgb(252, 186, 3)',
            }]
        },

        // Configuration options go here
        options: {
            title: {
                fontSize: 20,
                display: true,
                text: 'Distribuição de frequência referente a detecção de toxinas',
                padding: 25,
            },
            legend: {
                display: false,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        max: 100,
                        min: 0
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Frequência (%)',
                    }
                }]
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

    $.get('/statistics/finalizationData').then(counterVector => {

        let eixo_x = [];
        let eixo_y = [];
        let eixo_Max = [];
        counterVector.forEach(element => {
            let porcentage = (element.trueCounter*100)/(element.totalNumber);
            eixo_x.push(element.name);
            eixo_y.push(porcentage.toFixed(2));
            eixo_Max.push(100);
        });

        chart4.data.labels = eixo_x;
        chart4.data.datasets[0].data = eixo_y;
        chart4.update();
    });

});