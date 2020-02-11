const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const User = require('../models/user');
const Requisition = require('../models/requisition');
const Sample = require('../models/sample');
const Kitstock = require('../models/kitstock');



router.get('/new', auth.isAuthenticated, function (req, res) {
  Kitstock.getAll().then((kitstock) => {
    console.log(kitstock);
    res.render('requisition/newrequisition', { title: 'Requisition', layout: 'layoutDashboard.hbs', ...req.session });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });

});


router.post('/new', auth.isAuthenticated, function (req, res) {
  const { requisition } = req.body;
  requisition.user = req.session.user;

  //CORREÇÃO PROVISÓRIA DO CAMPO DESTINATION
  if (Array.isArray(requisition.destination))
    requisition.destination = requisition.destination.toString();

  if (req.body.producerAddress == 0) {
    console.log("MINI BOIIIII");
    const address = req.session.user.address;
    console.log(req.session.user.address);
    requisition.address = address;
  }
  console.log(requisition);
  Requisition.create(requisition).then((reqid) => {
    var i;
    const samplesV = [];
    var size;

    if (Array.isArray(req.body.requisition.sampleVector)) {
      req.body.requisition.sampleVector.forEach(function (sample) {//monta o vetor de amostras
        samplesV.push(sample);
      });
      size = samplesV.length;
    }
    else {
      size = 1;
    }

    let sampleObjects = [];
    for (i = 0; i < size; i++) {
      const sample = {
        name: samplesV[i],
        samplenumber: -1,
        responsible: req.body.responsible,
        requisitionId: NaN,
        aflatoxina: {
          active: false,
        },
        ocratoxina: {
          active: false,
        },
        deoxinivalenol: {
          active: false,
        },
        fumonisina: {
          active: false,
        },
        t2toxina: {
          active: false,
        },
        zearalenona: {
          active: false,
        }
      }

      if (req.body.requisition.mycotoxin.includes("Aflatoxinas")) {
        sample.aflatoxina.active = true;
      }
      if (req.body.requisition.mycotoxin.includes("Ocratoxina A")) {
        sample.ocratoxina.active = true;
      }

      if (req.body.requisition.mycotoxin.includes("Deoxinivalenol*")) {
        sample.deoxinivalenol.active = true;
      }


      if (req.body.requisition.mycotoxin.includes("T-2 toxina")) {
        sample.t2toxina.active = true;
      }

      if (req.body.requisition.mycotoxin.includes("Fumonisina")) {
        sample.fumonisina.active = true;
      }

      if (req.body.requisition.mycotoxin.includes("Zearalenona")) {
        sample.zearalenona.active = true;
      }


      sample.requisitionId = reqid;
      sampleObjects.push(sample);
    }

    Sample.createMany(sampleObjects).then((sids) => {
      for (let index = 0; index < sids.length; index++) {
        const sid = sids[index]._id;

        //Isso aq dá para otimizar (acho)
        Requisition.addSample(reqid, sid).catch((error) => {
          console.log(error);
          res.redirect('/error');
        });
      }
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });


    console.log(`New requisition with id: ${reqid}`);
    req.flash('success', 'Nova requisição enviada');
    res.redirect('/user');
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');//catch do create
  });
});

router.get('/', auth.isAuthenticated, function (req, res, next) {
  Requisition.getAll().then((requisitions) => {
    console.log(requisitions);
    res.render('requisition/index', { title: 'Requisições Disponíveis', layout: 'layoutDashboard.hbs', ...req.session, requisitions });
  });
});

router.get('/show/:id', auth.isAuthenticated, function (req, res, next) {
  Requisition.getById(req.params.id).then((requisitions) => {
    //console.log(kit);
    res.render('requisition/show', { title: 'Show ', layout: 'layoutDashboard.hbs', requisitions });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/edit/:id', auth.isAuthenticated, function (req, res, next) {
  Requisition.getById(req.params.id).then((requisitions) => {
    console.log(requisitions);
    res.render('requisition/edit', { title: 'Edit Requisition', layout: 'layoutDashboard.hbs', requisitions });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.put('/:id', auth.isAuthenticated, function (req, res, next) {
  const { requisitions } = req.body;
  Requisition.update(req.params.id, requisitions).then(() => {
    req.flash('success', 'Requisição alterada com sucesso.');
    res.redirect(`/requisition/show/${req.params.id}`)
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});


module.exports = router;
