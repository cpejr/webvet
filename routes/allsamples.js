
var express = require('express');
var firebase = require('firebase');
var router = express.Router();
const auth = require('./middleware/auth');
const User = require('../models/user');
const Requisition = require('../models/requisition');
const Kit = require('../models/kit');
const Mycotoxin = require('../models/mycotoxin');
const Email = require('../models/email');
const Workmap = require('../models/Workmap');
const Sample = require('../models/sample');

router.get('/', (req, res) => {
  var names = ["AFLA", "DON", "FBS", "OTA", "T2", "ZEA"];


  res.render('allsamples', { names, ...req.session });
});

router.post('/', function (req, res, next) {

  Kit.getAllActive().then((activekits) => updateKitsCalibrators(activekits)).catch((error) => {
    console.log(error);
  }).then(() => {
    res.redirect("/calibrationcurves");
  });

  function updateKitsCalibrators(kits) {
    for (let j = 0; j < kits.length; j++) {

      var Current_kit = kits[j];
      let sigla = Current_kit.productCode;
      sigla = sigla.replace(" Romer", "");

      //CORREÇÃO PROVISÓRIA DA SIGLA FBS 
      if (sigla === "FUMO")
        sigla = "FBS";

      Current_kit.calibrators.P1.absorbance = parseFloat(req.body[sigla + "Calibrator"].P1);
      Current_kit.calibrators.P2.absorbance = parseFloat(req.body[sigla + "Calibrator"].P2);
      Current_kit.calibrators.P3.absorbance = parseFloat(req.body[sigla + "Calibrator"].P3);
      Current_kit.calibrators.P4.absorbance = parseFloat(req.body[sigla + "Calibrator"].P4);
      Current_kit.calibrators.P5.absorbance = parseFloat(req.body[sigla + "Calibrator"].P5);
      Kit.update(Current_kit._id, Current_kit).catch((err) => {
        console.log(err);
      });

    }
  }
});


module.exports = router;
