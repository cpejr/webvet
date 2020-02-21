const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Sample = require('../models/sample');
const Kit = require('../models/kit');
const Workmap = require('../models/Workmap');


/* GET home page. */

router.get('/', auth.isAuthenticated, function (req, res, next) {
  res.render('test', { title: 'Usuários', layout: 'layoutDashboard.hbs', ...req.session });

});

router.post('/create', (req, res) => {
  const { sample } = req.body;
  console.log("NA ROTA SAMPLE!");
  Sample.getMaxSampleNumber().then((maxSample) => {

    sample = {
      samplenumber: maxSample[0].samplenumber + 1
    }


    Sample.create(sample).then(() => {
      req.flash('success', 'Cadastrado com sucesso.');
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/:status/edit/:mycotoxin/:samplenumber', function (req, res, next) {

  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    const sampleedit = sample;
    const status = req.params.status;
    const toxina = req.params.mycotoxin;

    function removeWorkmap() {//Remove from workmaps
      if (sample[toxina].mapReference !== "Sem mapa") {
        sampleedit[toxina].mapReference = "Sem mapa";
        const workmapId = sample[toxina].workmapId;
        sampleedit[toxina].workmapId = null;

        Workmap.removeSample(workmapId, sample._id);
      }
    }


    switch (status) {
      case "totest":
        if (sampleedit[toxina].status == "Aguardando pagamento") {
          sampleedit[toxina].status = "Nova";
        } else {
          sampleedit[toxina].status = "A corrigir";
        }
        break;
      case "testing":
        sampleedit[toxina].status = "Em análise";
        break;
      case "ownering":
        sampleedit[toxina].status = "Aguardando pagamento";
        removeWorkmap();

        break;
      case "waiting":
        sampleedit[toxina].status = "Aguardando amostra";
        removeWorkmap();
        break;
    }




    Sample.update(sampleedit._id, sampleedit).then((response) => {
      res.send(response)
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });

  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/setActiveKit/:toxinafull/:kitActiveID', function (req, res, next) {
  //Set active to inactive
  let sigla = ToxinasSigla[ToxinasFull.indexOf(req.params.toxinafull)]
  //Correção provisória do problema com a sigla
  if (sigla === "FBS")
    sigla = "FUMO"

  Kit.getActiveID(sigla).then((kit) => {
    if (kit)
      Kit.setActiveStatus(kit._id, false);
  }).then(() => {
    //Update new one
    Kit.setActiveStatus(req.params.kitActiveID, true).then((response) => {
      res.send(response);
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/scndTesting/edit/:mycotoxin/:samplenumber/:kitID', function (req, res, next) {//this function is for the second kanban

  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    var mapPosition;
    const sampleedit = sample;
    sampleedit.status = "Em análise";

    const toxina = req.params.mycotoxin;
    sampleedit[toxina].status = "Em análise";
    mapPosition = sampleedit[toxina].mapReference;
    sampleedit[toxina].mapReference = "Sem mapa";

    //in the next lines the mapReference is converted to number
    var mapPosition = mapPosition.replace("_workmap", "");
    var mapPosition = Number(mapPosition) - 1;//is necessary to subtract one, since the array starts with 0 instead of 1

    Kit.getWorkmapsById(req.params.kitID).then((mapArray) => {//get workmap of the current kit
      Workmap.removeSample(mapArray[mapPosition], sampleedit._id).then(() => {
        Sample.update(sampleedit._id, sampleedit).then(() => {
          console.log(sampleedit);
          res.send(sampleedit);
        }).catch((error) => {
          console.log(error);
          res.redirect('/error');
        });
      }).catch((error) => {
        console.log(error);
        res.redirect('/error');
      });

    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });

  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});




router.post('/mapedit/:mycotoxin/:samplenumber/:kitID/:mapreference', function (req, res, next) {


  Kit.getById(req.params.kitID).then((kit) => {
    var mapPosition = req.params.mapreference;
    var mapPosition = mapPosition.replace("_workmap", "");
    var mapPosition = Number(mapPosition) - 1; //cats the number of the workmap, but since the array starts with zero, it's necessary subtract 1
    var originMapPosition;
    Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
      const sampleedit = sample; //sample is a array with one content, to work with it just catch the first element

      Kit.getWorkmapsById(kit._id).then((mapArray) => {//access the kit and get the workmaps
        const toxin = req.params.mycotoxin;

        sampleedit[toxin].status = "Mapa de Trabalho";
        originMapPosition = sampleedit[toxin].mapReference;
        sampleedit[toxin].mapReference = req.params.mapreference;
        sampleedit[toxin].workmapId = mapArray[mapPosition];

        if (originMapPosition != "Sem mapa") { //if is null or undefined, it cant be manipulate and will be used bellow
          originMapPosition = originMapPosition.replace("_workmap", "");//casts the old map reference of the sample to an number
          originMapPosition = Number(originMapPosition) - 1;
          console.log(originMapPosition);
        }

        Sample.update(sampleedit._id, sampleedit).then((response) => {
          Workmap.getOneMap(mapArray[mapPosition]._id).then((targetMap) => {//gets only the workmap where the sample will be added
            var isAdded = false;
            for (i = 0; i < targetMap.samplesArray.length; i++) {//check if the sample already exists in the workmap
              if (targetMap.samplesArray[i]._id.equals(sampleedit._id)) {// a simple == doest work, for _id the function.equals() is necessary
                isAdded = true;
                i = targetMap.samplesArray.length; //breaks the for
              }
            }

            if (isAdded) {
              res.send(response);//if alredy exists, dont add
            }
            else {
              if (originMapPosition == "Sem mapa") {//the sample never was in a workmap before
                Workmap.addSample(mapArray[mapPosition], sampleedit._id, req.params.mapreference).then((res) => { //else, it will be add
                  res.send(res);
                }).catch((error) => {
                  console.log(error);
                  res.redirect('/error');
                });
              }
              else { //the sample was an workmap before
                Workmap.removeSample(mapArray[originMapPosition], sampleedit._id).then(() => {//remove from the previus workmap
                  Workmap.addSample(mapArray[mapPosition], sampleedit._id, req.params.mapreference).then((res) => { //else, it will be add
                    ress.send(res);
                  }).catch((error) => {
                    console.log(error);
                    res.redirect('/error');
                  });
                }).catch((error) => {
                  console.log(error);
                  res.redirect('/error');
                });
              }
            }
          }).catch((error) => {
            console.log(error);
            res.redirect('/error');
          });
        }).catch((error) => {
          console.log(error);
          res.redirect('/error');
        });
      }).catch((error) => {
        console.log(error);
        res.redirect('/error');
      });

    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });

});

router.get('/edit/:samplenumber', (req, res) => {
  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    res.render('samples/edit', { title: 'Editar amostra', layout: 'layoutDashboard.hbs', sample });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/save', (req, res) => {
  const { sample } = req.body;
  console.log(sample);
  Sample.updateBySampleNumber(sample.samplenumber + "", sample).then(() => {
    req.flash('success', 'Amostra alterada');
    res.redirect('/sample/edit/' + sample.samplenumber);
  }).catch((error) => {
    console.log("AMIGO ESTOU AQUI");
    console.log(error);
    res.redirect('/error');
  });
});


module.exports = router;
