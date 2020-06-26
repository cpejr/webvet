
var express = require('express');
var firebase = require('firebase');
var router = express.Router();
const auth = require('./middleware/auth');
const User = require('../models/user');
const Requisition = require('../models/requisition');
const Kit = require('../models/kit');
const Email = require('../models/email');
const Workmap = require('../models/Workmap');
const Sample = require('../models/sample');

router.get('/', (req, res) => {
  var names = ["AFLA", "DON", "FBS", "OTA", "T2", "ZEA"];


  res.render('allcalibrators', { names, ...req.session, layout:"layoutFinalization.hbs" });
});

router.post('/', auth.isAuthenticated, function (req, res) {

  Kit.getAllActive().then(async (activekits) => {
    updateKitsCalibrators(activekits).then(() => {
      res.redirect("/calibrationcurves");
    }).catch((error) => {
      console.log(error);
    });
  }).catch((error) => {
    console.log(error);
  });

  function updateKitsCalibrators(kits) {
    return new Promise((resolve, reject) => {
      let promises = [];
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

        let promise = Kit.update(Current_kit._id, Current_kit).catch((err) => {
          console.log(err);
        });

        promises.push(promise);
      }

      Promise.all(promises).then(() => {
        resolve();
      });
    });
  }
});


module.exports = router;
