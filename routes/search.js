const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Sample = require('../models/sample');

router.get('/producers', (req, res) => {
  const names = [];
  const query = { active: true };
  const sort = { name: 1 };
  User.getAll().then((producers) => {
    producers.forEach((producer) => {
      if(producer.type=="Produtor") {
        names.push(producer.fullname);
      }
    });
    console.log(names);
    res.send(names);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/covenants', (req, res) => {
  const names = [];
  const query = { active: true };
  const sort = { name: 1 };
  User.getAll().then((covenants) => {
    covenants.forEach((covenant) => {
      if(covenant.type=="Convenio") {
        names.push(covenant.fullname);
      }
    });
    console.log(names);
    res.send(names);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/managers', (req, res) => {
  const names = [];
  const query = { active: true };
  const sort = { name: 1 };
  User.getAll().then((managers) => {
    managers.forEach((manager) => {
      if(manager.type=="Gerencia") {
        names.push(manager.fullname);
      }
    });
    console.log(names);
    res.send(names);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/samples', (req, res) => {
  Sample.getAll().then((samples) => {
    res.send(samples);
    console.log(samples);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});


module.exports = router;
