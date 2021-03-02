const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Requisition = require("../models/requisition");
const Sample = require("../models/sample");
const User = require("../models/user");
const Kit = require("../models/kit");

router.get("/new", auth.isAuthenticated, async function (req, res) {
  let users = await User.getByQuery({ status: "Ativo", deleted: "false" });
  const { user } = req.session;
  res.render("requisition/newrequisition", {
    title: "Requisition",
    layout: "layoutDashboard.hbs",
    users,
    isFromLab: user.type === "Admin" || user.type === "Analista" ? true : false,
    allStates,
    allDestinations,
    ToxinasAll,
    ...req.session,
  });
});

//Rota para o admin criar várias requisições facilmente
router.get(
  "/specialnew",
  auth.isAuthenticated,
  auth.isFromLab,
  async function (req, res) {
    try {
      let users = await User.getByQuery({ status: "Ativo", deleted: "false" });
      const stringUsers = JSON.stringify(users);
      res.render("requisition/specialnew", {
        title: "Criar requisição",
        layout: "layoutDashboard.hbs",
        users,
        stringUsers,
        allStates,
        allDestinations,
        allSampleTypes,
        ToxinasAll,
        ...req.session,
      });
    } catch (error) {
      console.warn(error);
      res.redirect("/error");
    }
  }
);

router.get(
  "/specialpanel",
  auth.isAuthenticated,
  auth.isAdmin,
  async function (req, res) {
    try {
      const allKits = await Kit.getAllForSpecialPanel();
      let allSamples = await Sample.getAllSpecialActive();
      allSamples = allSamples.reverse();
      allSamples.forEach((sample) => {
        sample.toxins = new Array();
        ToxinasAll.forEach((toxina) => {
          let aux = sample[toxina.Full];
          aux.formal = toxina.Formal;
          aux.full = toxina.Full;
          const availableKits = allKits.find(
            (element) => element.name === toxina.Full
          ).kits;
          aux["kits"] = availableKits;
          if (aux.active) {
            sample.toxins.push(aux);
          }
          delete sample[toxina.Full];
        });
      });
      res.render("requisition/specialpanel", {
        title: "Painel de Amostras",
        layout: "layoutDashboard.hbs",
        ...req.session,
        allSamples,
      });
    } catch (error) {
      console.warn(error);
      res.redirect("/error");
    }
  }
);

router.post(
  "/specialpanel",
  auth.isAuthenticated,
  auth.isFromLab,
  async function (req, res) {
    const { sample } = req.body;
    const { _id } = sample;
    delete sample._id;
    sample.specialFinalized = true;
    sample.report = true;

    try {
      let toxinArray = new Array();
      ToxinasAll.forEach((toxina) => {
        if (sample[toxina.Full]) {
          toxinArray.push(toxina.Full);
          sample[toxina.Full].active = false;
        }
      });
      let frase = "";
      let fraseCompleta =
        "Foi detectada a presença de *frase* na amostra analisada. O resultado da análise restringe-se tão somente à amostra analisada.";

      toxinArray.forEach((name, index) => {
        if (index === 0) {
          frase = name;
        } else if (index === toxinArray.length - 1) {
          frase = frase + ` e ${name}`;
        } else {
          frase = frase + `, ${name}`;
        }
      });

      sample.parecer = fraseCompleta = fraseCompleta.replace("*frase*", frase);
      if (sample.comment === "")
        sample.comment =
          "Na análise de risco para micotoxinas diversos fatores devem ser considerados tais como:níveis e tipos de micotoxinas detectadas, status nutricional e imunológico dos animais, sexo, raça,ambiente, entre outros. Apenas para fins de referência, segue anexo com informações a respeito dos limites máximos tolerados em cereais e produtos derivados para alimentação animal.";

      await Sample.updateCustom(_id, sample);

      req.flash("success", "Amostra finalizada com sucesso!");
      res.redirect("/requisition/specialpanel");
    } catch (error) {
      console.warn(error);
      res.redirect("/error");
    }
  }
);

router.post(
  "/specialnew",
  auth.isAuthenticated,
  auth.isFromLab,
  async function (req, res) {
    const { requisition } = req.body;
    requisition.status = "Aprovada";
    requisition.special = true;

    const sampleVector = [...requisition.sampleVector];
    delete requisition.sampleVector;

    try {
      const requisitionId = await Requisition.createSpecial(requisition);
      let sampleObjects = [];
      sampleVector &&
        sampleVector.forEach((sampleInfo) => {
          const {
            name,
            citrus,
            receivedquantity,
            packingtype,
            samplenumber,
            limitDate,
          } = sampleInfo;

          let sample = {
            name,
            approved: true,
            requisitionId,
            responsible: requisition.responsible,
            isCitrus: citrus ? true : false,
            receivedquantity,
            packingtype,
            creationYear: requisition.specialYear,
            isSpecial: true,
            samplenumber,
            limitDate,
            specialFinalized: true,
          };

          if (!requisition.mycotoxin) requisition.mycotoxin = [];

          ToxinasAll.forEach((toxina) => {
            let containsToxin = false;
            containsToxin = requisition.mycotoxin.includes(toxina.Formal);
            sample[toxina.Full] = { active: containsToxin };
          });
          sampleObjects.push(sample);
        });

      const newSamples = await Sample.createManySpecial(sampleObjects);
      let promiseVector = new Array();
      newSamples.forEach((sample) => {
        const id = sample.id;
        promiseVector.push(Requisition.addSample(requisitionId, id));
      });
      await Promise.all(promiseVector);

      req.flash("success", "Nova requisição enviada");
      res.redirect("/requisition/specialnew");
    } catch (error) {
      console.warn(error);
      res.redirect("/error");
    }
  }
);

router.post("/delete/:id", auth.isAuthenticated, auth.isAdmin, (req, res) => {
  Requisition.delete(req.params.id)
    .then(() => {
      res.redirect("/requisition");
      req.flash("success", "Requisição deletada com sucesso!");
    })
    .catch((error) => {
      console.warn(error);
      res.redirect("/error");
    });
});

router.post("/new", auth.isAuthenticated, function (req, res) {
  const { requisition } = req.body;
  if (
    req.session.user.type !== "Analista" &&
    req.session.user.type !== "Admin"
  ) {
    requisition.user = req.session.user._id;
  }

  //CORREÇÃO PROVISÓRIA DO CAMPO DESTINATION
  if (Array.isArray(requisition.destination))
    requisition.destination = requisition.destination.toString();

  if (req.body.producerAddress == 0) {
    //Provavelmente está errado. Tá substituindo o que a pessoa digitou
    const address = req.session.user.address;
    requisition.address = address;
  }
  const samplesVector = [...requisition.sampleVector];

  delete requisition.sampleVector;

  Requisition.create(requisition)
    .then((reqid) => {
      let sampleObjects = [];

      samplesVector.forEach((sample) => {
        const { name, citrus, limitDate } = sample;
        const newSample = {
          name,
          samplenumber: -1,
          responsible: requisition.responsible,
          requisitionId: NaN,
          isCitrus: citrus ? true : false,
          limitDate,
        };

        ToxinasAll.forEach((toxin) => {
          if (requisition.mycotoxin.includes(toxin.Formal)) {
            newSample[toxin.Full] = { active: true };
          } else {
            newSample[toxin.Full] = { active: false };
          }
        });

        newSample.requisitionId = reqid;
        sampleObjects.push(newSample);
      });

      Sample.createMany(sampleObjects)
        .then((sids) => {
          sids.forEach((sid) => {
            Requisition.addSample(reqid, sid).catch((error) => {
              console.warn(error);
              res.redirect("/error");
            });
          });
        })
        .catch((error) => {
          console.warn(error);
          res.redirect("/error");
        });

      req.flash("success", "Nova requisição enviada");
      if (
        req.session.user.type === "Analista" ||
        req.session.user.type === "Admin"
      ) {
        res.redirect("/requisition");
      } else {
        res.redirect("/user");
      }
    })
    .catch((error) => {
      console.warn(error);
      res.redirect("/error"); //catch do create
    });
});

router.get("/", auth.isAuthenticated, async function (req, res) {
  let { specialPage = 1, regularPage = 1 } = req.query;
  if (specialPage <= 0) specialPage = 1;
  if (regularPage <= 0) regularPage = 1;

  let specialRequisitions = Requisition.getSpecial(specialPage);
  let regularRequisitions = Requisition.getRegular(regularPage);

  let specialCountPages = Requisition.getSpecialCountPages();
  let regularCountPages = Requisition.getRegularCountPages();

  [
    specialRequisitions,
    regularRequisitions,
    specialCountPages,
    regularCountPages,
  ] = await Promise.all([
    specialRequisitions,
    regularRequisitions,
    specialCountPages,
    regularCountPages,
  ]);

  specialRequisitions = specialRequisitions.map(formatRequisition);
  regularRequisitions = regularRequisitions.map(formatRequisition);

  function formatRequisition(requisition) {
    const req = requisition.toJSON();
    const date = new Date(requisition.createdAt);
    const year = date.getFullYear();

    req.year = year;

    return req;
  }

  res.render("requisition/index", {
    title: "Requisições Disponíveis",
    layout: "layoutDashboard.hbs",
    ...req.session,
    specialRequisitions,
    regularRequisitions,
    number_of_pages_special_plus_1: specialCountPages + 1,
    number_of_pages_regular_plus_1: regularCountPages + 1,
    specialPage,
    regularPage,
  });
});

router.get(
  "/edit/:id",
  auth.isAuthenticated,
  auth.isFromLab,
  function (req, res) {
    Requisition.getById(req.params.id)
      .then((requisition) => {
        Sample.getByIdArray(requisition.samples).then((samples) => {
          let nova = false;
          const requisitionExtra = {};

          if (requisition.status === "Nova") {
            nova = true;
          }

          ToxinasFull.forEach((toxin) => {
            let hasResult = false;
            for (let i = 0; i < samples.length; i++)
              if (samples[i][toxin].result) {
                hasResult = true;
                break;
              }

            requisitionExtra[`${toxin}_hasResult`] = hasResult;
          });

          res.render("requisition/edit", {
            title: "Edit Requisition",
            layout: "layoutDashboard.hbs",
            requisition,
            requisitionExtra,
            nova,
            ...req.session,
            samples,
            allSampleTypes,
          });
        });
      })
      .catch((error) => {
        console.warn(error);
        res.redirect("/error");
      });
  }
);

router.get("/useredit/:id", auth.isAuthenticated, function (req, res) {
  Requisition.getById(req.params.id)
    .then((requisition) => {
      res.render("requisition/useredit", {
        title: "Edit Requisition",
        layout: "layoutDashboard.hbs",
        requisition,
        ...req.session,
      });
    })
    .catch((error) => {
      console.warn(error);
      res.redirect("/error");
    });
});

router.post(
  "/edit/:id",
  auth.isAuthenticated,
  auth.isFromLab,
  function (req, res) {
    var { requisition, sample } = req.body;

    const isApproved =
      req.body.toApprove === "toApprove" || req.body.toApprove === "approved";

    if (isApproved) {
      requisition.status = "Aprovada";
    }

    for (let i = 0; i < sample.length; i++) {
      let samples = {
        name: sample[i].name,
        sampletype: sample[i].sampletype,
        approved: isApproved,
        isCitrus: sample[i].isCitrus ? true : false,
        receivedquantity: sample[i].receivedquantity,
        packingtype: sample[i].packingtype,
      };

      if (!requisition.mycotoxin) requisition.mycotoxin = [];

      ToxinasAll.forEach((toxina) => {
        let containsToxin = false;
        containsToxin = requisition.mycotoxin.includes(toxina.Formal);
        samples[`${toxina.Full}.active`] = containsToxin;
      });

      Sample.update(sample[i]._id, samples)
        .then(() => {})
        .catch((error) => {
          console.warn(error);
          res.redirect("/error");
        });
    }
    Requisition.update(req.params.id, requisition)
      .then(() => {
        req.flash("success", "Requisição alterada com sucesso.");
        res.redirect(`/requisition/edit/${req.params.id}`);
      })
      .catch((error) => {
        console.warn(error);
        res.redirect("/error");
      });
  }
);

router.post("/useredit/:id", auth.isAuthenticated, function (req, res) {
  var requisition = req.body.requisition;
  Requisition.update(req.params.id, requisition)
    .then(() => {
      req.flash("success", "Requisição alterada com sucesso.");
      res.redirect(`/requisition/useredit/${req.params.id}`);
    })
    .catch((error) => {
      console.warn(error);
      res.redirect("/error");
    });
});

module.exports = router;
