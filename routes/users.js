var express = require('express');
var router = express.Router();
var mongoose = require('mongodb');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('users', { title: 'Usuários', layout: 'layoutDashboard.hbs' });
  
});


module.exports = router;
