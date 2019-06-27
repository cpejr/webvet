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

router.post('/totest/edit/:mycotoxin/:samplenumber' , function(req, res, next) {

  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    const sampleedit = sample[0];

    console.log(sampleedit);
    if (req.params.mycotoxin == "aflatoxina") {
      if (sampleedit.aflatoxina.status == "Devendo") {
        sampleedit.aflatoxina.status = "Nova";
      } else {
        sampleedit.aflatoxina.status = "A corrigir";
      }
    }

    if (req.params.mycotoxin == "ocratoxina") {
      if (sampleedit.ocratoxina.status == "Devendo") {
        sampleedit.ocratoxina.status = "Nova";
      } else {
        sampleedit.ocratoxina.status = "A corrigir";
      }
    }

    if (req.params.mycotoxin == "deoxinivalenol") {
      if (sampleedit.deoxinivalenol.status == "Devendo") {
        sampleedit.deoxinivalenol.status = "Nova";
      } else {
        sampleedit.deoxinivalenol.status = "A corrigir";
      }
    }

    if (req.params.mycotoxin == "t2toxina") {
      if (sampleedit.t2toxina.status == "Devendo") {
        sampleedit.t2toxina.status = "Nova";
      } else {
        sampleedit.t2toxina.status = "A corrigir";
      }
    }

    if (req.params.mycotoxin == "fumonisina") {
      if (sampleedit.fumonisina.status == "Devendo") {
        sampleedit.fumonisina.status = "Nova";
      } else {
        sampleedit.fumonisina.status = "A corrigir";
      }
    }

    if (req.params.mycotoxin == "zearalenona") {
      if (sampleedit.zearalenona.status == "Devendo") {
        sampleedit.zearalenona.status = "Nova";
      } else {
        sampleedit.zearalenona.status = "A corrigir";
      }
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

router.post('/testing/edit/:mycotoxin/:samplenumber',  function(req, res, next) {

  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    const sampleedit = sample[0];
    sampleedit.status = "Em análise";
    console.log(sampleedit);

    if (req.params.mycotoxin == "aflatoxina") {
      sampleedit.aflatoxina.status = "Em análise";
    }

    if (req.params.mycotoxin == "ocratoxina") {
      sampleedit.ocratoxina.status = "Em análise";
    }

    if (req.params.mycotoxin == "deoxinivalenol") {
      sampleedit.deoxinivalenol.status = "Em análise";
    }

    if (req.params.mycotoxin == "t2toxina") {
      sampleedit.t2toxina.status = "Em análise";
    }

    if (req.params.mycotoxin == "fumonisina") {
      sampleedit.fumonisina.status = "Em análise";
    }

    if (req.params.mycotoxin == "zearalenona") {
      sampleedit.zearalenona.status = "Em análise";
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

router.post('/ownering/edit/:mycotoxin/:samplenumber',  function(req, res, next) {

  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    const sampleedit = sample[0];
    sampleedit.status = "Devendo";
    console.log(sampleedit);

    if (req.params.mycotoxin == "aflatoxina") {
      sampleedit.aflatoxina.status = "Devendo";
    }

    if (req.params.mycotoxin == "ocratoxina") {
      sampleedit.ocratoxina.status = "Devendo";
    }

    if (req.params.mycotoxin == "deoxinivalenol") {
      sampleedit.deoxinivalenol.status = "Devendo";
    }

    if (req.params.mycotoxin == "t2toxina") {
      sampleedit.t2toxina.status = "Devendo";
    }

    if (req.params.mycotoxin == "fumonisina") {
      sampleedit.fumonisina.status = "Devendo";
    }

    if (req.params.mycotoxin == "zearalenona") {
      sampleedit.zearalenona.status = "Devendo";
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
