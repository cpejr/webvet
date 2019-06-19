const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');

/* GET home page. */
router.get('/', auth.isAuthenticated, function(req, res, next) {
  res.render('admin/cardsAdmin', { title: 'Dashboard do Administrador', layout: 'layoutDashboard.hbs' });
});

module.exports = router;
