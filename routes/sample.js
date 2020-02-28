const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Sample = require('../models/sample');
const Kit = require('../models/kit');
const Workmap = require('../models/Workmap');


/* GET home page. */

router.get('/', auth.isAuthenticated, function (req, res, next) {
  res.render('test', { title: 'Usuários', layout: 'layoutDashboard.hbs', ...req.session });

});

router.post('/create', (req, res) => {
  const { sample } = req.body;
  console.log("NA ROTA SAMPLE!");
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

router.post('/updatestatus/:status/:mycotoxin/:samplenumber', function (req, res, next) {

  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    const sampleedit = sample;
    const status = req.params.status;
    const toxina = req.params.mycotoxin;


    if (sample[toxina].status === "Mapa de Trabalho") {
      const workmapId = sample[toxina].workmapId;
      sampleedit[toxina].workmapId = null;

      Workmap.removeSample(workmapId, sample._id);
    }



    switch (status) {
      case "totest":
        if (sampleedit[toxina].status == "Aguardando pagamento") {
          sampleedit[toxina].status = "Nova";
        } else {
          sampleedit[toxina].status = "A corrigir";
        }
        break;

      case "testing":
        sampleedit[toxina].status = "Em análise";
        break;

      case "ownering":
        sampleedit[toxina].status = "Aguardando pagamento";
        break;

      case "waiting":
        sampleedit[toxina].status = "Aguardando amostra";
        break;
    }




    Sample.update(sampleedit._id, sampleedit).then((response) => {
      res.send(response)
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });

  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/setActiveKit/:toxinafull/:kitActiveID', function (req, res, next) {
  //Set active to inactive
  let sigla = ToxinasSigla[ToxinasFull.indexOf(req.params.toxinafull)]
  //Correção provisória do problema com a sigla
  if (sigla === "FBS")
    sigla = "FUMO"

  Kit.getActiveID(sigla).then((kit) => {
    if (kit)
      Kit.setActiveStatus(kit._id, false);
  }).then(() => {
    //Update new one
    Kit.setActiveStatus(req.params.kitActiveID, true).then((response) => {
      res.send(response);
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/scndTesting/edit/:mycotoxin/:samplenumber', function (req, res, next) {//this function is for the second kanban

  let samplenumber = req.params.samplenumber;
  let toxina = req.params.mycotoxin;

  Sample.getBySampleNumber(samplenumber).then(sample => {

    if (sample[toxina].status === 'Mapa de Trabalho')
      Workmap.removeSample(sample[toxina].workmapId, sample._id);

    let sampleUpdate = {};
    sampleUpdate[toxina + ".status"] = "Em análise";
    sampleUpdate[toxina + ".workmapId"] = null;

    Sample.updateCustom(sample._id, sampleUpdate);

    res.send();

  }).catch(err => {
    console.log(err);
  });
});

router.post('/mapedit/:mycotoxin/:samplenumber/:mapID', function (req, res, next) {
  let mapID = req.params.mapID;
  let samplenumber = req.params.samplenumber;
  let toxina = req.params.mycotoxin;

  Sample.getBySampleNumber(samplenumber).then(sample => {
    if (sample[toxina].workmapId !== mapID) {
      if (sample[toxina].status === 'Mapa de Trabalho')
        Workmap.removeSample(sample[toxina].workmapId, sample._id);

      Workmap.addSample(mapID, sample._id);

      let sampleUpdate = {};
      sampleUpdate[toxina + ".status"] = "Mapa de Trabalho";
      sampleUpdate[toxina + ".workmapId"] = mapID;

      Sample.updateCustom(sample._id, sampleUpdate);
    }
    res.send();

  }).catch(err => {
    console.log(err);
  });
});

router.get('/edit/:samplenumber', (req, res) => {
  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    res.render('samples/edit', { title: 'Editar amostra', layout: 'layoutDashboard.hbs', sample });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/save', (req, res) => {
  const { sample } = req.body;
  console.log(sample);
  Sample.updateBySampleNumber(sample.samplenumber + "", sample).then(() => {
    req.flash('success', 'Amostra alterada');
    res.redirect('/sample/edit/' + sample.samplenumber);
  }).catch((error) => {
    console.log("AMIGO ESTOU AQUI");
    console.log(error);
    res.redirect('/error');
  });
});


module.exports = router;
