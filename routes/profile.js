const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('../middlewares/auth');
const User = require('../models/user');
const Email = require('../models/email');

/* GET home page. */

//Rota GET da página show - Usa o GetById para mostrar as informações do usuário logado
router.get('/show', auth.isAuthenticated, function(req, res) {
  const id = req.session.user._id;
  User.getById(id).then((user) => {
    res.render('profile/show', { title: 'Perfil', layout: 'layoutDashboard.hbs', user});

  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });

});

//Rota GET da página edit - Usa o GetById para mostrar as informações do usuário logado
router.get('/edit/:id', auth.isAuthenticated, function(req, res) {
  User.getById(req.params.id).then((user) => {
    res.render('profile/edit', { title: 'Editar perfil', layout: 'layoutDashboard.hbs', user});
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

//Rota PUT da página edit - rota que atualiza os dados do usuário
router.put('/edit/:id', auth.isAuthenticated, function(req, res) {
  const id = req.params.id;
  const { user } = req.body;
      User.update(id, user).then(() => {
        //A função getById é colocada depois, pois ela pega o usuário atualizado como parâmetro
        User.getById(id).then((userF) => {
          //O req.session.user tem que ser atualizado para as novas informações, caso contrario as alterações so seriam atualizadas quando o usuário iniciasse outra sessão
          req.session.user = userF;
          req.flash('success', 'Alterações no perfil realizadas');
          res.redirect('/profile/show');
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
