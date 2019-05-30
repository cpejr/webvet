var express = require('express');
var firebase = require('firebase');
var router = express.Router();
const auth = require('./middleware/auth');
const User = require('../models/user');

/* GET home page. */
router.get('/', auth.isAdmin, function(req, res, next) {
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
    //console.log(users);
    res.render('admin/users/pending', { title: 'Usuários pendentes', layout: 'layoutDashboard.hbs', users, ...req.session });

    return;
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
    return error;
  });

});

router.get('/associated', function(req, res, next) {

  User.getAll().then((users) => {
    console.log(users);
    res.render('admin/users/associated', { title: 'Conveniados', layout: 'layoutDashboard.hbs', users, ...req.session });

    return;
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
    return error;
  });

});

router.get('/producers', function(req, res, next) {

  User.getAll().then((users) => {
    console.log(users);
    res.render('admin/users/producers', { title: 'Produdores', layout: 'layoutDashboard.hbs', users, ...req.session });

    return;
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
    return error;
  });

});

router.get('/managers', function(req, res, next) {

  User.getAll().then((users) => {
    console.log(users);
    res.render('admin/users/managers', { title: 'Gerentes', layout: 'layoutDashboard.hbs', users, ...req.session });

    return;
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
    return error;
  });

});

router.get('/managers/:id', function(req, res, next) {

  User.getAssociatedMaganersById(req.params.id).then((users) => {
    console.log(users);
    res.render('admin/users/managers', { title: 'Gerentes Associados', layout: 'layoutDashboard.hbs', users, ...req.session });

    return;
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
    return error;
  });

});


router.get('/producers/:id', function(req, res, next) {

  User.getAssociatedProducersById(req.params.id).then((users) => {
    console.log(users);
    res.render('admin/users/producers', { title: 'Produtores Associados', layout: 'layoutDashboard.hbs', users, ...req.session });

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

router.put('/approve/:id',  function(req, res, next) {
  const user = {
    status: 'Ativo'
  };
  console.log("ESTA NO APROVADO");
  User.update(req.params.id, user).then(() => {
    req.flash('success', 'Usuário ativado com sucesso.');
    res.redirect('/users/pending');
  }).catch((error) => {
    res.redirect('/error');
    return error;
  });


});

router.put('/reject/:id',  function(req, res, next) {
  const user = {
    status: 'Bloqueado'
  };
  console.log("ESTA NO BLOQUEADO");
  User.update(req.params.id, user).then(() => {
    req.flash('success', 'Usuário rejeitado com sucesso.');
    res.redirect('/users/pending');
  }).catch((error) => {
    res.redirect('/error');
    return error;
  });
});

router.put('/blocked', function(req, res, next) {
  const user = {
    status: 'Bloqueado'
  };
  User.update(req.params.id, user).then(() => {
    res.redirect(`/users`)
  })
});

router.get('/addManager',  function(req, res, next) {
  User.getById("5ce8401566fee16478f3f43a").then((manager) => {
    // Adiciona o segundo id ao primeiro
    User.addManager("5ce8401566fee16478f3f43a", "5ce83ed566fee16478f3f435").catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
    res.render('', { title: 'Usuários', layout: 'layoutDashboard.hbs' });
  });
});

module.exports = router;
