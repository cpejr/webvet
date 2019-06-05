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
      req.flash('success', 'Usuário editado com sucesso.');
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
   }).catch((error) => {
     console.log(error);
     res.redirect('/error');
   });
});


module.exports = router;
