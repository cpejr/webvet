const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Sample = require("../models/sample");
const Kit = require("../models/kit");
const Workmap = require("../models/Workmap");

/* GET home page. */

router.get("/", auth.isAuthenticated, function (req, res) {
  res.render("test", {
    title: "Usuários",
    layout: "layoutDashboard.hbs",
    ...req.session,
  });
});

router.post("/create", (req, res) => {
  const { sample } = req.body;
  Sample.getMaxsampleNumber()
    .then((maxSample) => {
      sample = {
        sampleNumber: maxSample[0].sampleNumber + 1,
      };

      Sample.create(sample)
        .then(() => {
          req.flash("success", "Cadastrado com sucesso.");
        })
        .catch((error) => {
          console.warn(error);
          res.redirect("/error");
        });
    })
    .catch((error) => {
      console.warn(error);
      res.redirect("/error");
    });
});

router.post("/updateAnalysisWorkmapAndStatus/:analysisId", async (req, res) => {
  try {
    const { analysisId } = req.params;
    let { workmapId, status } = req.body;

    if (!workmapId) workmapId = null;

    const filedsToUpdate = {};

    let newStatus;
    if (workmapId && workmapId !== null) newStatus = "Mapa de Trabalho";
    else if (!status) newStatus = "Em análise";
    else newStatus = status;

    filedsToUpdate[`analysis.$.status`] = newStatus;
    filedsToUpdate[`analysis.$.workmapId`] = workmapId;

    const sample = await Sample.SampleModel.findOneAndUpdate(
      { "analysis._id": analysisId },
      { $set: filedsToUpdate }
    );

    const analysis = sample.analysis.find(
      (analysis) => analysis._id == analysisId
    );

    const response = await Kit.updateSampleWorkmapId(
      analysis.workmapId,
      workmapId,
      sample._id
    );

    res.status(200).send(response);
  } catch (error) {
    console.warn(error);
    res.status(500).send();
  }
});

router.post("/scndTesting/edit/:mycotoxin/:sampleId", async (req, res) => {
  try {
    //this function is for the second kanban
    const { mycotoxin, sampleId } = req.params;

    const sample = await Sample.getById(sampleId);

    if (sample[mycotoxin].status === "Mapa de Trabalho")
      Workmap.removeSample(sample[mycotoxin].workmapId, sampleId);

    let sampleUpdate = {};
    sampleUpdate[mycotoxin + ".status"] = "Em análise";
    sampleUpdate[mycotoxin + ".workmapId"] = null;

    const response = await Sample.updateCustom(sampleId, sampleUpdate);

    res.status(200).send(response);
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/mapedit/:mycotoxin/:sampleId/:mapID", async (req, res) => {
  try {
    const { mapID, sampleId, mycotoxin } = req.params;

    const sample = await Sample.getById(sampleId);
    const promises = [];
    if (sample[mycotoxin].workmapId + "" !== mapID) {
      if (sample[mycotoxin].status === "Mapa de Trabalho")
        promises.push(
          Workmap.removeSample(sample[mycotoxin].workmapId, sampleId)
        );

      promises.push(Workmap.addSample(mapID, sampleId));

      let sampleUpdate = {};
      sampleUpdate[mycotoxin + ".status"] = "Mapa de Trabalho";
      sampleUpdate[mycotoxin + ".workmapId"] = mapID;

      promises.push(Sample.updateCustom(sampleId, sampleUpdate));
    }

    await Promise.all(promises);
    res.status(200).send("ok");
  } catch (error) {
    res.status(500).send("fail");
    console.warn(error);
  }
});

router.get("/edit/:sampleId", async (req, res) => {
  const { sampleId } = req.params;

  try {
    const sample = await Sample.getById(sampleId);

    res.render("samples/admEdit", {
      title: "Editar amostra",
      layout: "layoutDashboard.hbs",
      sample,
      allDestinations,
    });
  } catch (error) {
    console.warn(error);
    res.redirect("/error");
  }
});

router.post("/save", (req, res) => {
  const { sample } = req.body;
  sample.isCitrus = sample.isCitrus ? true : false;
  Sample.updateBysampleNumber(sample.sampleNumber + "", sample)
    .then(() => {
      req.flash("success", "Amostra alterada");
      res.redirect("/sample/edit/" + sample.sampleNumber);
    })
    .catch((error) => {
      console.warn(error);
      res.redirect("/error");
    });
});

module.exports = router;
