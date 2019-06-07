var express = require('express');
var firebase = require('firebase');
var router = express.Router();
const auth = require('./middleware/auth');
const User = require('../models/user');
const Requisition = require('../models/requisition');


/* GET home page. */
router.get('/requisition', (req, res) => {
  res.render('requisition', {title:'requisition',layout:'layout'});
});

module.exports = router;
