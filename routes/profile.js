const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const User = require('../models/user');
const Email = require('../models/email');

/* GET home page. */


router.get('/show', auth.isAuthenticated, function(req, res, next) {
  const id = req.session.user._id;
  User.getById(id).then((user) => {
    console.log(user);
    res.render('profile/show', { title: 'Perfil', layout: 'layoutDashboard.hbs', user});

  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });

});

router.get('/edit/:id', auth.isAuthenticated, function(req, res, next) {
  User.getById(req.params.id).then((user) => {
    console.log(user);
    res.render('profile/edit', { title: 'Editar perfil', layout: 'layoutDashboard.hbs', user});
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.put('/edit/:id', auth.isAuthenticated, function(req, res, next) {
  const id = req.params.id;
  const { user } = req.body;
  console.log("Q");
      User.update(id, user).then(() => {
        User.getById(id).then((userF) => {
          req.session.user = userF;
          console.log("update");
          console.log(user);
          req.flash('success', 'Alterações no perfil realizadas');
          res.redirect('/profile/show');
          // console.log(useredit);
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
