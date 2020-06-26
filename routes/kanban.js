const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');

/* GET home page. */
router.get('/', auth.isAuthenticated, function(req, res) {
  res.render('admin/kanban', { title: 'Kanban' });
});

module.exports = router;
