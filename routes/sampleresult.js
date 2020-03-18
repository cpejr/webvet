const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Kit = require('../models/kit');
const Sample = require('../models/sample');
const regression = require('regression');
const Workmap = require('../models/Workmap');

function comparara(logb_bo_amostra, intercept, slope) {
  return Math.pow(10, (logb_bo_amostra - intercept) / slope);
}

router.get('/', async function (req, res, next) {


  function calcular(nomeToxina, siglaToxina) {
    return new Promise(async (resolve, reject) => {
      Kit.getActive(siglaToxina).then((kit) => {
        if (kit) {
          Workmap.getByIdArray(kit.mapArray).then((maps) => {
            for (let j = 0; j < maps.length; j++) {
              let actualMap = maps[j];
              for (let k = 0; k < actualMap.length; k++) {
                samples_id.push(actualMap.sampleArray[k]);
              }
            }
            Sample.getActiveByIdArray(samples_id, nomeToxina).then((samples) => {
              let allcalibrators = kit.calibrators;
              let p_concentration = [];
              let p_absorvance = [];
              let resultado = [];
              let samples_id = []

              for (let i = 0; i < allcalibrators.length; i++) {
                let curCal = "P" + i;
                let actualCalib = allcalibrators.curCal
                p_concentration.push(actualCalib.concentration);
                p_absorvance.push(actualCalib.absorbance);
              }

              let log_concentracao = [Math.log10(p_concentration[1]), Math.log10(p_concentration[2]), Math.log10(p_concentration[3]), Math.log10(p_concentration[4])]; //eixo x
              let b_b0 = [];
              let ln_b_b0 = [];

              for (let m = 0; m < 4; m++) {
                b_b0.push(p_absorvance[m + 1] / p_absorvance[0]);
              }

              for (let n = 0; n < b_b0.length; n++) {
                ln_b_b0[n] = Math.log10(b_b0[n] / (1 - b_b0[n]));
              }

              const result = regression.linear([[log_concentracao[0], ln_b_b0[0]], [log_concentracao[1], ln_b_b0[1]], [log_concentracao[2], ln_b_b0[2]]]);
              const slope = result.equation[0];// slope
              const yIntercept = result.equation[1];// intercept

              let log_b_b0 = [];
              let log_b_b0_2 = [];

              for (let h = 0; h < samples.length; h++) {
                log_b_b0[h] = Math.log10((samples[h][nomeToxina].absorbance / p_absorvance[0]) / (1 - (samples[h][nomeToxina].absorbance / p_absorvance[0])));
                log_b_b0_2[h] = Math.log10((samples[h][nomeToxina].absorbance2 / p_absorvance[0]) / (1 - (samples[h][nomeToxina].absorbance2 / p_absorvance[0])));
              }
              
              for (let i = 0; i < log_b_b0.length; i++) {
                var avg = (samples[i][nomeToxina].absorbance + samples[i][nomeToxina].absorbance2) / 2;
                var avgcompara = (comparara(log_b_b0[i], yIntercept, slope) + comparara(log_b_b0_2[i], yIntercept, slope)) / 2;

                resultado.push({
                  compara: avgcompara,
                  average: avg,
                  number: samples[i].samplenumber,
                  changed_workmap: i != 0 && samples[i - 1][nomeToxina].workmapId != samples[i][nomeToxina].workmapId,
                  _id: samples[i]._id
                });
      
                if (isNaN(resultado[i].compara)) {
                  resultado[i].compara = null;
                };

                Sample.updateResult(resultado[i]._id, nomeToxina, resultado[i].compara);
              };

              resolve(resultado);

            }).catch((err) => {
              reject(err);
            })
          }).catch((err) => {
            reject(err);
          });

        } else {
          resolve(null);
        };

      }).catch((err) => {
        reject(err);
      });
    });
  }

  let promises = [];

  for (let i = 0; i < ToxinasFull.length; i++)
    promises[i] = calcular(ToxinasFull[i], ToxinasSigla[i]);

  let results = await Promise.all(promises);

  //Finalizando a forma de como os dados serão enviados ao front
  var resultados = {}

  for (let i = 0; i < ToxinasSigla.length; i++)
    resultados[i] = { name: ToxinasSigla[i], result: results[i] };

  res.render('sampleresult', { title: 'Curvas de Calibração', resultados, ...req.session });
});


router.post("/", async function (req, res, next) {
  var amostras = new Array;

  for (var i = 0; i < ToxinasSigla.length; i++) {
    if (req.body.sample != undefined) {
      amostras = req.body.sample[ToxinasSigla[i]];

      if (typeof amostras === 'object') {
        var kit = await Kit.getActiveID(ToxinasSigla[i]);
        console.log("kit id");

        console.log(kit);
        if (Array.isArray(amostras._id))
          for (var j = 0; j < amostras._id.length; j++) {
            Sample.finalizeSample(amostras._id[j], ToxinasFull[i], kit._id);
          }
        else
          Sample.finalizeSample(amostras._id, ToxinasFull[i], kit._id);
      }

      console.log("i: " + i);
      console.log("amostras");
      console.log(amostras);
      console.log(typeof amostras);
    }
  }

  res.redirect('../report/admreport');
});

module.exports = router;
