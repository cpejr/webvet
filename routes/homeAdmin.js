var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/homeAdmin', { title: 'Home', layout: 'layoutDashboard.hbs' });
});

module.exports = router;
