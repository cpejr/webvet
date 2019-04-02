const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/queue', function(req, res, next) {
  res.render('queue', {title:'queue'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
});

router.get('/user', function(req, res, next) {
  res.render('user', {title:'User'});
});

module.exports = router;
