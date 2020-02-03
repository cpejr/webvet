var express = require('express');
var firebase = require('firebase');
var router = express.Router();
const auth = require('./middleware/auth');
const User = require('../models/user');
const Requisition = require('../models/requisition');
const Kit = require('../models/kit');
const Mycotoxin = require('../models/mycotoxin');
const Email = require('../models/email');
const Workmap=require('../models/Workmap');
const Sample = require('../models/sample');

router.get('/', auth.isAuthenticated, function(req, res, next) {
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
    res.render('report/index', {title: 'Requisições Disponíveis', layout: 'layoutDashboard.hbs',...req.session, logados});
  });
});

router.get('/show/:id', auth.isAuthenticated, function(req, res, next) {
  var date = new Date();
  var yyyy = date.getFullYear();
  Sample.getById(req.params.id).then((sample) => {
    res.render('report/show', { title: 'Show ', sample, yyyy});
    console.log (sample);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/show/admin/:id', auth.isAuthenticated, function(req, res, next) {
  var date = new Date();
  var yyyy = date.getFullYear();
  Sample.getById(req.params.id).then((sample) => {
    res.render('report/editAdmin', { title: 'Show ', sample, yyyy});
    console.log (sample);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/show/admin/:id', auth.isAuthenticated, async function(req, res, next) {
  var concentrations = req.body;
  var id = req.params.id;
  try{
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
  catch(err){
    req.flash('danger', 'Problem ao atualizar');
    res.redirect('/report/show/admin/' + id);
  }
});

router.get('/samples/:id', auth.isAuthenticated, function(req, res, next) {
  var amostras = new Array;
  var teste1 = new Array;
  Requisition.getById(req.params.id).then((requisitions) => {
    amostras = requisitions.samples;
      Sample.getById(amostras).then((tututu) => {
        for (var i = 0; i < amostras.length; i++) {
        teste1[i] = tututu[i];
        console.log ("DEEEEEEEEEEEEEU");
        console.log (teste1[i]);
      }
      res.render('report/samples', { title: 'Amostas', layout: 'layoutDashboard.hbs', teste1});
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/admreport', auth.isAuthenticated||is.Admin||is.Analista,function(req, res, next) {
  var laudos = new Array;
  var date = new Date();
  var yyyy = date.getFullYear();
  Sample.getAll().then((amostras) => {
    for (var i = 0; i < amostras.length; i++) {
      if (amostras[i].report == true) {
        laudos[i] = amostras[i];
      } else {
        console.log("nadinha");
      }
    }
  res.render('report/admreport', {title: 'Laudos Disponíveis', layout: 'layoutDashboard.hbs',...req.session, laudos, yyyy});
  });
});



module.exports = router;
