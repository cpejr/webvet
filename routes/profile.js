const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const User = require('../models/user');
const Email = require('../models/email');

/* GET home page. */


router.get('/show', auth.isAuthenticated, function(req, res, next) {
  const user = req.body;
  const id = req.params._id;
  User.getById(id).then((user) => {
    res.render('profile/show', { title: 'Perfil', layout: 'layoutDashboard.hbs', user, ...req.session });

  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });

});

router.get('/edit/:_id', auth.isAuthenticated, function(req, res, next) {
  res.render('profile/edit', { title: 'Editar perfil', layout: 'layoutDashboard.hbs', ...req.session });
});

router.post('/edit/:_id', auth.isAuthenticated, function(req, res, next) {
  const id = req.params._id;
  console.log("Q");
    User.getById(id).then((user) => {
      const useredit = req.body;
      console.log(user);
      console.log("edit");
      console.log(useredit);
      User.update(id, user).then(() => {
        console.log("update");
        console.log(user);
        res.render('profile/edit', { title: 'Editar perfil', layout: 'layoutDashboard.hbs', useredit, ...req.session });
        req.flash('success', 'Alterações no perfil realizadas');
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
