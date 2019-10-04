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
  Sample.getById(req.params.id).then((samples) => {
    res.render('report/show', { title: 'Show ', samples});
    console.log (samples);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/samples/:id', auth.isAuthenticated, function(req, res, next) {
  var amostras = new Array;
  var teste1 = new Array;
  Requisition.getById(req.params.id).then((requisitions) => {
    amostras = requisitions.samples;
    Sample.getById(amostras).then((tututu) => {
      teste1[0] = tututu;
      console.log ("DEEEEEEEEEEEEEU");
      console.log (teste1[0]);
      res.render('report/samples', { title: 'Amostas', layout: 'layoutDashboard.hbs', teste1});
    })
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});


module.exports = router;
