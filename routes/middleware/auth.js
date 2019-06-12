var express = require('express');
var firebase = require('firebase');
var router = express.Router();

module.exports = {
  isAuthenticated: (req, res, next) => {
    const user = firebase.auth().currentUser;
    if(user!== null){
      next();
    }
    else {
      res.redirect('/login');
    }
  },
  isProducer: (req, res, next) => {
    const type = req.session.user;
    if(type === 'Produtor'){
      next();
    }
    else {
      res.redirect('/user');
    }
  },
  isManager: (req, res, next) => {
    const type = req.session.user;
    if(type === 'Gerencia'){
      next();
    }
    else {
      res.redirect('/user');
    }
  },
  isConvenio: (req, res, next) => {
    const type = req.session.user;
    if(type === 'Convenio'){
      next();
    }
    else {
      res.redirect('/user');
    }
  },
  isAnalyst: (req, res, next) => {
    const type = req.session.user;
    if(type === 'Analista'){
      next();
    }
    else {
      res.redirect('/user');
    }
  },
  isAdmin: (req, res, next) => {
    const type = req.session.user;
    if(type === 'Admin'){
      next();
    }
    else {
      res.redirect('/user');
    }
  },
}
