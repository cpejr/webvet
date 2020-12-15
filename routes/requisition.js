const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Requisition = require("../models/requisition");
const Sample = require("../models/sample");
const User = require("../models/user");
const Kit = require("../models/kit");

router.get("/new", auth.isAuthenticated, async function (req, res) {
  let users = await User.getByQuery({ status: "Ativo", deleted: "false" });
  // console.log(req.session);
  res.render("requisition/newrequisition", {
    title: "Requisition",
    layout: "layoutDashboard.hbs",
    users,
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
      let allSamples = await Sample.getAllActive();
      allSamples = allSamples.reverse();
      allSamples.forEach((sample) => {
        sample.toxins = new Array();
        ToxinasAll.forEach((toxina) => {
          let aux = sample[toxina.Full];
          aux.name = toxina.Full;
          const availableKits = allKits.find(
            (element) => element.name === toxina.Full
          ).kits;
          aux["kits"] = availableKits;
          // auxconsole.log("Aux: ", aux);
          if (aux.active) {
            sample.toxins.push(aux);
          }
          delete sample[toxina.Full];
        });
      });
      //console.log("Samples: ", allSamples);
      res.render("requisition/specialpanel", {
        title: "Painél de administração de amostras",
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
    console.log("Sample:", sample);
    res.redirect("/requisition/specialpanel");
  }
);

router.post(
  "/specialnew",
  auth.isAuthenticated,
  auth.isFromLab,
  async function (req, res) {
    const { requisition } = req.body;

    const sampleVector = [...requisition.sampleVector];
    delete requisition.sampleVector;

    try {
      const requisitionId = await Requisition.create(requisition);
      let sampleObjects = new Array();
      sampleVector &&
        sampleVector.forEach((sampleInfo) => {
          const { name, citrus, description } = sampleInfo;
          let sample = {
            name,
            description,
            sampleNumber: -1,
            requisitionId,
            responsible: requisition.responsible,
            isCitrus: citrus ? true : false,
          };
          ToxinasAll.forEach((toxina) => {
            const value = requisition.mycotoxin.includes(toxina.Formal)
              ? true
              : false;
            sample[toxina.Full] = { active: value };
          });
          sampleObjects.push(sample);
        });

      const newSamples = await Sample.createMany(sampleObjects);
      let promiseVector = new Array();
      newSamples.forEach((sample) => {
        const id = sample.id;
        promiseVector.push(Requisition.addSample(requisitionId, id));
      });
      await Promise.all(promiseVector);

      req.flash("success", "Nova requisição enviada");
      res.redirect("/requisition/specialpanel");
    } catch (error) {
      console.warn(error);
      res.redirect("/error");
    }
  }
);

router.post("/delete/:id", auth.isAuthenticated, auth.isAdmin, (req, res) => {
  Requisition.delete(req.params.id).then(() => {
    res.redirect("/requisition");
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
      for (let i = 0; i < samplesVector.length; i++) {
        const { name, citrus } = samplesVector[i];

        const sample = {
          name,
          samplenumber: -1,
          responsible: req.body.requisition.responsible,
          requisitionId: NaN,
          isCitrus: citrus ? true : false,
          aflatoxina: {
            active: false,
          },
          ocratoxina: {
            active: false,
          },
          deoxinivalenol: {
            active: false,
          },
          fumonisina: {
            active: false,
          },
          t2toxina: {
            active: false,
          },
          zearalenona: {
            active: false,
          },
        };

        for (let i = 0; i < ToxinasFormal.length; i++) {
          const formal = ToxinasFormal[i];
          const full = ToxinasFull[i];

          if (req.body.requisition.mycotoxin.includes(formal))
            sample[full].active = true;
        }

        sample.requisitionId = reqid;
        sampleObjects.push(sample);
      }

      Sample.createMany(sampleObjects)
        .then((sids) => {
          for (let index = 0; index < sids.length; index++) {
            const sid = sids[index]._id;

            //Isso aq dá para otimizar (acho)
            Requisition.addSample(reqid, sid).catch((error) => {
              console.warn(error);
              res.redirect("/error");
            });
          }
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

router.get("/", auth.isAuthenticated, function (req, res) {
  Requisition.getAll().then((requisitions) => {
    requisitions = requisitions.reverse();
    res.render("requisition/index", {
      title: "Requisições Disponíveis",
      layout: "layoutDashboard.hbs",
      ...req.session,
      requisitions,
    });
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
        description: sample[i].description,
      };

      ToxinasAll.forEach((toxina) => {
        const containsToxin = requisition.mycotoxin.includes(toxina.Formal);
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
