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
            eixo_y.push(element.frequency.toFixed(2));
        }
        console.log(result);

        chart.data.labels = eixo_x;
        chart.data.datasets[0].data = eixo_y;
        chart.update();
    });

});
// --------------------------------------------------------
// GRAFICO DO TIPO DE SAMPLES AQUI 
$(document).ready(() => {
    var ctx = $('#SampleFrequency');

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
                text: 'Distribuição de frequência referente aos tipos de amostra',
                padding: 25,
            },
            legend: {
                display: false,
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
            // eixo_x.push(element._id);
            // eixo_y.push(element.frequency.toFixed(2));
        }
        console.log(result);

        chart.data.labels = eixo_x;
        chart.data.datasets[0].data = eixo_y;
        chart.update();
    });

});