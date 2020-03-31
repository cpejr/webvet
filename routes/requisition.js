const express = require('express');
const router = express.Router();
const auth = require('./middleware/auth');
const Requisition = require('../models/requisition');
const Sample = require('../models/sample');

router.get('/new', auth.isAuthenticated, function (req, res) {
    res.render('requisition/newrequisition', { title: 'Requisition', layout: 'layoutDashboard.hbs', ...req.session });
});

router.post('/delete/:id', auth.isAuthenticated, (req, res) => {
  Requisition.delete(req.params.id).then(() => {
    res.redirect('/requisition');
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
  if (typeof requisition.sampleVector === "string"){
    let vetor = [];
    vetor[0] = requisition.sampleVector;
    requisition.sampleVector = vetor;
    console.log("PASSOU POR MIM");
  }
  //------------------------------------------------
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
        responsible: req.body.requisition.responsible,
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

      for (let i = 0; i < ToxinasFormal.length; i++) {
        const formal = ToxinasFormal[i];
        const full = ToxinasFull[i];

        if (req.body.requisition.mycotoxin.includes(formal))
          sample[full].active = true;

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
    requisitions = requisitions.reverse();
    res.render('requisition/index', { title: 'Requisições Disponíveis', layout: 'layoutDashboard.hbs', ...req.session, requisitions });
  });
});

router.get('/show/:id', auth.isAuthenticated, auth.isAdmin, function (req, res, next) {
  Requisition.getById(req.params.id).then((requisitions) => {
    res.render('requisition/show', { title: 'Show ', layout: 'layoutDashboard.hbs', requisitions, ...req.session });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});
router.get('/usershow/:id', auth.isAuthenticated, auth.isProducer, function (req, res, next) {
  Requisition.getById(req.params.id).then((requisitions) => {
    res.render('requisition/usershow', { title: 'Show ', layout: 'layoutDashboard.hbs', requisitions, ...req.session });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});
// if (typeof requisition.sampleVector === "string"){
//   requisition.sampleVector = requisition.sampleVector.split(' ');
//   console.log("PASSOU POR MIM OUTRA VEZ");
// }

router.get('/edit/:id', auth.isAuthenticated, auth.isAdmin, function (req, res, next) {
  Requisition.getById(req.params.id).then((requisition) => {
    Sample.getByIdArray(requisition.samples).then((samples) => {
      var nova = false;
      
      if (requisition.status === "Nova") {
        nova = true;
      }
      res.render('requisition/edit', { title: 'Edit Requisition', layout: 'layoutDashboard.hbs', requisition, nova, ...req.session, samples });
    });


  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/useredit/:id', auth.isAuthenticated, auth.isProducer, function (req, res, next) {
  Requisition.getById(req.params.id).then((requisition) => {
      res.render('requisition/useredit', { title: 'Edit Requisition', layout: 'layoutDashboard.hbs', requisition, ...req.session });
    
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/:id', auth.isAuthenticated, auth.isAdmin, function (req, res, next) {
  var { requisition, sample } = req.body;
  if (req.body.novaCheck === "isChecked") {
    console.log("Detectou que a checkbox esta marcada");
    requisition.status = "Aprovada";
  }
  console.log(sample);
  if (typeof sample.sampletype === "string"){
    let vetor = [];
    vetor[0] = sample.sampletype;
    sample.sampletype = vetor;
  }
  if (typeof sample._id === "string"){
    let vetor = [];
    vetor[0] = sample._id;
    sample._id = vetor;
  }
  if (typeof sample.name === "string"){
    let vetor = [];
    vetor[0] = sample.name;
    sample.name = vetor;
  }
  console.log(sample);
  //-----------------------------------------------------------------------------------
  for (let i = 0; i < sample._id.length; i++) {
    let samples = {
      name: sample.name[i],
      sampletype: sample.sampletype[i],
      approved: true
    };
    Sample.update(sample._id[i], samples).then(() => {
      console.log("Deveria ter dado update");
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
  }
  Requisition.update(req.params.id, requisition).then(() => {
    console.log("Deveria ter dado update");
    req.flash('success', 'Requisição alterada com sucesso.');
    res.redirect(`/requisition/show/${req.params.id}`);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/:id', auth.isAuthenticated, auth.isProducer, function (req, res, next) {
  var requisition = req.body;
  if (req.body.novaCheck === "isChecked") {
    console.log("Detectou que a checkbox esta marcada");
    requisition.status = "Aprovada";
  }
  Requisition.update(req.params.id, requisition).then(() => {
    console.log("Deveria ter dado update");
    req.flash('success', 'Requisição alterada com sucesso.');
    res.redirect(`/requisition/usershow/${req.params.id}`);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});


module.exports = router;
