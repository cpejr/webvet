
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

  Kit.getActiveAfla().then((aflaArray) => {
    if (aflaArray.length != 0) {

      var aflaKit = aflaArray[0];
      var new_last;
      var last_filled = 0;
      var counter = 0;


      for (let i = aflaKit.toxinaStart; i < aflaKit.mapArray.length; i++) {
        Workmap.getOneMap(aflaKit.mapArray[i]).then((workmap) => {
          counter++;
          if (workmap.samplesArray.length > 0) {
            new_last = workmap.mapID;
            new_last = new_last.replace("_workmap", "");
            new_last = Number(new_last);

            if (new_last > last_filled) {
              last_filled = new_last;
            }


          }
          if (counter == aflaKit.mapArray.length - 1) {
            aflaKit.amount = aflaKit.stripLength - last_filled;
            aflaKit.toxinaStart = last_filled;
            Kit.update(aflaKit._id, aflaKit).catch((err) => {
              console.log(err);
            });
          }

        });
      }
    }
  }).catch((error) => {
    console.log(error);
  });

  Kit.getActiveDeox().then((deoxArray) => {
    if (deoxArray.length != 0) {
      var deoxKit = deoxArray[0];
      var new_last;
      var last_filled = 0;
      var counter = 0;

      for (let i = deoxKit.toxinaStart; i < deoxKit.mapArray.length; i++) {
        Workmap.getOneMap(deoxKit.mapArray[i]).then((workmap) => {
          counter++;
          if (workmap.samplesArray.length > 0) {
            new_last = workmap.mapID;
            new_last = new_last.replace("_workmap", "");
            new_last = Number(new_last);

            if (new_last > last_filled) {
              last_filled = new_last;
            }


          }
          if (counter == deoxKit.mapArray.length - 1) {

            deoxKit.amount = deoxKit.stripLength - last_filled;
            deoxKit.toxinaStart = last_filled;
            Kit.update(deoxKit._id, deoxKit).catch((err) => {
              console.log(err);
            });
          }
        });
      }
    }
  }).catch((error) => {
    console.log(error);
  });

  Kit.getActiveT2().then((t2Array) => {
    if (t2Array.length != 0) {
      var t2Kit = t2Array[0];
      var new_last;
      var last_filled = 0;
      var counter = 0;

      for (let i = t2Kit.toxinaStart; i < t2Kit.mapArray.length; i++) {
        Workmap.getOneMap(t2Kit.mapArray[i]).then((workmap) => {
          counter++;
          if (workmap.samplesArray.length > 0) {
            new_last = workmap.mapID;
            new_last = new_last.replace("_workmap", "");
            new_last = Number(new_last);

            if (new_last > last_filled) {
              last_filled = new_last;
            }


          }
          if (counter == t2Kit.mapArray.length - 1) {
            t2Kit.amount = t2Kit.stripLength - last_filled;
            t2Kit.toxinaStart = last_filled;
            Kit.update(t2Kit._id, t2Kit).catch((err) => {
              console.log(err);
            });
          }
        });
      }
    }
  }).catch((error) => {
    console.log(error);
  });

  Kit.getActiveZea().then((zeaArray) => {
    if (zeaArray.length != 0) {
      var zeaKit = zeaArray[0];
      var new_last;
      var last_filled = 0;
      var counter = 0;

      for (let i = zeaKit.toxinaStart; i < zeaKit.mapArray.length; i++) {
        Workmap.getOneMap(zeaKit.mapArray[i]).then((workmap) => {
          counter++;
          if (workmap.samplesArray.length > 0) {
            new_last = workmap.mapID;
            new_last = new_last.replace("_workmap", "");
            new_last = Number(new_last);

            if (new_last > last_filled) {
              last_filled = new_last;
            }
          }
          if (counter == zeaKit.mapArray.length - 1) {
            zeaKit.amount = zeaKit.stripLength - last_filled;
            zeaKit.toxinaStart = last_filled;
            Kit.update(zeaKit._id, zeaKit).catch((err) => {
              console.log(err);
            });
          }
        });
      }
    }
  }).catch((error) => {
    console.log(error);
  });

  Kit.getActiveFum().then((fumArray) => {
    if (fumArray.length != 0) {
      var fumKit = fumArray[0];
      var new_last;
      var last_filled = 0;
      var counter = 0;

      for (let i = fumKit.toxinaStart; i < fumKit.mapArray.length; i++) {

        Workmap.getOneMap(fumKit.mapArray[i]).then((workmap) => {
          if (workmap.samplesArray.length > 0) {
            new_last = workmap.mapID;
            new_last = new_last.replace("_workmap", "");
            new_last = Number(new_last);

            if (new_last > last_filled) {
              last_filled = new_last;
            }
          }
          if (i == fumKit.mapArray.length - 1) {
            fumKit.amount = fumKit.stripLength - last_filled;
            fumKit.toxinaStart = last_filled;
            Kit.update(fumKit._id, fumKit).catch((err) => {
              console.log(err);
            });
          }
        });
      }
    }
  }).catch((error) => {
    console.log(error);
  });


  Kit.getActiveOcra().then((ocraArray) => {
    if (ocraArray.length != 0) {
      var ocraKit = ocraArray[0];
      var new_last;
      var last_filled = 0;
      var counter = 0;

      for (let i = ocraKit.toxinaStart; i < ocraKit.mapArray.length; i++) {
        Workmap.getOneMap(ocraKit.mapArray[i]).then((workmap) => {
          counter++;
          if (workmap.samplesArray.length > 0) {
            new_last = workmap.mapID;
            new_last = new_last.replace("_workmap", "");
            new_last = Number(new_last);

            if (new_last > last_filled) {
              last_filled = new_last;
            }


          }
          if (counter == ocraKit.mapArray.length - 1) {
            ocraKit.amount = ocraKit.stripLength - last_filled;
            ocraKit.toxinaStart = last_filled;
            Kit.update(ocraKit._id, ocraKit).catch((err) => {
              console.log(err);
            });
          }
        });
      }
    }
  }).catch((error) => {
    console.log(error);
  });

  Sample.getAll().then((sample) => {
    //amostras afla

    if (req.body.sample.AFLA) {
      var id_afla = req.body.sample.AFLA._id;
      var abs_afla = req.body.sample.AFLA.absorbance;
      var abs2_afla = req.body.sample.AFLA.absorbance2;

      if (Array.isArray(abs_afla)) {
        for (let i = 0; i < abs_afla.length; i++) {
          Sample.updateAbsorbances('aflatoxina', id_afla[i], abs_afla[i], abs2_afla[i]).then(() => {
          }).catch((error) => {
            console.log(error);
          });
        }

      } else {

        Sample.updateAbsorbances('aflatoxina', id_afla, abs_afla, abs2_afla).then(() => {
        }).catch((error) => {
          console.log(error);
        });

      }
    }

    if (req.body.sample.DON) {
      //amostras deox
      var id_deox = req.body.sample.DON._id;
      var abs_deox = req.body.sample.DON.absorbance;
      var abs2_deox = req.body.sample.DON.absorbance2;

      if (Array.isArray(abs_deox)) {
        for (let i = 0; i < abs_deox.length; i++) {
          Sample.updateAbsorbances('deoxinivalenol', id_deox[i], abs_deox[i], abs2_deox[i]).then(() => {
          }).catch((error) => {
            console.log(error);
          });
        }
      } else {
        Sample.updateAbsorbances('deoxinivalenol', id_deox, abs_deox, abs2_deox).then(() => {
        }).catch((error) => {
          console.log(error);
        });
      }
    }

    if (req.body.sample.OTA) {
      //amostras ocra
      var id_ocra = req.body.sample.OTA._id;
      var abs_ocra = req.body.sample.OTA.absorbance;
      var abs2_ocra = req.body.sample.OTA.absorbance2;

      if (Array.isArray(abs_ocra)) {
        for (let i = 0; i < abs_ocra.length; i++) {
          Sample.updateAbsorbances('ocratoxina', id_ocra[i], abs_ocra[i], abs2_ocra[i]).then(() => {
          }).catch((error) => {
            console.log(error);
          });
        }
      } else {
        Sample.updateAbsorbances('ocratoxina', id_ocra, abs_ocra, abs2_ocra).then(() => {
        }).catch((error) => {
          console.log(error);
        });
      }
    }

    if (req.body.sample.T2) {
      //amostra t2
      var id_t2 = req.body.sample.T2._id;
      var abs_t2 = req.body.sample.T2.absorbance;
      var abs2_t2 = req.body.sample.T2.absorbance2;

      if (Array.isArray(abs_t2)) {
        for (let i = 0; i < abs_t2.length; i++) {
          Sample.updateAbsorbances('t2toxina', id_t2[i], abs_t2[i], abs2_t2[i]).then(() => {
          }).catch((error) => {
            console.log(error);
          });
        }
      } else {
        Sample.updateAbsorbances('t2toxina', id_t2, abs_t2, abs2_t2).then(() => {
        }).catch((error) => {
          console.log(error);
        });
      }
    }


    if (req.body.sample.ZEA) {
      //amostras zea
      var id_zea = req.body.sample.ZEA._id;
      var abs_zea = req.body.sample.ZEA.absorbance;
      var abs2_zea = req.body.sample.ZEA.absorbance2;

      if (Array.isArray(abs_zea)) {
        for (let i = 0; i < abs_zea.length; i++) {
          Sample.updateAbsorbances('zearalenona', id_zea[i], abs_zea[i], abs2_zea[i]).then(() => {
          }).catch((error) => {
            console.log(error);
          });
        }
      } else {
        Sample.updateAbsorbances('zearalenona', id_zea, abs_zea, abs2_zea).then(() => {
        }).catch((error) => {
          console.log(error);
        });
      }
    }

    if (req.body.sample.FBS) {
      //amostras fbs
      var id_fbs = req.body.sample.FBS._id;
      var abs_fbs = req.body.sample.FBS.absorbance;
      var abs2_fbs = req.body.sample.FBS.absorbance2;

      if (Array.isArray(abs_fbs)) {
        for (let i = 0; i < abs_fbs.length; i++) {
          Sample.updateAbsorbances('fumonisina', id_fbs[i], abs_fbs[i], abs2_fbs[i]).then(() => {
          }).catch((error) => {
            console.log(error);
          });
        }
      } else {
        Sample.updateAbsorbances('fumonisina', id_fbs, abs_fbs, abs2_fbs).then(() => {
        }).catch((error) => {
          console.log(error);
        });
      }
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
        Sample.updateOcraActive(sample[i]._id, false).then(() => {
        }).catch((error) => {
          console.log(error);
        });


      }

      if (sample[i].aflatoxina.mapReference != 'Sem mapa' && sample[i].aflatoxina.active == true) {
        Sample.updateAflaWorkmap(sample[i]._id, cont + 1).then(() => {
        }).catch((error) => {
          console.log(error);
        });
        Sample.updateAflaActive(sample[i]._id, false).then(() => {
        }).catch((error) => {
          console.log(error);
        });


      }

      if (sample[i].deoxinivalenol.mapReference != 'Sem mapa' && sample[i].deoxinivalenol.active == true) {
        Sample.updateDeoxWorkmap(sample[i]._id, cont + 1).then(() => {
        }).catch((error) => {
          console.log(error);
        });
        Sample.updateDeoxActive(sample[i]._id, false).then(() => {
        }).catch((error) => {
          console.log(error);
        });
      }

      if (sample[i].t2toxina.mapReference != 'Sem mapa' && sample[i].t2toxina.active == true) {
        Sample.updateT2Workmap(sample[i]._id, cont + 1).then(() => {
        }).catch((error) => {
          console.log(error);
        });
        Sample.updateT2Active(sample[i]._id, false).then(() => {
        }).catch((error) => {
          console.log(error);
        });
      }

      if (sample[i].fumonisina.mapReference != 'Sem mapa' && sample[i].fumonisina.active == true) {
        Sample.updatefumWorkmap(sample[i]._id, cont + 1).then(() => {
        }).catch((error) => {
          console.log(error);
        });
        Sample.updateFumActive(sample[i]._id, false).then(() => {
        }).catch((error) => {
          console.log(error);
        });

      }

      if (sample[i].zearalenona.mapReference != 'Sem mapa' && sample[i].zearalenona.active == true) {
        Sample.updateZeaWorkmap(sample[i]._id, cont + 1).then(() => {
        }).catch((error) => {
          console.log(error);
        });
        Sample.updateZeaActive(sample[i]._id, false).then(() => {
        }).catch((error) => {
          console.log(error);
        });


      }
    }

    res.redirect('/queue');

  }).catch((error) => {
    console.log(error);
  });
});

module.exports = router;
