var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/show', function(req, res, next) {
  res.render('show', { title: 'Show Stock', layout: 'layoutDashboard.hbs' });
});

module.exports = router;
