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
  Requisition.getById(req.params.id).then((requisitions) => {
    res.render('report/show', { title: 'Show ', requisitions });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/samples', auth.isAuthenticated, function(req, res, next) {
  var amostras = new Array;
  var user = req.session.user.register;
  Requisition.getAll().then((requisitions) => {
    for (var i = 0; i < requisitions.length; i++) {
      console.log(requisitions[i].samples);
      if (requisitions[i].user.register == user) {
        requisitions[i].samples = amostras[i];

      } else {
        console.log("nadinha");
      }
    }
  });
  res.render('report/samples', { title: 'Amostas', layout: 'layoutDashboard.hbs',...req.session, amostras});
  });


module.exports = router;
