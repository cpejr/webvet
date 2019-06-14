const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Sample = require('../models/sample');

/* GET home page. */

router.get('/',  auth.isAuthenticated, function(req, res, next) {
  res.render('test', { title: 'Usuários', layout: 'layoutDashboard.hbs', ...req.session });

});

router.post('/create', (req, res) => {
  const { sample } = req.body;
  Sample.getMaxSampleNumber().then((maxSample) => {
    sample = {
      samplenumber: maxSample[0].samplenumber + 1
    }

    Sample.create(sample).then(() => {
      req.flash('success', 'Cadastrado com sucesso.');
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/totest/edit/:samplenumber',  function(req, res, next) {

  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    const sampleedit = sample[0];

    console.log(sampleedit);
    if (sampleedit.status == "Devendo") {
      sampleedit.status = "Nova";
    } else {
      sampleedit.status = "A corrigir";
    }

    Sample.update(sampleedit._id, sampleedit).then(() => {
      res.render('admin/queue', { title: 'Queue', layout: 'layoutDashboard.hbs'});
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
   }).catch((error) => {
     console.log(error);
     res.redirect('/error');
   });
});

router.post('/testing/edit/:samplenumber',  function(req, res, next) {

  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    const sampleedit = sample[0];
    sampleedit.status = "Em análise";
    console.log(sampleedit);

    Sample.update(sampleedit._id, sampleedit).then(() => {
      res.render('admin/queue', { title: 'Queue', layout: 'layoutDashboard.hbs'});
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
   }).catch((error) => {
     console.log(error);
     res.redirect('/error');
   });
});

router.post('/ownering/edit/:samplenumber',  function(req, res, next) {

  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    const sampleedit = sample[0];
    sampleedit.status = "Devendo";
    console.log(sampleedit);

    Sample.update(sampleedit._id, sampleedit).then(() => {
      res.render('admin/queue', { title: 'Queue', layout: 'layoutDashboard.hbs'});
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
   }).catch((error) => {
     console.log(error);
     res.redirect('/error');
   });
});

router.get('/edit/:samplenumber', (req, res) => {
  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    const sampleshow = sample[0];
    console.log(sampleshow);
    res.render('samples/edit', { title: 'Editar amostra', layout: 'layoutDashboard.hbs', sampleshow});
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.put('/edit/:samplenumber', (req, res) => {
  const { sampleX } = req.body;
  console.log(sampleX);
  Sample.update(req.params.samplenumber, sampleX).then(() => {
    req.flash('success', 'Amostra alterada');
    res.redirect('/sample/edit/'+req.params.samplenumber);
  }).catch((error) => {
    console.log("AMIGO ESTOU AQUI");
    console.log(error);
    res.redirect('/error');
  });
});


module.exports = router;
