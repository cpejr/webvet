const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const mongoose = require('mongodb');
const auth = require('./middleware/auth');

/* GET home page. */
router.get('/',, auth.isAuthenticated, function(req, res, next) {
  res.render('requisition/show', { title: 'Amostras'});
});

module.exports = router;
