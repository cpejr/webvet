const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const User = require('../models/user');


router.get('/', auth.isAuthenticated, function(req, res) {
  res.render('analyst/homeAnalyst', {title: 'Home', layout: 'layoutDashboard.hbs' });

});

router.get('/new', auth.isAuthenticated, auth.isAdmin, function(req, res) {
  res.render('analyst/new', {title: 'Novo analista', layout: 'layoutDashboard.hbs' });

});

router.post('/create', auth.isAuthenticated, auth.isAdmin, function(req, res){
  const { user } = req.body;
  user.type = 'Analista';
  user.status = 'Ativo';
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then((userF) => {
    user.uid = userF.user.uid;
    User.create(user).then((id) => {
      console.log(`Created new user with id: ${id}`);
      req.flash('success', 'Cadastrado com sucesso.');
      res.redirect('/analyst/new');
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/show', auth.isAuthenticated, function(req, res) {
  User.getAll().then((users) => {
    res.render('analyst/show', { title: 'Analistas', layout: 'layoutDashboard.hbs', users, ...req.session });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });

});

module.exports = router;
