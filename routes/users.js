var express = require('express');
var firebase = require('firebase');
var router = express.Router();
const User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {

  User.getAll().then((users) => {
    console.log(users);
    res.render('admin/users/index', { title: 'Usuários', layout: 'layoutDashboard.hbs', users, ...req.session });

    return;
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
    return error;
  });

});

router.get('/pending', function(req, res, next) {

  User.getAll().then((users) => {
    console.log(users);
    res.render('admin/users/pending', { title: 'Usuários pendentes', layout: 'layoutDashboard.hbs', users, ...req.session });

    return;
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
    return error;
  });

});


router.post('/edit/:id',  function(req, res, next) {
  const { user } = req.body;

  User.update(req.params.id, user).then(() => {
    req.flash('success', 'Usuário editado com sucesso.');
    res.redirect('/users/show/'+req.params.id);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/show/:id', function(req, res, next) {
  const id = req.session.id;
  User.getById(req.params.id).then((user) => {
    console.log(user);
    res.render('admin/users/show', { title: 'Perfil do usuário', layout: 'layoutDashboard.hbs', user, ...req.session });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
    return error;
  });
});

router.post('/approve/:id',  function(req, res, next) {
  const id = req.session.id;

  const user = {
    status: 'Ativo'
  };

  User.update(id, user).then(() => {
    req.flash('success', 'Usuário ativado com sucesso.');
    res.redirect('/users/pending');
  }).catch((error) => {
    res.redirect('/error');
    return error;
  });


});

router.post('/reject/:id',  function(req, res, next) {

});

module.exports = router;
