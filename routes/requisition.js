const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Requisition = require("../models/requisition");
const Sample = require("../models/sample");
const User = require("../models/user");
const Kit = require("../models/kit");
const Email = require("../models/email");

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
    toxins: Toxins,
    user,
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
        toxins: Toxins,
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
      let samples = await Sample.getAllSpecialActive();
      let allSamples = new Array();
      samples.forEach((sample) => {
        sample = sample.toJSON();
        sample.toxins = new Array();
        Toxins.forEach((toxin) => {
          const Toxin = toxin.toJSON();
          let doesInclude = false;
          sample.analysis.forEach((data) => {
            if (data.toxin.sigle === Toxin.sigle) {
              doesInclude = true;
            }
          });
          if (doesInclude) {
            let aux = {};
            aux.name = Toxin.name;
            aux.lower = Toxin.lower;
            aux.toxinId = Toxin._id;
            const availableKits = allKits.find(
              (element) => element.name === Toxin.sigle
            ).kits;
            aux.kits = availableKits;
            sample.toxins.push(aux);
          }
        });
        allSamples.push(sample);
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
    try {
      const { _id, toxinData } = sample;
      const toxinList = Object.keys(toxinData);
      delete sample._id;

      let frase = "";
      let fraseCompleta =
        "Foi detectada a presença de *frase* na amostra analisada. O resultado da análise restringe-se tão somente à amostra analisada.";

      let analysis = new Array();
      toxinList.forEach((name, index) => {
        //Criação da frase
        if (index === 0) {
          frase = name;
        } else if (index === toxinList.length - 1) {
          frase = frase + ` e ${name}`;
        } else {
          frase = frase + `, ${name}`;
        }

        //Criação das análises
        const {
          toxinId, 
          resultNumber, 
          resultText, 
          resultChart, 
          wasDetected,
          kitId
        } = toxinData[name];
        const newAnalysis = {
          toxinId,
          status: "Finalizado",
          resultNumber,
          resultText,
          resultChart,
          wasDetected,
          kitId
        }
        analysis.push(newAnalysis);
      });
      sample.analysis = analysis;
      delete sample.toxinData;

      //Criação do report
      sample.report = {
        status: "Disponível para o produtor",
        feedback: fraseCompleta.replace("*frase*", frase),
        comment:  (sample.comment !== "") ? sample.comment :
        "Na análise de risco para micotoxinas diversos fatores devem ser considerados tais como:níveis e tipos de micotoxinas detectadas, status nutricional e imunológico dos animais, sexo, raça,ambiente, entre outros. Apenas para fins de referência, segue anexo com informações a respeito dos limites máximos tolerados em cereais e produtos derivados para alimentação animal.",
      }
      sample.specialFinalized = true;

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

    const sampleVector = requisition.sampleVector;
    delete requisition.sampleVector;

    try {
      const requisitionId = await Requisition.createSpecial(requisition);
      let sampleObjects = [];
      sampleVector &&
        sampleVector.forEach((sampleInfo) => {
          const {
            name,
            citrus,
            receivedQuantity,
            packingType,
            sampleNumber,
            limitDate,
          } = sampleInfo;

          const analysis = requisition.selectedToxins.map((toxinId) => ({
            toxinId,
            status: "Nova",
          }));

          const newSample = {
            name,
            approved: true,
            requisitionId,
            responsible: requisition.responsible,
            isCitrus: citrus ? true : false,
            receivedQuantity,
            packingType,
            creationYear: requisition.specialYear,
            isSpecial: true,
            sampleNumber,
            limitDate,
            specialFinalized: false,
            analysis,
          };

          sampleObjects.push(newSample);
        });

      await Sample.createManySpecial(sampleObjects);

      req.flash("success", "Nova requisição enviada");
      res.redirect("/requisition/specialnew");
    } catch (error) {
      console.warn(error);
      res.redirect("/error");
    }
  }
);

router.post(
  "/delete/:id",
  auth.isAuthenticated,
  auth.isAdmin,
  async (req, res) => {
    const { id } = req.params;
    Requisition.delete(req.params.id)

      .then(() => {
        res.redirect("/requisition");
        req.flash("success", "Requisição deletada com sucesso!");
      })
      .catch((error) => {
        console.warn(error);
        res.redirect("/error");
      });
  }
);

router.post("/new", auth.isAuthenticated, async function (req, res) {
  let { requisition } = req.body;

  // Add o usuário associado a requisição quando não é criado pelo ADM
  if (
    req.session.user.type !== "Analista" &&
    req.session.user.type !== "Admin"
  ) {
    requisition.charge.user = req.session.user._id;
  }

  const samplesVector = requisition.sampleVector;
  delete requisition.sampleVector;

  //Criar requisição
  requisition = await Requisition.create(requisition);

  //Criar samples
  let sampleObjects = [];

  samplesVector.forEach((sample) => {
    const { name, isCitrus, limitDate } = sample;

    const analysis = requisition.selectedToxins.map((toxinId) => ({
      toxinId,
      status: "Nova",
    }));

    const newSample = {
      name,
      requisitionId: requisition._id,
      isCitrus: isCitrus ? true : false,
      limitDate,
      analysis,
    };
    sampleObjects.push(newSample);
  });

  await Sample.createMany(sampleObjects);

  req.flash("success", "Nova requisição enviada");
  if (
    req.session.user.type === "Analista" ||
    req.session.user.type === "Admin"
  ) {
    res.redirect("/requisition");
  } else {
    res.redirect("/user");
  }
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

  specialRequisitions = specialRequisitions.map(formatSpecial);
  regularRequisitions = regularRequisitions.map(formatRequisition);

  function formatRequisition(requisition) {
    const req = requisition.toJSON();
    const date = new Date(requisition.createdAt);
    const year = date.getFullYear();

    req.year = year;

    return req;
  }

  function formatSpecial(requisition) {
    const req = requisition.toJSON();
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
  async function (req, res) {
    try {
      let users = await User.getByQuery({ status: "Ativo", deleted: "false" });
      const requisitionId = req.params.id;
      const requisition = await Requisition.getById(requisitionId);
      const samples = await Sample.getByFields({ requisitionId });

      let toxinsOptions = ToxinasAll.map((toxin) => {
        const result = samples?.find((sample) =>
          sample?.analysis?.find(
            (analysis) =>
              analysis.toxinId === toxin._id && !!analysis.resultNumber
          )
        );

        let hasToxin = requisition.selectedToxins.includes(toxin._id);
        let hasResult = !!result;

        return {
          ...toxin,
          disabled: hasResult,
          checked: hasToxin,
        };
      });

      res.render("requisition/admEdit", {
        title: "Edit Requisition",
        layout: "layoutDashboard.hbs",
        requisition,
        toxinsOptions,
        ...req.session,
        samples,
        allSampleTypes,
        allStates,
        users,
        allDestinations,
      });
    } catch (error) {
      console.warn(error);
      res.redirect("/error");
    }
  }
);

router.get("/useredit/:id", auth.isAuthenticated, function (req, res) {
  Requisition.getById(req.params.id)
    .then((requisition) => {
      res.render("requisition/useredit", {
        title: "Edit Requisition",
        layout: "layoutDashboard.hbs",
        requisition,
        allSampleTypes,
        allStates,
        allDestinations,
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
  async function (req, res) {
    const { requisition, samples } = req.body;
    const requisitionId = req.params.id;

    const isApproved =
      req.body.toApprove === "toApprove" || req.body.toApprove === "approved";

    requisition.approved = isApproved;
    requisition.status = isApproved ? "Aprovada" : "Nova";

    if (typeof requisition.selectedToxins === "string")
      requisition.selectedToxins = [requisition.selectedToxins];
    else if (!requisition.selectedToxins) requisition.selectedToxins = [];

    const oldRequisition = await Requisition.getById(requisitionId);

    const promises = [];
    const samplesIds = [];

    samples.forEach((sample) => {
      const { _id } = sample;

      samplesIds.push(_id.toString());

      promises.push(Sample.update(_id, sample));
    });

    // Verificar se ocorreu mudança nas toxinas
    const removed = [];
    const added = [];

    oldToxins = oldRequisition.selectedToxins.map((_id) => _id.toString());

    oldToxins?.forEach((id) => {
      if (
        !requisition.selectedToxins ||
        !requisition.selectedToxins?.includes(id)
      )
        removed.push(id);
    });

    requisition.selectedToxins?.forEach((id) => {
      if (!oldToxins.includes(id)) added.push(id);
    });

    if (removed.length > 0)
      promises.push(Sample.removeAnalysis(samplesIds, removed));

    if (added.length > 0) promises.push(Sample.addAnalysis(samplesIds, added));

    promises.push(Requisition.update(requisitionId, requisition));

    await Promise.all(promises);

    req.flash("success", "Requisição alterada com sucesso.");
    res.redirect(`/requisition/edit/${req.params.id}`);

    /**
     * Lógica de envio de emails caso aprovado
     */
    if (
      requisition.status == "Aprovada" &&
      oldRequisition.status != requisition.status
    ) {
      const { createdAt, requisitionNumber } = oldRequisition;

      const { email, fullname } = oldRequisition.charge.user;
      const sampleCode = `${requisitionNumber}/${createdAt.getFullYear()}`;
      Email.requisitionApprovedEmail(email, fullname, sampleCode);
    }
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
