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
    var user = req.session.user.register;
    var logados = new Array();
    var countlogados = 0;
    for (var i = 0; i < requisitions.length; i++) {
      if (requisitions[i].user.register == user) {
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
  try {
    const sample = await Sample.getByIdAndPopulate(req.params.id);

    const requisition = sample.requisitionId;
    const toxinVector = [];

    const Requisitiondata = {
      listToxinas: requisition.mycotoxin,
      toxinas: requisition.mycotoxin.sort().join(", "),
      requisitionnumber: requisition.requisitionnumber,
      year: requisition.createdAt.getFullYear(),
      producer: requisition.producer,
      clientName: requisition.client.fullname,
      packingtype: requisition.packingtype,
      receivedquantity: requisition.receivedquantity,
      datereceipt: requisition.datereceipt,
      autorizationnumber: requisition.autorizationnumber,
      responsible: requisition.responsible,
    };

    ToxinasFull.forEach((toxinFull, index) => {
      const toxinKit = sample[toxinFull];
      const toxinFormal = ToxinasFormal[index];

      if (requisition.mycotoxin.includes(toxinFormal)) {
        const kit = toxinKit.kitId;

        const toxinData = {
          toxinDisplayName: toxinFormal,
          toxinFull,
          resultText: "Aguardando finalização",
          lod: "Aguardando finalização",
          loq: "Aguardando finalização",
        };

        if (kit) {
          toxinData.resultText = toxinKit.resultText;
          toxinData.lod = kit.Lod;
          toxinData.loq = kit.Loq;
        }

        toxinVector.push(toxinData);
      }
    });

    moment.locale("pt-br");
    sample.date = moment(sample.updatedAt).format("LL");

    res.render("report/show", {
      title: "Show ",
      sample,
      toxinVector,
      Requisitiondata,
      ...req.session,
    });
  } catch (error) {
    console.warn(error);
    res.redirect("/error");
  }
});

router.get("/show/admin/:id", auth.isAuthenticated, async function (req, res) {
  try {
    const sample = await Sample.getByIdAndPopulate(req.params.id);

    const requisition = sample.requisitionId;
    const toxinVector = [];

    const Requisitiondata = {
      listToxinas: requisition.mycotoxin,
      toxinas: requisition.mycotoxin.sort().join(", "),
      requisitionnumber: requisition.requisitionnumber,
      year: requisition.createdAt.getFullYear(),
      producer: requisition.producer,
      clientName: requisition.client.fullname,
      packingtype: requisition.packingtype,
      receivedquantity: requisition.receivedquantity,
      datereceipt: requisition.datereceipt,
      autorizationnumber: requisition.autorizationnumber,
      responsible: requisition.responsible,
    };

    if (!sample.comment)
      sample.comment = `Na análise de risco para micotoxinas diversos fatores devem ser considerados tais como:\n níveis e tipos de micotoxinas detectadas, status nutricional e imunológico dos animais, sexo, raça, ambiente, entre outros. Apenas para fins de referência, segue anexo com informações a respeito dos limites máximos tolerados em cereais e produtos derivados para alimentação animal.`;

    ToxinasFull.forEach((toxinFull, index) => {
      const toxinInfo = sample[toxinFull];
      const toxinFormal = ToxinasFormal[index];

      if (requisition.mycotoxin.includes(toxinFormal)) {
        const kit = toxinInfo.kitId;

        const toxinData = {
          toxinDisplayName: toxinFormal,
          toxinFull,
          result: "-",
          resultChart: 0,
          resultText: "Aguardando finalização",
          lod: "Aguardando finalização",
          loq: "Aguardando finalização",
          checked: false,
        };

        if (kit) {
          toxinData.lod = kit.Lod;
          toxinData.loq = kit.Loq;

          const result = toxinInfo.result;
          let resultChart; //Essa é a variável que vai receber o valor que irá para o gráfico final
          let roundResult; //Essa é a variável que receberá o valor final com duas casas decimais (que ficará salvo no mongo como valor resultado)
          let resultText = toxinInfo.resultText; //Essa é a variável que vai receber o texto que vai aparecer em cada toxina (Concentração Detectada)

          // Essas variaveis vão recever o valor padrão de acordo com o resultado
          // Caso esses valores forem modificados pelo usuário, não vão ser alterados
          let newResultText;

          // 1º Verificar se retornou um resultado
          if (isNaN(result)) {
            resultChart = kit.Lod;
            roundResult = result;
            newResultText = "ND";
          } else {
            roundResult = Number(result);
            roundResult = round(roundResult, 2);

            if (roundResult < kit.Lod) {
              //Menor que lod
              newResultText = "ND";
              resultChart = kit.Lod;
            } else if (roundResult < kit.Loq) {
              //Maior que o lod e Menor que loq
              newResultText = "< LoQ";
              resultChart = kit.Loq;
            } else if (roundResult >= kit.Loq) {
              //Maior loq
              newResultText = roundResult;
              resultChart = roundResult;
            }
          }

          if (!resultText) {
            // Esse código sera acionado na primeira vez que o usuário
            // abrir o laudo

            if (newResultText !== "ND") toxinInfo.checked = true;
            else toxinInfo.checked = false;

            resultText = newResultText;
          }

          toxinData.result = result;
          toxinData.resultText = resultText;
          toxinData.resultChart = Number(resultChart);
          toxinData.checked = toxinInfo.checked;
          toxinData.roundResult = roundResult;
        }
        toxinVector.push(toxinData);
      }
    });
    // console.log(toxinVector);
    moment.locale("pt-br");
    sample.date = moment(sample.updatedAt).format("LL");
    res.render("report/editAdmin", {
      title: "Edição de laudo",
      sample,
      toxinVector,
      Requisitiondata,
      ...req.session,
    });
  } catch (error) {
    console.warn(error);
    res.redirect("/error");
  }
});

router.post("/show/admin/:id", auth.isAuthenticated, async function (req, res) {
  try {
    const sampleId = req.params.id;
    const { finalized } = req.query;

    const fieldsToUpdate = {
      comment: req.body.sample.comment,
      parecer: req.body.sample.parecer,
    };

    if (finalized) fieldsToUpdate.finalized = finalized;

    for (let i = 0; i < ToxinasFormal.length; i++) {
      let toxin = ToxinasFull[i];
      if (req.body[toxin]) {
        fieldsToUpdate[`${toxin}.resultText`] = req.body[toxin].resultText;
        fieldsToUpdate[`${toxin}.resultChart`] = req.body[toxin].resultChart;

        /**
         * Lembando que isso \/ é nessário porque esse campo somente exite se tiver marcado,
         * caso não esteja marcado ele não é rertonado no body
         */
        if (req.body[toxin].checked) fieldsToUpdate[`${toxin}.checked`] = true;
        else fieldsToUpdate[`${toxin}.checked`] = false;
      }
    }
    // console.log(fieldsToUpdate);
    await Sample.updateReportSpecific(sampleId, fieldsToUpdate);
    req.flash("success", "Atualizado com sucesso.");
    res.redirect("/report/show/admin/" + sampleId);

    /**
     * Lógica de envio de emails caso finalizado
     */
    if (fieldsToUpdate.finalized === "Disponivel") {
      const sampleData = await Sample.getRelatedEmails(sampleId);

      // console.log(sampleData);
      const { createdAt, samplenumber, requisitionId } = sampleData;
      const { email, fullname } = requisitionId.user;
      const sampleCode = `${samplenumber}/${createdAt.getFullYear()}`;
      Email.reportEmail(email, fullname, sampleCode);
    }
  } catch (error) {
    console.warn(error);
    res.redirect("/error");
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
    try {
      const amostras = await Sample.getAllReport();
      const especiais = await Sample.getAllSpecialFinalized();
      console.log("🚀 ~ file: report.js ~ line 304 ~ especiais", especiais)

      res.render("report/admreport", {
        title: "Laudos Disponíveis",
        layout: "layoutDashboard.hbs",
        ...req.session,
        laudos: amostras.reverse(),
        laudosEspeciais: especiais.reverse(),
      });
    } catch (error) {
      console.warn(error);
      res.redirect("/error");
    }
  }
);

module.exports = router;
