const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Sample = require("../models/sample");
const Kit = require("../models/kit");

/* GET home page. */

router.get("/", auth.isAuthenticated, function (req, res) {
  res.render("test", {
    title: "Usuários",
    layout: "layoutDashboard.hbs",
    ...req.session,
  });
});

router.post("/create", auth.isAuthenticated, (req, res) => {
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

router.post(
  "/updateAnalysisWorkmapAndStatus/:analysisId",
  auth.isAuthenticated,
  async (req, res) => {
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
  }
);

router.get("/edit/:sampleId", auth.isAuthenticated, async (req, res) => {
  const { sampleId } = req.params;

  try {
    const sample = await Sample.getById(sampleId);

    res.render("samples/edit", {
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

router.post("/edit", auth.isAuthenticated, (req, res) => {
  const { _id, ...fieldsToUpdate } = req.body?.sample;
  fieldsToUpdate.isCitrus = fieldsToUpdate.isCitrus ? true : false;

  Sample.update(_id, fieldsToUpdate)
    .then(() => {
      req.flash("success", "Amostra alterada");
      res.redirect(`/sample/edit/${_id}`);
    })
    .catch((error) => {
      console.warn(error);
      res.redirect("/error");
    });
});

router.get(
  "/getAllWithoutFinalization",
  auth.isAuthenticated,
  async (req, res) => {
    const data = await Sample.getAllWithoutFinalization();
    res.send(data);
  }
);

module.exports = router;
