const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const auth = require('./middleware/auth');
const User = require('../models/user');

router.get('/new', auth.isAuthenticated, function(req, res, next) {
  res.render('analyst/new', {title: 'Novo analista', layout: 'layoutDashboard.hbs' });

});

router.post('/create', (req, res) => {
  const { user } = req.body;
  user.type = 'Analista';
  user.status = 'Ativo';
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then((userF) => {
    user.uid = userF.user.uid;
    console.log(user);console.log(user);
    console.log(userF);
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

module.exports = router;
