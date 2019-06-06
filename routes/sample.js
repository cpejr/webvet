var express = require('express');
var router = express.Router();
var mongoose = require('mongodb');
const Sample = require('../models/sample');


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
