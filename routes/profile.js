const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const User = require('../models/user');
const Email = require('../models/email');

/* GET home page. */


router.get('/show', auth.isAuthenticated, function(req, res, next) {
  const user = req.session;
  const id = req.session._id;
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
//
// router.put('/edit/:_id', auth.isAuthenticated, function(req, res, next) {
//   const id = req.session._id;
//   const user = req.session;
//     User.getById(id).then((user) => {
//       const useredit = user;
//       User.update(id, useredit).then(() => {
//         res.render('profile/edit', { title: 'Editar perfil', layout: 'layoutDashboard.hbs', ...req.session });
//         console.log("update");
//         console.log(user);
//         req.flash('success', 'Alterações no perfil realizadas');
//       }).catch((error) => {
//         console.log(error);
//         res.redirect('/error');
//       });
//      }).catch((error) => {
//        console.log(error);
//        res.redirect('/error');
//      });
//   });
//


module.exports = router;
