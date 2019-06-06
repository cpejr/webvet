var express = require('express');
var router = express.Router();
var mongoose = require('mongodb');
const Requisition = require('../models/requisition');

router.get('/user', function(req, res, next) {
  Requisition.getAll().then((requisitions) => {
    console.log("oi");
    res.render('user', { title: 'Cliente', layout: 'layoutDashboard_user.hbs'});
 }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });

 });

module.exports = router;
