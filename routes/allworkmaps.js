
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

  Sample.getAllActiveWithWorkmap().then((amostras) => {
    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var scnds = today.getSeconds();

    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    result = [];

    for (let i = 0; i < ToxinasSigla.length; i++) {
      const sigla = ToxinasSigla[i];

      result[i] = {
        name: sigla,
        samples: []
      }
    }

    function addSample(index, element, toxinaFull) {

      if (element[toxinaFull].active && element[toxinaFull].status === 'Mapa de Trabalho') {
        //                     se não é o primeiro elemento        compara o workmapid com a ultima amostra da lista
        var changedworkmap = result[index].samples.length > 0 && result[index].samples[result[index].samples.length - 1].workmapId !== element[toxinaFull].workmapId;
        //changedworkmap serve para soltar os espaços entre os campos

        result[index].samples.push({
          changedworkmap: changedworkmap,
          _id: element._id,
          samplenumber: element.samplenumber,
        });
      }
    }

    for (let i = 0; i < amostras.length; i++)
      for (let j = 0; j < ToxinasFull.length; j++)
        addSample(j, amostras[i], ToxinasFull[j]);

    /*
    Result é um vetor de 6 dimensões 
    e cada posição faz referência a uma toxina diferente   
    */
    res.render('allworkmaps', { result, dd, mm, yyyy, today, ...req.session });
  }).catch((error) => {
    console.log(error);
  });
});

router.post('/', function (req, res, next) {
  //Dando update em todos os kits ativos.
  Kit.getAllActive().then(obj => updateKits(obj)).catch(error => { console.log(error); });

  if (req.body.sample) {
    let count = 0;

    ToxinasFull.forEach((toxina) => {
      count++;
      updateSample(toxina, req.body.sample[ToxinasAll[toxina].Sigla]);

      if (count == ToxinasFull.length)
        res.redirect('/sampleresult');
    });
  }

  function updateKits(KitArray) {
    KitArray.forEach((kit) => {
      var last_filled = kit.toxinaStart;

      Workmap.getByIdArray(kit.mapArray).then((workmaps) => {
        for (let i = kit.toxinaStart; i < workmaps.length; i++)
          if (workmaps[i].samplesArray.length > 0)
            last_filled = i;

        kit.amount = kit.stripLength - (last_filled + 1);
        kit.toxinaStart = last_filled;
        Kit.update(kit._id, kit).catch((err) => {
          console.log(err);
        });
      });
    });
  }

  function updateSample(name, obj) {
    if (typeof obj !== 'undefined') {
      var id_tox = obj._id;
      var abs_tox = obj.absorbance;
      var abs2_tox = obj.absorbance2;

      if (Array.isArray(abs_tox)) {
        for (let i = 0; i < abs_tox.length; i++) {
          Sample.updateAbsorbances(name, id_tox[i], abs_tox[i], abs2_tox[i]).then(() => {
          }).catch((error) => {
            console.log(error);
          });
        }
      } else {
        Sample.updateAbsorbances(name, id_tox, abs_tox, abs2_tox).then(() => {
        }).catch((error) => {
          console.log(error);
        });
      }
    }
  }

});

module.exports = router;
