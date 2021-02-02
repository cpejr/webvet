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
  Sample.getMaxSampleNumber()
    .then((maxSample) => {
      sample = {
        samplenumber: maxSample[0].samplenumber + 1,
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

router.post("/updatestatus/:status/:mycotoxin/:sampleId", async (req, res) => {
  try {
    const { status, mycotoxin, sampleId } = req.params;

    const sample = await Sample.getById(sampleId);
    const filedsToUpdate = {};

    if (sample[mycotoxin].status === "Mapa de Trabalho") {
      const workmapId = sample[mycotoxin].workmapId;
      filedsToUpdate[`${mycotoxin}.workmapId`] = null;

      Workmap.removeSample(workmapId, sampleId);
    }

    let newStatus;
    switch (status) {
      case "testing":
        newStatus = "Em análise";
        break;

      case "ownering":
        newStatus = "Aguardando pagamento";
        break;

      case "waiting":
        newStatus = "Aguardando amostra";
        break;
    }

    filedsToUpdate[`${mycotoxin}.status`] = newStatus;

    const response = await Sample.update(sampleId, { $set: filedsToUpdate });
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/setActiveKit/:toxinafull/:kitActiveID", function (req, res) {
  //Set active to inactive
  let sigla = ToxinasSigla[ToxinasFull.indexOf(req.params.toxinafull)];
  //Correção provisória do problema com a sigla
  if (sigla === "FBS") sigla = "FUMO";

  Kit.getActiveID(sigla)
    .then((kit) => {
      if (kit) Kit.setActiveStatus(kit._id, false);
    })
    .then(() => {
      //Update new one
      Kit.setActiveStatus(req.params.kitActiveID, true)
        .then((response) => {
          res.send(response);
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
});

router.get("/edit/:sampleId", async (req, res) => {
  const { sampleId } = req.params;

  try {
    const sample = await Sample.getById(sampleId);

    res.render("samples/edit", {
      title: "Editar amostra",
      layout: "layoutDashboard.hbs",
      sample,
    });
  } catch (error) {
    console.warn(error);
    res.redirect("/error");
  }
});

router.post("/save", (req, res) => {
  const { sample } = req.body;
  sample.isCitrus = sample.isCitrus ? true : false;
  Sample.updateBySampleNumber(sample.samplenumber + "", sample)
    .then(() => {
      req.flash("success", "Amostra alterada");
      res.redirect("/sample/edit/" + sample.samplenumber);
    })
    .catch((error) => {
      console.warn(error);
      res.redirect("/error");
    });
});

module.exports = router;
