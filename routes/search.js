const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const User = require('../models/user');
const Sample = require('../models/sample');
const Kit = require('../models/kit');
const Requisition = require('../models/requisition');
const Workmap = require('../models/Workmap');

router.get('/producers', auth.isAuthenticated, (req, res) => {
  const names = [];
  const query = { active: true };
  const sort = { name: 1 };
  User.getAll().then((producers) => {
    producers.forEach((producer) => {
      if (producer.type == "Produtor") {
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

router.get('/covenants', auth.isAuthenticated, (req, res) => {
  const names = [];
  const query = { active: true };
  const sort = { name: 1 };
  User.getAll().then((covenants) => {
    covenants.forEach((covenant) => {
      if (covenant.type == "Convenio") {
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

router.get('/managers', auth.isAuthenticated, (req, res) => {
  const names = [];
  const query = { active: true };
  const sort = { name: 1 };
  User.getAll().then((managers) => {
    managers.forEach((manager) => {
      if (manager.type == "Gerencia") {
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

router.get('/samples', auth.isAuthenticated, (req, res) => {
  Sample.getAll().then((samples) => {
    res.send(samples);
    console.log(samples);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/samplesActive', auth.isAuthenticated, (req, res) => {
  Sample.getAllActive().then((samples) => {
    res.send(samples);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/userFromSample/:sampleID', auth.isAuthenticated, (req, res) => {
  Requisition.getBySampleID(req.params.sampleID).then((requisition) => {
    User.getById(requisition.user).then((user) => {
      res.send(user);
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });

  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/userFromRequisiton/:requisitonID', auth.isAuthenticated, (req, res) => {
  Requisition.getById(req.params.requisitonID).then((requisition) => {
    User.getById(requisition.user).then((user) => {
      res.send(user);
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/kits', auth.isAuthenticated, (req, res) => {
  Kit.getAll().then((kits) => {
    res.send(kits);
    console.log(kits);
  }).catch((error) => {
    res.redirect('/error');
  });
});

router.get('/getKit/:kitid', auth.isAuthenticated, (req, res) => {
  Kit.getById(req.params.kitid).then((kit) => {
    res.send(kit);
  }).catch((error) => {
    res.redirect('/error');
  });
});

router.get('/getWorkmap/:workmapid', auth.isAuthenticated, (req, res) => {
  Workmap.getOneMap(req.params.workmapid).then((workmap) => {
    res.send(workmap);
  }).catch((error) => {
    res.redirect('/error');
  });
});

router.get('/getOneSample/:sampleID', auth.isAuthenticated, (req, res) => {
  Sample.getById(req.params.sampleID).then((sample) => {
    res.send(sample);
  }).catch((error) => {
    res.redirect('/error');
  });


});

module.exports = router;
