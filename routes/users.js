var express = require('express');
var router = express.Router();
var mongoose = require('mongodb');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('users', { title: 'Usuários', layout: 'layoutDashboard.hbs' });

});

router.put('/active', function(req, res, next) {
  const user = {
    status: 'Ativo'
  };
  User.update(req.params.id, user).then(() => {
    res.redirect(`/users`)
  })
});


router.put('/blocked', function(req, res, next) {
  const user = {
    status: 'Bloqueado'
  };
  User.update(req.params.id, user).then(() => {
    res.redirect(`/users`)
  })
});

module.exports = router;
