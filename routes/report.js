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
    var toxiKit = {};
    var listIds = [];
    var validIds = [];
    for (i = 0; i < ToxinasFull.length; i++) {
      console.log(i + " KitId " + ToxinasFull[i]);
      toxiKit = sample[ToxinasFull[i]];
      console.log(toxiKit);
      if (toxiKit.kitId !== null) {
        listIds.push(toxiKit.kitId);
        validIds.push(true);
      } else {
        listIds.push(null);
        validIds.push(false);
        console.log("O KitId da toxina " + ToxinasFull[i] + "e nulo.");
      }
    }

    Kit.getValuesFromMany(listIds, validIds).then((valueList) => {
      res.render('report/editAdmin', { title: 'Show ', sample, valueList });
    });


    /* if (toxiKit.kitId !== null) {
      console.log("Id do kit não é null");
      let kitEncontrado = new Promise((resolve, reject) => {
        Kit.getById(toxiKit.kitId).then((kit) => {
          console.log("Foi encontrado um kit em " + ToxinasFull[i]);
          console.log("Kit encontrado: " + kit);
          resolve(kit);
        }).catch((err) => {
          reject(err);
        })
      });
      kitEncontrado.then((kit) => {
        if (kit !== null) {
          valores.push({ loq: kit.Loq, lod: kit.Lod });
        } else {
          console.log("O kit encontrado em " + ToxinasFull[i] + " e nulo.");
          valores.push({ loq: null, lod: null });
        }
      });
    } else {
      console.log("O KitId do ");
      valores.push({ loq: null, lod: null });
    }*/

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
  Sample.getAll().then((amostras) => {
    for (var i = 0; i < amostras.length; i++) {
      if (amostras[i].report == true) {
        laudos[i] = amostras[i];
      } else {
        console.log("nadinha");
      }
    }
    res.render('report/admreport', { title: 'Laudos Disponíveis', layout: 'layoutDashboard.hbs', ...req.session, laudos });
  });
});



module.exports = router;
