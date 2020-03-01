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


  function calcular(toxinafull, toxinasigla) {
    return new Promise(async (resolve, reject) => {


      let kit = await Kit.getActive(toxinasigla);
      if (kit !== null) {
        var mapas = [];
        var amostras = [];
        var p_concentration = [];
        var p_absorvance = [];
        var resultado = [];

        //Parte responsável por pegar a concentracao e absorvancia settadas no kit ativo
        p_concentration[0] = kit.calibrators.P1.concentration;
        p_concentration[1] = kit.calibrators.P2.concentration;
        p_concentration[2] = kit.calibrators.P3.concentration;
        p_concentration[3] = kit.calibrators.P4.concentration;
        p_concentration[4] = kit.calibrators.P5.concentration;

        p_absorvance[0] = kit.calibrators.P1.absorbance;
        p_absorvance[1] = kit.calibrators.P2.absorbance;
        p_absorvance[2] = kit.calibrators.P3.absorbance;
        p_absorvance[3] = kit.calibrators.P4.absorbance;
        p_absorvance[4] = kit.calibrators.P5.absorbance;

        //parte responsável por pegar as amostras do kit, logo  através do kit ativo de afla pega na variável mapArray o id dos mapas que estão sendo utilizados naqueles kits
        mapas = await Workmap.getByIdArray(kit.mapArray);

        var samples_id = [];
        //Após ter os ids dos mapas de trabalho que estão sendo utilizados roda um for para percorrer todos os mapas e um for dentro desse para acessar todas as amostras em cada mapa
        for (let j = 0; j < mapas.length; j++)
          for (let i = 0; i < mapas[j].samplesArray.length; i++)
            samples_id.push(mapas[j].samplesArray[i]);

        var log_concentracao = [Math.log10(p_concentration[1]), Math.log10(p_concentration[2]), Math.log10(p_concentration[3]), Math.log10(p_concentration[4])]; //eixo x
        var b_b0 = [];
        var ln_b_b0 = [];

        for (var i = 0; i < 4; i++)
          b_b0[i] = p_absorvance[i + 1] / p_absorvance[0];


        for (var i = 0; i < b_b0.length; i++)
          ln_b_b0[i] = Math.log10(b_b0[i] / (1 - b_b0[i]));

        const result = regression.linear([[log_concentracao[0], ln_b_b0[0]], [log_concentracao[1], ln_b_b0[1]], [log_concentracao[2], ln_b_b0[2]]]);
        const slope = result.equation[0];// slope
        const yIntercept = result.equation[1];// intercept

        var log_b_b0 = new Array;
        var log_b_b0_2 = new Array;

        amostras = await Sample.getActiveByIdArray(samples_id, toxinafull);

        for (let i = 0; i < amostras.length; i++) {
          log_b_b0[i] = Math.log10((amostras[i][toxinafull].absorbance / p_absorvance[0]) / (1 - (amostras[i][toxinafull].absorbance / p_absorvance[0])));
          log_b_b0_2[i] = Math.log10((amostras[i][toxinafull].absorbance2 / p_absorvance[0]) / (1 - (amostras[i][toxinafull].absorbance2 / p_absorvance[0])));
        }

        for (let i = 0; i < log_b_b0.length; i++) {
          var avg = (amostras[i][toxinafull].absorbance + amostras[i][toxinafull].absorbance2) / 2;
          var avgcompara = (comparara(log_b_b0[i], yIntercept, slope) + comparara(log_b_b0_2[i], yIntercept, slope)) / 2;

          resultado[i] = {
            compara: avgcompara,
            average: avg,
            number: amostras[i].samplenumber,
            changed_workmap: i != 0 && amostras[i - 1][toxinafull].workmapId != amostras[i][toxinafull].workmapId,
            _id: amostras[i]._id
          };

          if (isNaN(resultado[i].compara)) {
            resultado[i].compara = null;
          }
          Sample.updateResult(resultado[i]._id, toxinafull, resultado[i].compara);
        }

        resolve(resultado);
      }
      else
        resolve(null);
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
