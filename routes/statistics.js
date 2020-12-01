const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Requisition = require("../models/requisition");
const Sample = require("../models/sample");

router.get("/", auth.isAuthenticated, async function (req, res) {
  const finalizedSamples = await Sample.getStatisticTableData();

  const finalizedByToxin = {};
  const tableData = {};

  // Build structure
  ToxinasFull.forEach((toxin) => {
    finalizedByToxin[toxin] = [];

    tableData[toxin] = {
      testedAmount: 0,
      contaminatedPercent: 0,
      positiveAverage: 0,
      positiveMedian: 0,
      max: 0,
    };
  });

  // Group by finalized Toxins
  finalizedSamples.forEach((sample) => {
    ToxinasFull.forEach((toxin) => {
      if (sample[toxin].resultChart) finalizedByToxin[toxin].push(sample[toxin]);
    });
  });

  function generateTableData(samples) {
    const testedAmount = samples.length;
    let positiveValues = [];
    let positiveSum = 0;
    let max = 0;

    let contaminatedCount = 0;

    samples.forEach((sample) => {
      const contaminated = sample.checked;

      if (contaminated) {
        contaminatedCount++;
        const result = Number(sample.resultChart);
        positiveValues.push(result);
        positiveSum += result;

        if (result > max) max = result;
      }
    });

    let positiveMedian = 0;

    positiveValues.sort(function (a, b) {
      return a - b;
    });

    if (positiveValues.length == 0) positiveMedian = 0;
    else if (positiveValues.length == 1) positiveMedian = positiveValues[0];
    else if (positiveValues.length % 2 === 0) {
      const middle = positiveValues.length / 2;
      positiveMedian =
        (positiveValues[middle] + positiveValues[middle - 1]) / 2;
    } else {
      const middle = (positiveValues.length + 1) / 2;
      positiveMedian = positiveValues[middle];
    }

    let contaminatedPercent = (contaminatedCount * 100) / testedAmount;
    let positiveAverage = positiveSum / contaminatedCount;

    return {
      testedAmount,
      contaminatedPercent,
      positiveAverage,
      positiveMedian,
      max,
    };
  }

  // Generate table data for each toxin
  ToxinasFull.forEach((toxin) => {
    const samples = finalizedByToxin[toxin];
    const data = generateTableData(samples);

    tableData[toxin] = data;
  });

  // Generate table rows
  const tableRows = [];
  const tableDataRows = {
    testedAmount: "Nº de amostras testadas",
    contaminatedPercent: "% de amostras contaminadas",
    positiveAverage: "Média de positivos (ppb - desvio padrão)",
    positiveMedian: "Mediana de positivos (ppb)",
    max: "Máximo (ppb)",
  };

  Object.entries(tableDataRows).forEach(([key, value]) => {
    const row = [];
    row.push(value);
    ToxinasFull.forEach((toxin) => row.push(tableData[toxin][key] ? tableData[toxin][key].toFixed(2): NaN));

    tableRows.push(row);
  });

  res.render("statistics/index", {
    title: "Gráficos",
    layout: "layoutDashboard.hbs",
    ...req.session,
    tableRows,
  });
});

router.get("/barcharts", auth.isAuthenticated, function (req, res) {
  res.render("statistics/barcharts", {
    title: "Gráficos",
    layout: "layoutDashboard.hbs",
    ...req.session,
  });
});

router.get(
  "/boxcharts",
  /* auth.isAuthenticated,*/ (req, res) => {
    res.render("statistics/boxcharts", {
      title: "Gráficos",
      layout: "layoutDashboard.hbs",
      ...req.session,
    });
  }
);

router.get("/statesData", auth.isAuthenticated, async (req, res) => {
  let data = await Requisition.getStateData();
  res.send(data);
});

router.get('/resultsData', async (req, res) => {
    const filters = req.query;
    let data = await Sample.getResultData(filters);
    res.send(data);
});

router.get("/samplesData", auth.isAuthenticated, async (req, res) => {
  let data = await Sample.getSampleData();
  res.send(data);
});

router.get("/animalsData", auth.isAuthenticated, async (req, res) => {
  let data = await Requisition.getAnimalData();
  res.send(data);
});

router.get("/finalizationData", auth.isAuthenticated, async (req, res) => {
  let data = await Sample.getFinalizationData();
  res.send(data);
});

module.exports = router;
