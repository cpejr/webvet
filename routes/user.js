const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Requisition = require('../models/requisition');
const User = require('../models/user');

router.get('/', auth.isAuthenticated, (req, res, next) => {
  const currentUser = firebase.auth().currentUser.uid;
  User.getOneByQuery({uid: currentUser}).then((user) =>{
    Requisition.getAllInProgressById(user._id).then((requisitions) => {
      var data = [];
      for (let i = 0; i < requisitions.length; i++) {
        const element = requisitions[i];
        data[i] = {
          number: element.requisitionnumber,
          year: element.createdAt.getFullYear(),
        };
      }
      res.render('user', { title: 'Cliente', layout: 'layoutDashboard.hbs', data, ...req.session });
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

module.exports = router;
