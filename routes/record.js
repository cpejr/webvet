const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('../middlewares/auth');
const Requisition = require('../models/requisition');

router.get('/', auth.isAuthenticated, (req, res) => {
  let _id = req.session.user._id;

  Requisition.getAllByUserIdWithUser(_id).then((requisitions) => {
    res.render('record/index', { title: 'Histórico', layout: 'layoutDashboard.hbs', requisitions, ...req.session });

  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });

});

module.exports = router;
