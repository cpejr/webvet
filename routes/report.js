var express = require("express");
var router = express.Router();
const auth = require("./middleware/auth");
const Requisition = require("../models/requisition");
const Kit = require("../models/kit");
const Sample = require("../models/sample");
const moment = require("moment");
const Email = require("../models/email");

function arrayContains(needle, arrhaystack) {
  return arrhaystack.indexOf(needle) > -1;
}

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

router.get("/show/:id", auth.isAuthenticated, function (req, res) {
  Sample.getById(req.params.id)
    .then((sample) => {
      //Função que busca os kits usando o kitId dos samples.
      var Requisitiondata;
      Requisition.getById(sample.requisitionId)
        .then((requisition) => {
          Requisitiondata = {
            listToxinas: requisition.mycotoxin,
            toxinas: requisition.mycotoxin.join(", "),
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
        })
        .then(() => {
          const productCode = [
            "AFLA Romer",
            "DON Romer",
            "FUMO Romer",
            "OTA Romer",
            "T2 Romer",
            "ZEA Romer",
          ];
          var toxiKit = {};
          var listIds = [];

          for (i = 0; i < ToxinasFull.length; i++) {
            //
            toxiKit = sample[ToxinasFull[i]];
            if (toxiKit.kitId !== null) {
              listIds.push(toxiKit.kitId);
            }
          }

          Kit.getByIdArray(listIds).then((kits) => {
            var orderedKits = [];
            var kit = {};
            var name = {};
            var listNames = [];

            for (i = 0; i < productCode.length; i++) {
              for (j = 0; j < kits.length; j++) {
                if (kits[j].productCode === productCode[i]) {
                  kit = kits[j];
                  name = ToxinasFull[i];
                  listNames.push(ToxinasFormal[i]);
                  orderedKits.push({ kit, name });
                }
              }
            }

            var workedList = Requisitiondata.listToxinas;
            var aux = Array;
            for (j = 0; j < listNames.length; j++) {
              aux = workedList.filter((e) => e !== listNames[j]);
              workedList = aux;
            }

            for (h = 0; h < ToxinasFormal.length; h++) {
              if (arrayContains(ToxinasFormal[h], workedList)) {
                kit = {
                  Loq: "Aguardando finalização",
                  Lod: "Aguardando finalização",
                };
                name = ToxinasFull[h];
                orderedKits.push({ kit, name });
              }
            }

            var Values = {};
            var toxinaData = {
              Sample: sample,
              Values,
            };
            var Name = {};
            var Obj = {};
            for (var k = 0; k < orderedKits.length; k++) {
              if (
                orderedKits[k].kit !== undefined &&
                orderedKits[k].kit !== null
              ) {
                for (m = 0; m < ToxinasFull.length; m++) {
                  if (ToxinasFull[m] === orderedKits[k].name) {
                    Obj = orderedKits[k];
                    Name = ToxinasFormal[m];
                    if (
                      sample[ToxinasFull[m]].result !== "ND" &&
                      sample[ToxinasFull[m]].result !== "NaN"
                    ) {
                      var roundResult = Number(sample[ToxinasFull[m]].result);
                      roundResult = round(roundResult, 2);
                    } else {
                      roundResult = sample[ToxinasFull[m]].result;
                    }
                    Values[m] = {
                      Result: roundResult,
                      Name,
                      Obj,
                    };
                  }
                }
              } else {
                console.log(
                  "Algo deu errado, o kit em orderedKits[k] nao deveria estar desse jeito, vai dar merda"
                );
                Obj.name = orderedKits[k].name;
                Name = ToxinasFormal[k];
                Values.push({
                  Result: sample[ToxinasFull[m]].result,
                  Name,
                  Obj,
                });
              }
            }
            res.render("report/show", {
              title: "Show ",
              sample,
              toxinaData,
              Requisitiondata,
              ...req.session,
            });
          });
        });
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/error");
    });
});

router.get(
  "/show/admin/:id",
  /* auth.isAuthenticated, */ async function (req, res) {
    try {
      const sample = await Sample.getById(req.params.id); //Função que busca os kits usando o kitId dos samples.
      const requisition = await Requisition.getById(sample.requisitionId);

      let Requisitiondata;

      Requisitiondata = {
        listToxinas: requisition.mycotoxin,
        toxinas: requisition.mycotoxin.join(", "),
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

      const productCode = [
        "AFLA Romer",
        "DON Romer",
        "FUMO Romer",
        "OTA Romer",
        "T2 Romer",
        "ZEA Romer",
      ];
      var toxiKit = {};
      var listIds = [];

      for (i = 0; i < ToxinasFull.length; i++) {
        //
        toxiKit = sample[ToxinasFull[i]];
        if (toxiKit.kitId !== null) {
          listIds.push(toxiKit.kitId);
        }
      }
      const kits = await Kit.getByIdArray(listIds);
      var orderedKits = [];
      var kit = {};
      var name = {};
      var listNames = [];
      var checked = false;

      for (i = 0; i < productCode.length; i++) {
        for (j = 0; j < kits.length; j++) {
          if (kits[j].productCode === productCode[i]) {
            kit = kits[j];
            name = ToxinasFull[i];
            listNames.push(ToxinasFormal[i]);
            checked = false;
            if (sample[ToxinasFull[i]] && sample[ToxinasFull[i]].checked) {
              checked = true;
            }
            orderedKits.push({ kit, name, checked });
          }
        }
      }

      var workedList = Requisitiondata.listToxinas;
      var aux = [];
      for (j = 0; j < listNames.length; j++) {
        aux = workedList.filter((e) => e !== listNames[j]);
        workedList = aux;
      }

      for (h = 0; h < ToxinasFormal.length; h++) {
        if (arrayContains(ToxinasFormal[h], workedList)) {
          kit = {
            Loq: "Aguardando finalização",
            Lod: "Aguardando finalização",
          };
          name = ToxinasFull[h];
          checked = false;
          if (sample[ToxinasFull[h]] && sample[ToxinasFull[h]].checked) {
            checked = true;
          }
          orderedKits.push({ kit, name, checked });
        }
      }

      var Values = {};
      var toxinaData = {
        Sample: sample,
        Values,
      };
      var Name = {};
      var Obj = {}; //kit

      for (var k = 0; k < orderedKits.length; k++) {
        if (orderedKits[k].kit !== undefined && orderedKits[k].kit !== null) {
          for (m = 0; m < ToxinasFull.length; m++) {
            let currentToxin = ToxinasFull[m];
            if (currentToxin === orderedKits[k].name) {
              //Formatar samples

              Obj = orderedKits[k]; //Esse é o objeto traz a informação da toxina, do kit e se a toxina passou ou não.
              let kit = Obj.kit; //Esse objeto traz somente os dados do kit
              Name = ToxinasFormal[m]; //Esse é o nome da toxina atual ()

              let roundResult; //Essa é a variável que receberá o valor final com duas casas decimais (que ficará salvo no mongo como valor resultado)
              let resultChart; //Essa é a variável que vai receber o valor que irá para o gráfico final
              let resultText = sample[currentToxin].resultText; //Essa é a variável que vai receber o texto que vai aparecer em cada toxina (Concentração Detectada)

              // 1º Verificar se retornou um resultado
              if (isNaN(sample[currentToxin].result)) {
                //Não retornou resultado numérico
                resultChart = kit.Lod;
                roundResult = sample[currentToxin].result;
                if (!resultText) {
                  resultText = "ND";
                  Obj.checked = false;
                } //Essa condição é necessária para permitir a edição do campo
              } else {
                //Retornou um resultado numérico
                roundResult = Number(sample[currentToxin].result);
                roundResult = round(roundResult, 2);

                let newResultText;

                if (roundResult < kit.Lod) {
                  //Menor que lod
                  newResultText = "ND";
                  resultChart = kit.Lod;
                } else if (roundResult < kit.Loq) {
                  //Maior que o lod e Menor que loq
                  newResultText = "< LoQ";
                  resultChart = kit.Loq;
                } else if (roundResult > kit.Loq) {
                  //Maior loq
                  newResultText = kit.Loq;
                  resultChart = kit.Loq;
                }

                if (!resultText) { //Essa condição é necessária para permitir a edição do campo
                  if (newResultText !== "ND") Obj.checked = true;
                  else Obj.checked = false;

                  resultText = newResultText;
                } 
              }

              Values[m] = {
                ResultText: resultText,
                ResultChart: resultChart,
                Result: roundResult,
                Name,
                Obj,
              };
            }
          }
        } else {
          console.log(
            "Algo deu errado, o kit em orderedKits[k] nao deveria estar desse jeito, vai dar ruim"
          );
          Obj.name = orderedKits[k].name;
          Name = ToxinasFormal[k];
          Values.push({
            Result: sample[ToxinasFull[m]].result,
            Name,
            Obj,
          });
        }
      }

      if (!sample.description) {
        sample.description = `Na análise de risco para micotoxinas diversos fatores devem ser considerados tais como:\nníveis e tipos de micotoxinas detectadas, status nutricional e imunológico dos animais, sexo, raça,ambiente, entre outros. Apenas para fins de referência, segue anexo com informações a respeito dos limites máximos tolerados em cereais e produtos derivados para alimentação animal.`;
      }

      moment.locale("pt-br");
      sample.date = moment(sample.updatedAt).format("LL");
      console.log(sample.updatedAt);

      res.render("report/editAdmin", {
        title: "Show ",
        sample,
        toxinaData,
        Requisitiondata,
        ...req.session,
      });
    } catch (error) {
      console.log(error);
      res.redirect("/error");
    }
  }
);

router.post(
  "/show/admin/:id",
  /* auth.isAuthenticated, */ async function (req, res) {
    try {
      const sampleId = req.params.id;
      const { finalized } = req.query;

      const fieldsToUpdate = {
        description: req.body.sample.description,
        parecer: req.body.sample.parecer,
      };

      if (typeof finalized != "undefined") fieldsToUpdate.finalized = finalized;

      for (let i = 0; i < ToxinasFormal.length; i++) {
        let toxin = ToxinasFull[i];
        if (req.body[toxin]) {
          fieldsToUpdate[`${toxin}.resultText`] = req.body[toxin].resultText;
          fieldsToUpdate[`${toxin}.resultChart`] = req.body[toxin].resultChart;

          /**
           * Lembando que isso \/ é nessário porque esse campo somente exite se tiver marcado,
           * caso não esteja marcado ele não é rertonado no body
           */
          if (req.body[toxin].checked)
            fieldsToUpdate[`${toxin}.checked`] = true;
          else fieldsToUpdate[`${toxin}.checked`] = false;
        }
      }
      console.log(fieldsToUpdate);
      await Sample.updateReportSpecific(sampleId, fieldsToUpdate);
      req.flash("success", "Atualizado com sucesso.");
      res.redirect("/report/show/admin/" + sampleId);

      /**
       * Lógica de envio de emails caso finalizado
       */
      if (fieldsToUpdate.finalized === true) {
        const sampleData = await Sample.getRelatedEmails(sampleId);

        console.log(sampleData);
        const { createdAt, samplenumber, requisitionId } = sampleData;
        const { email, fullname } = requisitionId.user;
        const sampleCode = `${samplenumber}/${createdAt.getFullYear()}`;
        Email.reportEmail(email, fullname, sampleCode);
      }
    } catch (error) {
      console.log(error);
      res.redirect("/error");
    }
  }
);

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
      console.log(error);
      res.redirect("/error");
    });
});

router.get(
  "/admreport",
  auth.isAuthenticated || auth.isAdmin || auth.isAnalyst,
  async function (req, res) {
    try {
      const result = [];

      const amostras = await Sample.getAllReport();
      console.log(amostras);

      for (var j = 0; j < amostras.length; j++) {
        const amostra = amostras[j];
        result[j] = {
          number: amostra.requisitionId.requisitionnumber,
          year: amostra.requisitionId.createdAt.getFullYear(),
          _id: amostra.requisitionId._id,
        };
      }

      res.render("report/admreport", {
        title: "Laudos Disponíveis",
        layout: "layoutDashboard.hbs",
        ...req.session,
        laudos: amostras.reverse(),
        result: result.reverse(),
      });
    } catch (error) {
      console.warn(error);
      res.redirect("/error");
    }
  }
);

module.exports = router;
