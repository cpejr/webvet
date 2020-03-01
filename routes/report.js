var express = require('express');
var firebase = require('firebase');
var router = express.Router();
const auth = require('./middleware/auth');
const User = require('../models/user');
const Requisition = require('../models/requisition');
const Kit = require('../models/kit');
const Mycotoxin = require('../models/mycotoxin');
const Email = require('../models/email');
const Workmap = require('../models/Workmap');
const Sample = require('../models/sample');

function arrayContains(needle, arrhaystack) {
  return (arrhaystack.indexOf(needle) > -1);
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

      const ToxinasLower = ['aflatoxina', 'deoxinivalenol', 'fumonisina', 'ocratoxina', 't2toxina', 'zearalenona'];
      const ToxinasFormal = ['Aflatoxinas', 'Deoxinivalenol', 'Fumonisina', 'Ocratoxina A', 'T-2 toxina', 'Zearalenona'];
      const productCode = ['AFLA Romer', 'DON Romer', 'FUMO Romer', 'OTA Romer', 'T2 Romer', 'ZEA Romer'];
      var toxiKit = {};
      var listIds = [];

      for (i = 0; i < ToxinasLower.length; i++) {  //
        console.log(i + " KitId " + ToxinasLower[i]);
        toxiKit = sample[ToxinasLower[i]];
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
              name = ToxinasLower[i];
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
            name = ToxinasLower[h];
            orderedKits.push({ kit, name });
          }
        }

        var Values = {}
        var toxinaData = {
          Sample: sample,
          Values,
        };
        var Name = {};
        var Pair = {};
        for (var k = 0; k < orderedKits.length; k++) {
          if (orderedKits[k].kit !== undefined && orderedKits[k].kit !== null) {
            for (m = 0; m < ToxinasLower.length; m++) {
              if (ToxinasLower[m] === orderedKits[k].name) {
                Pair = orderedKits[k];
                Name = ToxinasFormal[m];
                Values[m] = {
                  Result: sample[ToxinasLower[m]].result,
                  Name,
                  Pair
                };
              }
            }
          } else {
            console.log("Algo deu errado, o kit em orderedKits[k] nao deveria estar desse jeito, vai dar merda");
            Pair.name = orderedKits[k].name;
            Name = ToxinasFormal[k];
            Values.push({
              Result: sample[ToxinasLower[m]].result,
              Name,
              Pair
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

      const ToxinasLower = ['aflatoxina', 'deoxinivalenol', 'fumonisina', 'ocratoxina', 't2toxina', 'zearalenona'];
      const ToxinasFormal = ['Aflatoxinas', 'Deoxinivalenol', 'Fumonisina', 'Ocratoxina A', 'T-2 toxina', 'Zearalenona'];
      const productCode = ['AFLA Romer', 'DON Romer', 'FUMO Romer', 'OTA Romer', 'T2 Romer', 'ZEA Romer'];
      var toxiKit = {};
      var listIds = [];

      for (i = 0; i < ToxinasLower.length; i++) {  //
        console.log(i + " KitId " + ToxinasLower[i]);
        toxiKit = sample[ToxinasLower[i]];
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
              name = ToxinasLower[i];
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
            name = ToxinasLower[h];
            orderedKits.push({ kit, name });
          }
        }

        var Values = {}
        var toxinaData = {
          Sample: sample,
          Values,
        };
        var Name = {};
        var Pair = {};
        for (var k = 0; k < orderedKits.length; k++) {
          if (orderedKits[k].kit !== undefined && orderedKits[k].kit !== null) {
            for (m = 0; m < ToxinasLower.length; m++) {
              if (ToxinasLower[m] === orderedKits[k].name) {
                Pair = orderedKits[k];
                Name = ToxinasFormal[m];
                Values[m] = {
                  Result: sample[ToxinasLower[m]].result,
                  Name,
                  Pair
                };
              }
            }
          } else {
            console.log("Algo deu errado, o kit em orderedKits[k] nao deveria estar desse jeito, vai dar merda");
            Pair.name = orderedKits[k].name;
            Name = ToxinasFormal[k];
            Values.push({
              Result: sample[ToxinasLower[m]].result,
              Name,
              Pair
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
  var concentrations = req.body;
  var id = req.params.id;
  var info = {
    description: req.body.sample.description,
    parecer: req.body.sample.parecer
  }
  // var description = req.body.sample.description;
  try {
    await Sample.updateDescription(id, info);
    req.flash('success', 'Atualizado com sucesso.');
    res.redirect('/report/show/admin/' + id);
  }
  catch (err) {
    req.flash('danger', 'Problema ao atualizar');
    res.redirect('/report/show/admin/' + id);
  }
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

  router.get('/finalize/:id', auth.isAuthenticated, function(req, res, next) {
    let id = req.params.id;
    const command = true;
    Sample.finalizeReportById(id, command).then((params) =>{
      res.redirect('../admreport');
    });
  });

  router.get('/unfinalize/:id', auth.isAuthenticated, function(req, res, next) {
    let id = req.params.id;
    const command = false;
    Sample.finalizeReportById(id, command).then((params) =>{
      res.redirect('../admreport');
    });
  });
});

module.exports = router;