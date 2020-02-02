
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

  Sample.getAll().then((amostras) => {
    Kit.getAll().then((kit) => {
      var today = new Date();
      var hours = today.getHours();
      var minutes = today.getMinutes();
      var scnds = today.getSeconds();

      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      result = [];

      result[0] = {
        name: "AFLA",
        samples: []
      }
      result[1] = {
        name: "DON",
        samples: []
      }
      result[2] = {
        name: "OTA",
        samples: []
      }
      result[3] = {
        name: "T2",
        samples: []
      }
      result[4] = {
        name: "ZEA",
        samples: []
      }
      result[5] = {
        name: "FBS",
        samples: []
      }

      function addSample(index, element, toxina) {

        if (toxina.active && toxina.mapReference != 'Sem mapa') {
          var changedworkmap = result[index].samples.length > 0 && result[index].samples[result[index].samples.length - 1].mapReference != toxina.mapReference;

          result[index].samples.push({
            changedworkmap: changedworkmap,
            _id: element._id,
            samplenumber: element.samplenumber,
            mapReference: element.mapReference
          });
        }
      }

      amostras.forEach(element => {
        addSample(0, element, element.aflatoxina);
        addSample(1, element, element.deoxinivalenol);
        addSample(2, element, element.ocratoxina);
        addSample(3, element, element.t2toxina);
        addSample(4, element, element.zearalenona);
        addSample(5, element, element.fumonisina);
      });

      res.render('allworkmaps', { result, amostras, dd, mm, yyyy, today, ...req.session });

    }).catch((error) => {
      console.log(error);
    });
  }).catch((error) => {
    console.log(error);
  });
});

router.post('/', function (req, res, next) {

  Kit.getActiveAfla().then(obj => updateKit(obj)).catch((error) => { console.log(error); });
  Kit.getActiveT2().then(obj => updateKit(obj)).catch((error) => { console.log(error); });
  Kit.getActiveZea().then(obj => updateKit(obj)).catch((error) => { console.log(error); });
  Kit.getActiveFum().then(obj => updateKit(obj)).catch((error) => { console.log(error); });
  Kit.getActiveOcra().then(obj => updateKit(obj)).catch((error) => { console.log(error); });
  Kit.getActiveDeox().then(obj => updateKit(obj)).catch((error) => { console.log(error); });

  function updateKit(ToxinaArray) {
    if (ToxinaArray.length != 0) {

      var toxinaKit = ToxinaArray[0];
      var new_last;
      var last_filled = 0;
      var counter = 0;


      for (let i = toxinaKit.toxinaStart; i < toxinaKit.mapArray.length; i++) {
        Workmap.getOneMap(toxinaKit.mapArray[i]).then((workmap) => {
          counter++;
          if (workmap.samplesArray.length > 0) {
            new_last = workmap.mapID;
            new_last = new_last.replace("_workmap", "");
            new_last = Number(new_last);

            if (new_last > last_filled) {
              last_filled = new_last;
            }


          }
          if (counter == toxinaKit.mapArray.length - 1) {
            toxinaKit.amount = toxinaKit.stripLength - last_filled;
            toxinaKit.toxinaStart = last_filled;
            Kit.update(toxinaKit._id, toxinaKit).catch((err) => {
              console.log(err);
            });
          }

        });
      }
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
