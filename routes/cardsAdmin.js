var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('cardsAdmin', { title: 'Dashboard do Administrador', layout: 'layoutDashboard.hbs' });
});

module.exports = router;
