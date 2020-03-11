var express = require('express');
var firebase = require('firebase');
var router = express.Router();
const auth = require('./middleware/auth');
const User = require('../models/user');
const Requisition = require('../models/requisition');
const Kit = require('../models/kit');
const Email = require('../models/email');
const Workmap = require('../models/Workmap');
const Sample = require('../models/sample');

function arrayContains(needle, arrhaystack) {
  return (arrhaystack.indexOf(needle) > -1);
}

function round(value, decimalPlaces) {
  if (value !== null && value !== undefined)
    return value.toFixed(decimalPlaces);
  else
    return null;
}

router.get('/', auth.isAuthenticated, function (req, res, next) {
  Requisition.getAll().then((requisitions) => {
    var user = req.session.user.register;
    var logados = new Array;
    var countlogados = 0;
    for (var i = 0; i < requisitions.length; i++) {
      if (requisitions[i].user.register == user) {
        logados[countlogados] = requisitions[i];
        countlogados++;
      } else {
        console.log("nadinha");
      }
    }
    res.render('report/index', { title: 'Requisições Disponíveis', layout: 'layoutDashboard.hbs', ...req.session, logados });
  });
});

router.get('/show/:id', auth.isAuthenticated, function (req, res, next) {
  Sample.getById(req.params.id).then((sample) => { //Função que busca os kits usando o kitId dos samples.
    var Requisitiondata;
    Requisition.getById(sample.requisitionId).then((requisition) => {
      Requisitiondata = {
        listToxinas: requisition.mycotoxin,
        toxinas: requisition.mycotoxin.join(', '),
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
    }).then(() => {
      const productCode = ['AFLA Romer', 'DON Romer', 'FUMO Romer', 'OTA Romer', 'T2 Romer', 'ZEA Romer'];
      var toxiKit = {};
      var listIds = [];

      for (i = 0; i < ToxinasFull.length; i++) {  //
        console.log(i + " KitId " + ToxinasFull[i]);
        toxiKit = sample[ToxinasFull[i]];
        console.log(toxiKit);
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
          aux = workedList.filter(e => e !== listNames[j]);
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

        var Values = {}
        var toxinaData = {
          Sample: sample,
          Values,
        };
        var Name = {};
        var Obj = {};
        for (var k = 0; k < orderedKits.length; k++) {
          if (orderedKits[k].kit !== undefined && orderedKits[k].kit !== null) {
            for (m = 0; m < ToxinasFull.length; m++) {
              if (ToxinasFull[m] === orderedKits[k].name) {
                Obj = orderedKits[k];
                Name = ToxinasFormal[m];
                if (sample[ToxinasFull[m]].result !== "ND" && sample[ToxinasFull[m]].result !== "NaN") {
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
            console.log("Algo deu errado, o kit em orderedKits[k] nao deveria estar desse jeito, vai dar merda");
            Obj.name = orderedKits[k].name;
            Name = ToxinasFormal[k];
            Values.push({
              Result: sample[ToxinasFull[m]].result,
              Name,
              Obj,
            });
          }

        }
        res.render('report/show', { title: 'Show ', sample, toxinaData, Requisitiondata, ...req.session });
      });
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/show/admin/:id', /* auth.isAuthenticated, */ function (req, res, next) {
  Sample.getById(req.params.id).then((sample) => { //Função que busca os kits usando o kitId dos samples.
    var Requisitiondata;
    Requisition.getById(sample.requisitionId).then((requisition) => {
      Requisitiondata = {
        listToxinas: requisition.mycotoxin,
        toxinas: requisition.mycotoxin.join(', '),
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
    }).then(() => {
      const productCode = ['AFLA Romer', 'DON Romer', 'FUMO Romer', 'OTA Romer', 'T2 Romer', 'ZEA Romer'];
      var toxiKit = {};
      var listIds = [];

      for (i = 0; i < ToxinasFull.length; i++) {  //
        console.log(i + " KitId " + ToxinasFull[i]);
        toxiKit = sample[ToxinasFull[i]];
        console.log(toxiKit);
        if (toxiKit.kitId !== null) {
          listIds.push(toxiKit.kitId);
        }

      }

      Kit.getByIdArray(listIds).then((kits) => {
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
        var aux = Array;
        for (j = 0; j < listNames.length; j++) {
          aux = workedList.filter(e => e !== listNames[j]);
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

        var Values = {}
        var toxinaData = {
          Sample: sample,
          Values,
        };
        var Name = {};
        var Obj = {};
        for (var k = 0; k < orderedKits.length; k++) {
          if (orderedKits[k].kit !== undefined && orderedKits[k].kit !== null) {
            for (m = 0; m < ToxinasFull.length; m++) {
              if (ToxinasFull[m] === orderedKits[k].name) {
                Obj = orderedKits[k];
                Name = ToxinasFormal[m];
                if (sample[ToxinasFull[m]].result !== "ND" && sample[ToxinasFull[m]].result !== "NaN") {
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
            console.log("Algo deu errado, o kit em orderedKits[k] nao deveria estar desse jeito, vai dar merda");
            Obj.name = orderedKits[k].name;
            Name = ToxinasFormal[k];
            Values.push({
              Result: sample[ToxinasFull[m]].result,
              Name,
              Obj,
            });
          }

        }
        res.render('report/editAdmin', { title: 'Show ', sample, toxinaData, Requisitiondata, ...req.session });
      });
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/show/admin/:id', auth.isAuthenticated, async function (req, res, next) {

  var id = req.params.id;
  var info = {
    description: req.body.sample.description,
    parecer: req.body.sample.parecer,
  };
  for (let i = 0; i < ToxinasFormal.length; i++) {
    if (req.body[ToxinasFull[i]]) {
      info[ToxinasFull[i] + ".result"] = req.body[ToxinasFull[i]].result ? req.body[ToxinasFull[i]].result : "NaN";
      if (req.body[ToxinasFull[i]].checked) {
        info[ToxinasFull[i] + ".checked"] = true;
      } else {
        info[ToxinasFull[i] + ".checked"] = false;
      };
    };
  };

  Sample.updateReportSpecific(id, info).then((report) => {
    console.log(report);
    req.flash('success', 'Atualizado com sucesso.');
    res.redirect('/report/show/admin/' + id);
  }).catch((err) => {
    console.log(err);
    res.redirect('/error');
  });

});

router.get('/samples/:id', auth.isAuthenticated, function (req, res, next) {
  var amostras = new Array;
  var teste1 = new Array;
  Requisition.getById(req.params.id).then((requisitions) => {
    amostras = requisitions.samples;
    Sample.getById(amostras).then((tututu) => {
      for (var i = 0; i < amostras.length; i++) {
        teste1[i] = tututu[i];
        console.log("DEEEEEEEEEEEEEU");
        console.log(teste1[i]);
      }
      res.render('report/samples', { title: 'Amostas', layout: 'layoutDashboard.hbs', teste1, ...req.session });
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/admreport', auth.isAuthenticated || is.Admin || is.Analista, function (req, res, next) {
  var laudos = new Array;
  let result = [];

  Sample.getAllReport().then((amostras) => {
    let reqids = [];
    for (var j = 0; j < amostras.length; j++) {
      if (amostras[j].report) {
        laudos.push(amostras[j]);
      }
    }

    for (var i = 0; i < amostras.length; i++) {
      reqids.push(amostras[i].requisitionId);
    }

    Requisition.getByIdArray(reqids).then((requisitions) => {
      for (let j = 0; j < amostras.length; j++) {
        for (let k = 0; k < requisitions.length; k++) {
          if (JSON.stringify(amostras[j].requisitionId) === JSON.stringify(requisitions[k]._id))//Check if is equal
            result[j] = {
              number: requisitions[k].requisitionnumber,
              year: requisitions[k].createdAt.getFullYear(),
              _id: amostras[j]._id,
            }
        }
      }
      laudos = laudos.reverse();
      result = result.reverse();
    }).then((params) => {
      res.render('report/admreport', { title: 'Laudos Disponíveis', layout: 'layoutDashboard.hbs', ...req.session, laudos, result });
    });
  });

  router.get('/finalize/:id', auth.isAuthenticated, function (req, res, next) {
    let id = req.params.id;
    const command = true;
    Sample.finalizeReportById(id, command).then((params) => {
      res.redirect('../admreport');
    });
  });

  router.get('/unfinalize/:id', auth.isAuthenticated, function (req, res, next) {
    let id = req.params.id;
    const command = false;
    Sample.finalizeReportById(id, command).then((params) => {
      res.redirect('../admreport');
    });
  });
});

module.exports = router;