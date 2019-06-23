const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const User = require('../models/user');
const Email = require('../models/email');

/* GET home page. */


router.get('/show', auth.isAuthenticated, function(req, res, next) {
  const id = req.session._id;
  User.getById(id).then((user) => {
    res.render('profile/show', { title: 'Perfil', layout: 'layoutDashboard.hbs', user, ...req.session });

  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });

});

router.get('/edit', auth.isAuthenticated, function(req, res, next) {
  const id = req.session._id;
    User.getById(id).then((user) => {
    res.render('profile/edit', { title: 'Editar perfil', layout: 'layoutDashboard.hbs', user, ...req.session });

  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });

});

router.put('/', auth.isAuthenticated, function(req, res, next) {
  const id = req.session._id;
  const user = req.session;
  User.update(req.params.id,user).then(()=>{
    console.log("update");
    req.flash('success', 'Alterações no perfil realizadas');
    res.redirect(`/show/${req.params.id}`)
  })
});

module.exports = router;
