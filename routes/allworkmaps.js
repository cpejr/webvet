
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

const ToxinasSigla = ['AFLA', 'DON', 'OTA', 'T2', 'ZEA', 'FBS'];
const ToxinasFull = ['aflatoxina', 'deoxinivalenol', 'ocratoxina', 't2toxina', 'zearalenona', 'fumonisina'];

router.get('/', (req, res) => {

  Sample.getAllActive().then((amostras) => {
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

      if (element[toxinaFull].active && element[toxinaFull].mapReference != 'Sem mapa') {
        //                     se não é o primeiro elemento        compara o mapReference com a ultima amostra da lista
        var changedworkmap = result[index].samples.length > 0 && result[index].samples[result[index].samples.length - 1].mapReference !== element[toxinaFull].mapReference;
        //changedworkmap serve para soltar os espaços entre os campos
        
        result[index].samples.push({
          changedworkmap: changedworkmap,
          _id: element._id,
          samplenumber: element.samplenumber,
          mapReference: element[toxinaFull].mapReference
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
  const ToxinasSigla = ['AFLA', 'DON', 'OTA', 'T2', 'ZEA', 'FBS'];

  //Dando update em todos os kits ativos.
  Kit.getAllActive().then(obj => updateKits(obj)).catch((error) => { console.log(error); });


  // Kit.getActiveAfla().then(obj => updateKit(obj)).catch((error) => { console.log(error); });
  // Kit.getActiveT2().then(obj => updateKit(obj)).catch((error) => { console.log(error); });
  // Kit.getActiveZea().then(obj => updateKit(obj)).catch((error) => { console.log(error); });
  // Kit.getActiveFum().then(obj => updateKit(obj)).catch((error) => { console.log(error); });
  // Kit.getActiveOcra().then(obj => updateKit(obj)).catch((error) => { console.log(error); });
  // Kit.getActiveDeox().then(obj => updateKit(obj)).catch((error) => { console.log(error); });

  function updateKits(KitArray) {

    for (let h = 0; h < KitArray.length; h++) {

      var Kit = KitArray[h];
      var new_last;
      var last_filled = 0;
      var map_ids = [];

      for (let u = Kit.toxinaStart; u < Kit.mapArray.length; u++) {
        map_ids.push(Kit.mapArray[u]);
      }
      Workmap.getAllMaps(map_ids).then((workmaps) => {
        for (let i = 0; i < workmaps.length; i++) {
          if (workmaps[i].samplesArray.length > 0) {
            new_last = workmaps[i].mapID;
            new_last = new_last.replace("_workmap", "");
            new_last = Number(new_last);

            if (new_last > last_filled) {
              last_filled = new_last;
            }
          }
        }
        Kit.amount = Kit.stripLength - last_filled;
        Kit.toxinaStart = last_filled;
        Kit.update(Kit._id, Kit).catch((err) => {
          console.log(err);
        });
      });
    }
  }


  Sample.getAll().then((sample) => {
    //amostras afla


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

    if (req.body.sample) {
      updateSample('aflatoxina', req.body.sample.AFLA);
      updateSample('deoxinivalenol', req.body.sample.DON);
      updateSample('ocratoxina', req.body.sample.OTA);
      updateSample('t2toxina', req.body.sample.T2);
      updateSample('zearalenona', req.body.sample.ZEA);
      updateSample('fumonisina', req.body.sample.FBS);
    }

    var cont = 0;

    for (var i = 0; i < sample.length; i++) {
      if (cont < sample[i].ocratoxina.contador) {
        cont = sample[i].ocratoxina.contador;
      }
      if (cont < sample[i].deoxinivalenol.contador) {
        cont = sample[i].deoxinivalenol.contador;
      }
      if (cont < sample[i].t2toxina.contador) {
        cont = sample[i].t2toxina.contador;
      }
      if (cont < sample[i].fumonisina.contador) {
        cont = sample[i].fumonisina.contador;
      }
      if (cont < sample[i].zearalenona.contador) {
        cont = sample[i].zearalenona.contador;
      }
      if (cont < sample[i].aflatoxina.contador) {
        cont = sample[i].aflatoxina.contador;
      }
    }

    for (var i = 0; i < sample.length; i++) {

      if (sample[i].ocratoxina.mapReference != 'Sem mapa' && sample[i].ocratoxina.active == true) {
        Sample.updateOcraWorkmap(sample[i]._id, cont + 1).then(() => {
        }).catch((error) => {
          console.log(error);
        });
      }

      if (sample[i].aflatoxina.mapReference != 'Sem mapa' && sample[i].aflatoxina.active == true) {
        Sample.updateAflaWorkmap(sample[i]._id, cont + 1).then(() => {
        }).catch((error) => {
          console.log(error);
        });
      }

      if (sample[i].deoxinivalenol.mapReference != 'Sem mapa' && sample[i].deoxinivalenol.active == true) {
        Sample.updateDeoxWorkmap(sample[i]._id, cont + 1).then(() => {
        }).catch((error) => {
          console.log(error);
        });
      }

      if (sample[i].t2toxina.mapReference != 'Sem mapa' && sample[i].t2toxina.active == true) {
        Sample.updateT2Workmap(sample[i]._id, cont + 1).then(() => {
        }).catch((error) => {
          console.log(error);
        });
      }

      if (sample[i].fumonisina.mapReference != 'Sem mapa' && sample[i].fumonisina.active == true) {
        Sample.updatefumWorkmap(sample[i]._id, cont + 1).then(() => {
        }).catch((error) => {
          console.log(error);
        });
      }

      if (sample[i].zearalenona.mapReference != 'Sem mapa' && sample[i].zearalenona.active == true) {
        Sample.updateZeaWorkmap(sample[i]._id, cont + 1).then(() => {
        }).catch((error) => {
          console.log(error);
        });
      }
    }

    res.redirect('/sampleresult');

  }).catch((error) => {
    console.log(error);
  });


});

module.exports = router;
