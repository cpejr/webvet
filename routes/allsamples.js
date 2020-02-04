
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
  var names = ["AFLA", "DON", "OTA", "T2", "ZEA", "FBS"];


  res.render('allsamples', { names });
});

router.post('/', function (req, res, next) {

  Kit.getAllActive().then((activekits) => updateKitsCalibrators(activekits)).catch((error) => {
    console.log(error);
  });

  function updateKitsCalibrators(kits) {
    for (let j = 0; j < kits.length; j++) {

      var Current_kit = kits[j];
      sigla = Current_kit.productCode;
      sigla = sigla.replace(" Romer", "");

      //CORREÇÃO PROVISÓRIA DA SIGLA FBS 
      if (sigla == "FUMO")
        sigla = "FBS";


      var new_last;
      var last_filled = 0;

      for (let i = Current_kit.toxinaStart; i < Current_kit.mapArray.length; i++) {
        Workmap.getOneMap(Current_kit.mapArray[i]).then((workmap) => {
          if (workmap.samplesArray.length > 0) {
            new_last = workmap.mapID;
            new_last = new_last.replace("_workmap", "");
            new_last = Number(new_last);

            if (new_last > last_filled) {
              last_filled = new_last;
            }
          }
        });
      }

      Current_kit.amount = Current_kit.stripLength - last_filled;
      Current_kit.toxinaStart = last_filled;
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

  res.redirect("/calibrationcurves");
});


module.exports = router;
