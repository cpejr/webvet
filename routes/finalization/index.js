const express = require("express");
const routes = express.Router();

const calibrationcurvesRouter = require("./calibrationcurves");
const calibratorsRouter = require("./calibrators");
const absorbancesRouter = require("./absorvances");
const resultRouter = require("./result");

routes.use("/calibrationcurves", calibrationcurvesRouter);
routes.use("/calibrators", calibratorsRouter);
routes.use("/absorbances", absorbancesRouter);
routes.use("/result", resultRouter);

module.exports = routes;
