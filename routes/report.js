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
  Sample.getById(req.params.id).then((sample) => {
    res.render('report/show', { title: 'Show ', sample});
    console.log (sample);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/show/admin/:id', auth.isAuthenticated, function(req, res, next) {
  Sample.getById(req.params.id).then((sample) => {
    res.render('report/editAdmin', { title: 'Show ', sample});
    console.log (sample);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/show/admin/:id', auth.isAuthenticated, function(req, res, next) {
  var concentrations = req.body;
  var id = req.params.id;
  Sample.updateAflaConcentration(id, concentrations.aflatoxinaConc).then((result1) =>{
    Sample.updateDeoxinivalenolConcentration(id, concentrations.deoxConc).then((result2) =>{
        Sample.updateFumonisinaConcentration(id, concentrations.fumoConc).then((result3) =>{
            Sample.updateOcraConcentration(id, concentrations.ocratoxConc).then((result4) =>{
              Sample.updateT2Concentration(id, concentrations.T2Conc).then((result4) =>{
                Sample.updateZeaConcentration(id, concentrations.ZearalenonaConc).then((result4) =>{
                  req.flash('success', 'Atualizado com sucesso.');
                  res.redirect('/report/show/admin/' + id);
                }).catch(err =>{
                  req.flash('danger', 'Problem ao atualizar');
                  res.redirect('/report/show/admin/' + id);
                });
              }).catch(err =>{
                req.flash('danger', 'Problem ao atualizar');
                res.redirect('/report/show/admin/' + id);
              });
            }).catch(err =>{
              req.flash('danger', 'Problem ao atualizar');
              res.redirect('/report/show/admin/' + id);
            });
          }).catch(err =>{
            req.flash('danger', 'Problem ao atualizar');
            res.redirect('/report/show/admin/' + id);
          });
        }).catch(err =>{
          req.flash('danger', 'Problem ao atualizar');
          res.redirect('/report/show/admin/' + id);
        });
      }).catch(err =>{
        req.flash('danger', 'Problem ao atualizar');
        res.redirect('/report/show/admin/' + id);
      });
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

router.get('/admreport', auth.isAuthenticated, function(req, res, next) {
  var laudos = new Array;
  Sample.getAll().then((amostras) => {
    for (var i = 0; i < amostras.length; i++) {
      if (amostras[i].report == true) {
        laudos[i] = amostras[i];
      } else {
        console.log("nadinha");
      }
    }
  res.render('report/admreport', {title: 'Laudos Disponíveis', layout: 'layoutDashboard.hbs',...req.session, laudos });
  });
});



module.exports = router;
