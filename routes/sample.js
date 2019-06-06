var express = require('express');
var router = express.Router();
var mongoose = require('mongodb');
const Sample = require('../models/sample');

/* GET home page. */
router.get('/', function(req, res, next) {
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

router.post('/edit/:samplenumber',  function(req, res, next) {
  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    if (sample.status == "Nova" || sample.status == "A corrigir" ) {
      sample = {
        status: "Em análise"
      }
    } else {
      if (sample.status == "Em análise") {
        sample = {
          status: "A corrigir"
        }
      }
    }
    Sample.update(sample._id, sample).then(() => {
      req.flash('success', 'Amostra editada com sucesso.');
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
   }).catch((error) => {
     console.log(error);
     res.redirect('/error');
   });
});

router.get('/edit/:id', (req, res) => {
  Sample.getById(req.params.id).then((sample) => {
    console.log(sample);
    res.render('samples/edit', { title: 'Editar amostra', layout: 'layoutDashboard.hbs', sample});
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.put('/edit/:id', (req, res) => {
  const { sampleX } = req.body;
  console.log(sampleX);
  Sample.update(req.params.id, sampleX).then(() => {
    req.flash('success', 'Amostra alterada');
    res.redirect('/sample/edit/'+req.params.id);
  }).catch((error) => {
    console.log("AMIGO ESTOU AQUI");
    console.log(error);
    res.redirect('/error');
  });
});


module.exports = router;
