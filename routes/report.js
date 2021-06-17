var express = require("express");
var router = express.Router();
const auth = require("../middlewares/auth");
const Requisition = require("../models/requisition");
const Sample = require("../models/sample");
const moment = require("moment");
const Email = require("../models/email");

function round(value, decimalPlaces) {
  if (value !== null && value !== undefined)
    return value.toFixed(decimalPlaces);
  else return null;
}

router.get("/", auth.isAuthenticated, function (req, res) {
  Requisition.getAll().then((requisitions) => {
    var user = req.session.user.cpfCnpj;
    var logados = new Array();
    var countlogados = 0;
    for (var i = 0; i < requisitions.length; i++) {
      if (requisitions[i].user.cpfCnpj == user) {
        logados[countlogados] = requisitions[i];
        countlogados++;
      } else {
      }
    }
    res.render("report/index", {
      title: "Requisições Disponíveis",
      layout: "layoutDashboard.hbs",
      ...req.session,
      logados,
    });
  });
});

router.get("/show/:id", auth.isAuthenticated, async function (req, res) {
  const sample = (await Sample.getByIdAndPopulate(req.params.id)).toJSON();
  let { requisition } = sample;

  const toxinsNames = requisition.selectedToxins
    .map((toxin) => toxin.name)
    .sort();

  requisition = {
    ...requisition,
    toxinas:
      toxinsNames.slice(0, -1).join(", ") + " e " + toxinsNames.slice(-1),
    year: requisition.createdAt.getFullYear(),
  };

  sample.analysis = sample.analysis.map((analysis, index) => {
    if (analysis.status !== "Finalizado") {
      analysis.resultText = "Aguardando finalização";
      analysis.kit = {
        Lod: "Aguardando finalização",
        Loq: "Aguardando finalização",
      };
    }

    return analysis;
  });

  moment.locale("pt-br");
  sample.date = moment(sample.updatedAt).format("LL");
  requisition.analysis.receiptDate = moment(
    requisition.analysis.receiptDate
  ).format("DD/MM/YYYY");

  res.render("report/show", {
    title: "Show ",
    sample,
    requisition,
    ...req.session,
  });
});

router.get("/show/admin/:id", auth.isAuthenticated, async function (req, res) {
  const sample = (await Sample.getByIdAndPopulate(req.params.id)).toJSON();
  let { requisition } = sample;

  const toxinsNames = requisition.selectedToxins
    .map((toxin) => toxin.name)
    .sort();

  requisition = {
    ...requisition,
    toxinas:
      toxinsNames.slice(0, -1).join(", ") + " e " + toxinsNames.slice(-1),
    year: requisition.createdAt.getFullYear(),
  };

  if (!sample.report) sample.report = {};
  if (!sample.report.comment)
    sample.report.comment = `Na análise de risco para micotoxinas diversos fatores devem ser considerados tais como:\n níveis e tipos de micotoxinas detectadas, status nutricional e imunológico dos animais, sexo, raça, ambiente, entre outros. Apenas para fins de referência, segue anexo com informações a respeito dos limites máximos tolerados em cereais e produtos derivados para alimentação animal.`;

  sample.analysis = sample.analysis.map((analysis, index) => {
    const kit = analysis.kit;

    if (analysis.status !== "Finalizado") {
      analysis.resultText = "Aguardando finalização";
      analysis.kit = {
        Lod: "Aguardando finalização",
        Loq: "Aguardando finalização",
      };
    } else {
      analysis.resultNumber = round(analysis.resultNumber, 2);

      if (!analysis.resultChart || !analysis.resultText) {
        let newResultChart; //Essa é a variável que vai receber o valor que irá para o gráfico final
        let newResultText;

        if (analysis.resultNumber < kit.Lod) {
          //Menor que lod
          newResultText = "ND";
          newResultChart = kit.Lod;
        } else if (analysis.resultNumber < kit.Loq) {
          //Maior que o lod e Menor que loq
          newResultText = "< LoQ";
          newResultChart = kit.Loq;
        } else if (analysis.resultNumber >= kit.Loq) {
          //Maior loq
          newResultText = analysis.resultNumber;
          newResultChart = analysis.resultNumber;
        }

        analysis.wasDetected = newResultText !== "ND";
        analysis.resultText = newResultText;
        analysis.resultChart = newResultChart;
      }
    }

    return analysis;
  });
  moment.locale("pt-br");
  sample.date = moment(sample.updatedAt).format("LL");
  requisition.analysis.receiptDate = moment(
    requisition.analysis.receiptDate
  ).format("DD/MM/YYYY");

  res.render("report/editAdmin", {
    title: "Edição de laudo",
    sample,
    requisition,
    ...req.session,
  });
});

router.post("/show/admin/:id", auth.isAuthenticated, async function (req, res) {
  const sampleId = req.params.id;
  const { status } = req.query;
  const { analysis, feedback, comment } = req.body;

  const analysisIds = Object.keys(analysis);

  const promises = [];
  analysisIds.forEach((analysisId) => {
    const { resultChart, resultText, wasDetected } = analysis[analysisId];

    if (resultText !== "Aguardando finalização" && resultChart !== "") {
      const query = Sample.SampleModel.updateOne(
        { _id: sampleId, "analysis._id": analysisId },
        {
          $set: {
            "analysis.$.resultChart": resultChart,
            "analysis.$.resultText": resultText,
            "analysis.$.wasDetected": !!wasDetected,
          },
        }
      );
      promises.push(query);
    }
  });

  promises.push(
    Sample.SampleModel.updateOne(
      { _id: sampleId },
      {
        "report.feedback": feedback,
        "report.comment": comment,
        "report.status": status || "Não finalizado",
      }
    )
  );

  await Promise.all(promises);
  req.flash("success", "Atualizado com sucesso.");
  res.redirect("/report/show/admin/" + sampleId);

  /**
   * Lógica de envio de emails caso finalizado
   */
  if (status === "Disponível para o produtor") {
    const sampleData = await Sample.getByIdAndPopulate(sampleId);

    const { createdAt, sampleNumber, requisition } = sampleData;
    const { email, fullname } = requisition.charge.user;
    const sampleCode = `${sampleNumber}/${createdAt.getFullYear()}`;
    Email.reportEmail(email, fullname, sampleCode);
  }
});

router.get("/samples/:id", auth.isAuthenticated, function (req, res) {
  var amostras = new Array();
  var teste1 = new Array();
  Requisition.getById(req.params.id)
    .then((requisitions) => {
      amostras = requisitions.samples;
      Sample.getById(amostras).then((tututu) => {
        for (var i = 0; i < amostras.length; i++) {
          teste1[i] = tututu[i];
        }
        res.render("report/samples", {
          title: "Amostas",
          layout: "layoutDashboard.hbs",
          teste1,
          ...req.session,
        });
      });
    })
    .catch((error) => {
      console.warn(error);
      res.redirect("/error");
    });
});

router.get(
  "/admreport",
  auth.isAuthenticated,
  auth.isFromLab,
  async function (req, res) {
    let { specialPage = 1, regularPage = 1 } = req.query;
    if (specialPage <= 0) specialPage = 1;
    if (regularPage <= 0) regularPage = 1;

    try {
      let amostras = Sample.getRegularFinalized(regularPage);
      let especiais = Sample.getSpecialFinalized(specialPage);

      let regularCountPages = Sample.getRegularCountPages();
      let specialCountPages = Sample.getSpecialCountPages();

      [amostras, especiais, specialCountPages, regularCountPages] =
        await Promise.all([
          amostras,
          especiais,
          specialCountPages,
          regularCountPages,
        ]);

      res.render("report/admreport", {
        title: "Laudos Disponíveis",
        layout: "layoutDashboard.hbs",
        ...req.session,
        laudos: amostras,
        laudosEspeciais: especiais,
        number_of_pages_special_plus_1: specialCountPages + 1,
        number_of_pages_regular_plus_1: regularCountPages + 1,
      });
    } catch (error) {
      console.warn(error);
      res.redirect("/error");
    }
  }
);

module.exports = router;
