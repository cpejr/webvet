const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Requisition = require("../models/requisition");
const Sample = require("../models/sample");
const User = require("../models/user");

router.get("/", auth.isAuthenticated, async function (req, res) {
  const finalizedSamples = await Sample.getStatisticTableData();

  const finalizedAnalysisByToxin = {};
  const tableData = {};

  // Build structure
  Toxins.forEach((toxin) => {
    finalizedAnalysisByToxin[toxin._id] = [];

    tableData[toxin._id] = {
      testedAmount: 0,
      contaminatedPercent: 0,
      positiveAverage: 0,
      positiveMedian: 0,
      max: 0,
    };
  });

  // Group by finalized Toxins
  finalizedSamples.forEach((sample) => {
    sample.analysis.forEach((analysis) => {
      finalizedAnalysisByToxin[analysis.toxinId].push(analysis);
    });
  });

  function generateTableData(analysis) {
    const testedAmount = analysis.length;
    let positiveValues = [];
    let positiveSum = 0;
    let max = 0;

    let contaminatedCount = 0;

    analysis.forEach((analy) => {
      const contaminated = analy.wasDetected;

      if (contaminated) {
        contaminatedCount++;
        const result = Number(analy.resultChart);
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
    let averageDeviation = 0;

    analysis.forEach((analy) => {
      const contaminated = analy.wasDetected;

      if (contaminated) {
        const result = Number(analy.resultChart);
        averageDeviation += Math.pow(result - positiveAverage, 2);
      }
    });
    averageDeviation /= contaminatedCount;
    averageDeviation = Math.sqrt(averageDeviation);

    return {
      testedAmount: testedAmount.toFixed(0),
      contaminatedPercent,
      positiveAverageWithAD: `${positiveAverage.toFixed(
        2
      )} - ${averageDeviation.toFixed(2)}`,
      positiveMedian,
      max,
    };
  }

  // Generate table data for each toxin
  Toxins.forEach((toxin) => {
    const analysis = finalizedAnalysisByToxin[toxin._id];
    const data = generateTableData(analysis);

    tableData[toxin._id] = data;
  });

  // Generate table rows
  const tableRows = [];
  const tableDataRows = {
    testedAmount: "Nº de amostras testadas",
    contaminatedPercent: "% de amostras contaminadas",
    positiveAverageWithAD: "Média de positivos (ppb - desvio padrão)",
    positiveMedian: "Mediana de positivos (ppb)",
    max: "Máximo (ppb)",
  };

  Object.entries(tableDataRows).forEach(([key, value]) => {
    const row = [];
    row.push(value);
    Toxins.forEach((toxin) => {
      const value = tableData[toxin._id][key];
      let pushValue;

      if (value)
        if (typeof value === "number") pushValue = value.toFixed(2);
        else pushValue = value;
      else pushValue = NaN;

      row.push(pushValue);
    });

    tableRows.push(row);
  });

  res.render("statistics/index", {
    title: "Gráficos",
    layout: "layoutDashboard.hbs",
    ...req.session,
    tableRows,
  });
});

router.get("/barcharts", auth.isAuthenticated, async function (req, res) {
  let enableUserFilter = false;
  const user = req.session.user;
  let users;

  if (user && (user.type === "Admin" || user.type === "Analista")) {
    users = await User.getByQuery({ status: "Ativo", deleted: "false" });
    enableUserFilter = true;
  }

  res.render("statistics/barcharts", {
    title: "Gráficos",
    layout: "layoutDashboard.hbs",
    ...req.session,
    allDestinations,
    allSampleTypes,
    users,
    enableUserFilter,
  });
});

router.get(
  "/boxcharts",
  /* auth.isAuthenticated,*/ async (req, res) => {
    let enableUserFilter = false;
    const user = req.session.user;
    let users;

    if (user && (user.type === "Admin" || user.type === "Analista")) {
      users = await User.getByQuery({ status: "Ativo", deleted: "false" });
      enableUserFilter = true;
    }

    res.render("statistics/boxcharts", {
      title: "Gráficos",
      layout: "layoutDashboard.hbs",
      ...req.session,
      allDestinations,
      allSampleTypes,
      users,
      enableUserFilter,
    });
  }
);

router.get("/statesData", auth.isAuthenticated, async (req, res) => {
  const filters = req.query;
  let data = await Requisition.getStateData(filters);
  res.send(data);
});

router.get("/samplesData", auth.isAuthenticated, async (req, res) => {
  const filters = req.query;
  let data = await Sample.getSampleData(filters);
  res.send(data);
});

router.get("/animalsData", auth.isAuthenticated, async (req, res) => {
  const filters = req.query;
  let data = await Requisition.getAnimalData(filters);
  res.send(data);
});

router.get("/finalizationData", auth.isAuthenticated, async (req, res) => {
  const filters = req.query;
  let data = await Sample.getFinalizationData(filters);
  res.send(data);
});

router.get("/resultsData", auth.isAuthenticated, async (req, res) => {
  const filters = req.query;
  let data = await Sample.getResultData(filters);
  res.send(data);
});

module.exports = router;
