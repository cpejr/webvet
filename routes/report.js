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

router.get('/', auth.isAuthenticated, function (req, res, next) {
  Requisition.getAll().then((requisitions) => {
    var user = req.session.user.register;
    var logados = new Array;
    var usuarios = new Array;
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
  Sample.getById(req.params.id).then((sample) => {
    res.render('report/show', { title: 'Show ', sample });
    console.log(sample);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/show/admin/:id', auth.isAuthenticated, function (req, res, next) {
  Sample.getById(req.params.id).then((sample) => { //Função que busca os kits usando o kitId dos samples.
    const ToxinasFull = ['aflatoxina', 'deoxinivalenol', 'fumonisina', 'ocratoxina', 't2toxina', 'zearalenona'];
    const productCode = ['AFLA Romer', 'DON Romer', 'FUMO Romer', 'OCRA Romer', 'T2 Romer', 'ZEA Romer'];
    var toxiKit = {};
    var listIds = [];
    for (i = 0; i < ToxinasFull.length; i++) {
      console.log(i + " KitId " + ToxinasFull[i]);
      toxiKit = sample[ToxinasFull[i]];
      console.log(toxiKit);
      if (toxiKit.kitId !== null) {
        listIds.push(toxiKit.kitId);
      }

    }
    console.log("Lista de Id's:");
    for (i = 0; i < listIds.length; i++) {
      console.log();
    }

    Kit.getById(listIds[0]).then((kit) => {
      console.log("O kit da primeira posicao da list kits e:");
      console.log(kit);
    })

    Kit.getByIdArray(listIds).then((kits) => {
      var orderedKits = [];
      for (i = 0; i < kits.length; i++) {
        console.log("Entrou no primeiro for.");
        for (j = 0; j < productCode.length; j++) {
          console.log("Entrou no segundo for.");
          if (kits[i].productCode === productCode[j]) {
            console.log("kits[i].productCode: " + kits[i].productCode);
            console.log("productCode[j]: " + productCode[j]);
            var obj = {};
            obj[ToxinasFull[j]] = kits[i];
            orderedKits.push(obj);
          }
        }
      }
      var data = {};
      Requisition.getById(sample.requisitionId).then((requisition) => {
        data.toxinas = requisition.mycotoxin
      }).then((tu) => {
        res.render('report/editAdmin', { title: 'Show ', sample, ToxinasFull, orderedKits, data });
      });
      console.log("Resultado Final?")
      console.log(orderedKits);
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/show/admin/:id', auth.isAuthenticated, async function (req, res, next) {
  var concentrations = req.body;
  var id = req.params.id;
  try {
    await Sample.updateAflaConcentration(id, concentrations.aflatoxinaConc);
    await Sample.updateDeoxinivalenolConcentration(id, concentrations.deoxConc);
    await Sample.updateFumonisinaConcentration(id, concentrations.fumoConc);
    await Sample.updateOcraConcentration(id, concentrations.ocratoxConc);
    await Sample.updateT2Concentration(id, concentrations.T2Conc);
    await Sample.updateZeaConcentration(id, concentrations.ZearalenonaConc);
    await Sample.updateDescription(id, concentrations.Description);
    req.flash('success', 'Atualizado com sucesso.');
    res.redirect('/report/show/admin/' + id);
  }
  catch (err) {
    req.flash('danger', 'Problem ao atualizar');
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
      res.render('report/samples', { title: 'Amostas', layout: 'layoutDashboard.hbs', teste1 });
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/admreport', auth.isAuthenticated || is.Admin || is.Analista, function (req, res, next) {
  var laudos = new Array;
  let result = {};

  Sample.getAllReport().then((amostras) => {
    let reqids = [];

    for (var i = 0; i < amostras.length; i++)
      reqids.push(amostras[i].requisitionId);

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
    }).then((params) => {
      res.render('report/admreport', { title: 'Laudos Disponíveis', layout: 'layoutDashboard.hbs', ...req.session, result });
    });
  });
});



module.exports = router;
