const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Sample = require('../models/sample');
const Kit = require('../models/kit');
const Workmap=require('../models/Workmap');


/* GET home page. */

router.get('/',  auth.isAuthenticated, function(req, res, next) {
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

router.post('/totest/edit/:mycotoxin/:samplenumber' , function(req, res, next) {

  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    const sampleedit = sample[0];

    console.log(sampleedit);
    if (req.params.mycotoxin == "aflatoxina") {
      if (sampleedit.aflatoxina.status == "Aguardando pagamento") {
        sampleedit.aflatoxina.status = "Nova";
      } else {
        sampleedit.aflatoxina.status = "A corrigir";
      }
    }

    if (req.params.mycotoxin == "ocratoxina") {
      if (sampleedit.ocratoxina.status == "Aguardando pagamento") {
        sampleedit.ocratoxina.status = "Nova";
      } else {
        sampleedit.ocratoxina.status = "A corrigir";
      }
    }

    if (req.params.mycotoxin == "deoxinivalenol") {
      if (sampleedit.deoxinivalenol.status == "Aguardando pagamento") {
        sampleedit.deoxinivalenol.status = "Nova";
      } else {
        sampleedit.deoxinivalenol.status = "A corrigir";
      }
    }

    if (req.params.mycotoxin == "t2toxina") {
      if (sampleedit.t2toxina.status == "Aguardando pagamento") {
        sampleedit.t2toxina.status = "Nova";
      } else {
        sampleedit.t2toxina.status = "A corrigir";
      }
    }

    if (req.params.mycotoxin == "fumonisina") {
      if (sampleedit.fumonisina.status == "Aguardando pagamento") {
        sampleedit.fumonisina.status = "Nova";
      } else {
        sampleedit.fumonisina.status = "A corrigir";
      }
    }

    if (req.params.mycotoxin == "zearalenona") {
      if (sampleedit.zearalenona.status == "Aguardando pagamento") {
        sampleedit.zearalenona.status = "Nova";
      } else {
        sampleedit.zearalenona.status = "A corrigir";
      }
    }

    Sample.update(sampleedit._id, sampleedit).then(() => {
      res.render('admin/queue', { title: 'Queue', layout: 'layoutDashboard.hbs'});
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });

  }).catch((error) => {
   console.log(error);
   res.redirect('/error');
  });
});

router.post('/testing/edit/:mycotoxin/:samplenumber',  function(req, res, next) {

  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    const sampleedit = sample[0];
    sampleedit.status = "Em análise";
    console.log(sampleedit);

    if (req.params.mycotoxin == "aflatoxina") {
      sampleedit.aflatoxina.status = "Em análise";
    }

    if (req.params.mycotoxin == "ocratoxina") {
      sampleedit.ocratoxina.status = "Em análise";
    }

    if (req.params.mycotoxin == "deoxinivalenol") {
      sampleedit.deoxinivalenol.status = "Em análise";
    }

    if (req.params.mycotoxin == "t2toxina") {
      sampleedit.t2toxina.status = "Em análise";
    }

    if (req.params.mycotoxin == "fumonisina") {
      sampleedit.fumonisina.status = "Em análise";
    }

    if (req.params.mycotoxin == "zearalenona") {
      sampleedit.zearalenona.status = "Em análise";
    }

    Sample.update(sampleedit._id, sampleedit).then(() => {
      res.render('admin/queue', { title: 'Queue', layout: 'layoutDashboard.hbs'});
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
   }).catch((error) => {
     console.log(error);
     res.redirect('/error');
   });
});

router.post('/ownering/edit/:mycotoxin/:samplenumber',  function(req, res, next) {


  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    const sampleedit = sample[0];
    sampleedit.status = "Aguardando pagamento";
    console.log(sampleedit);

    if (req.params.mycotoxin == "aflatoxina") {
      sampleedit.aflatoxina.status = "Aguardando pagamento";
    }

    if (req.params.mycotoxin == "ocratoxina") {
      sampleedit.ocratoxina.status = "Aguardando pagamento";
    }

    if (req.params.mycotoxin == "deoxinivalenol") {
      sampleedit.deoxinivalenol.status = "Aguardando pagamento";
    }

    if (req.params.mycotoxin == "t2toxina") {
      sampleedit.t2toxina.status = "Aguardando pagamento";
    }

    if (req.params.mycotoxin == "fumonisina") {
      sampleedit.fumonisina.status = "Aguardando pagamento";
    }

    if (req.params.mycotoxin == "zearalenona") {
      sampleedit.zearalenona.status = "Aguardando pagamento";
    }

    Sample.update(sampleedit._id, sampleedit).then(() => {
      res.render('admin/queue', { title: 'Queue', layout: 'layoutDashboard.hbs'});
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
   }).catch((error) => {
     console.log(error);
     res.redirect('/error');
   });
});



router.post('/waiting/edit/:mycotoxin/:samplenumber',  function(req, res, next) {

  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    const sampleedit = sample[0];
    sampleedit.status = "Aguardando Amostra";
    console.log(sampleedit);

    if (req.params.mycotoxin == "aflatoxina") {
      sampleedit.aflatoxina.status = "Aguardando amostra";
    }

    if (req.params.mycotoxin == "ocratoxina") {
      sampleedit.ocratoxina.status = "Aguardando amostra";
    }

    if (req.params.mycotoxin == "deoxinivalenol") {
      sampleedit.deoxinivalenol.status = "Aguardando amostra";
    }

    if (req.params.mycotoxin == "t2toxina") {
      sampleedit.t2toxina.status = "Aguardando amostra";
    }

    if (req.params.mycotoxin == "fumonisina") {
      sampleedit.fumonisina.status = "Aguardando amostra";
    }

    if (req.params.mycotoxin == "zearalenona") {
      sampleedit.zearalenona.status = "Aguardando amostra";
    }

    Sample.update(sampleedit._id, sampleedit).then(() => {
      res.render('admin/queue', { title: 'Queue', layout: 'layoutDashboard.hbs'});
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
   }).catch((error) => {
     console.log(error);
     res.redirect('/error');
   });
});


router.post('/scndTesting/edit/:mycotoxin/:samplenumber/:kitID',  function(req, res, next) {//this function is for the second kanban

  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    var mapPosition;
    const sampleedit = sample[0];
    sampleedit.status = "Em análise";

    if (req.params.mycotoxin == "aflatoxina") {
      sampleedit.aflatoxina.status = "Em análise";
      mapPosition=sampleedit.aflatoxina.mapReference;
      sampleedit.aflatoxina.mapReference="Sem mapa";
    }

    if (req.params.mycotoxin == "ocratoxina") {
      sampleedit.ocratoxina.status = "Em análise";
      mapPosition=sampleedit.ocratoxina.mapReference;
      sampleedit.ocratoxina.mapReference="Sem mapa";
    }

    if (req.params.mycotoxin == "deoxinivalenol") {
      sampleedit.deoxinivalenol.status = "Em análise";
       mapPosition=sampleedit.deoxinivalenol.mapReference;
      sampleedit.deoxinivalenol.mapReference="Sem mapa";
    }

    if (req.params.mycotoxin == "t2toxina") {
      sampleedit.t2toxina.status = "Em análise";
      mapPosition=sampleedit.t2toxina.mapReference;
      sampleedit.t2toxina.mapReference="Sem mapa";
    }

    if (req.params.mycotoxin == "fumonisina") {
      sampleedit.fumonisina.status = "Em análise";
      mapPosition=sampleedit.fumonisina.mapReference;
      sampleedit.fumonisina.mapReference="Sem mapa";
    }

    if (req.params.mycotoxin == "zearalenona") {
      sampleedit.zearalenona.status = "Em análise";
      mapPosition=sampleedit.zearalenona.mapReference;
        sampleedit.zearalenona.mapReference="Sem mapa";
    }
    //in the next lines the mapReference is converted to number
   var mapPosition = mapPosition.replace("_workmap", "");
   var mapPosition= Number(mapPosition)-1;//is necessary to subtract one, since the array starts with 0 instead of 1

    Kit.getWorkmapsById(req.params.kitID).then((mapArray)=>{//get workmap of the current kit
       Workmap.removeSample(mapArray[mapPosition],sampleedit._id).then(()=>{
           Sample.update(sampleedit._id, sampleedit).then(() => {
             console.log(sampleedit);
             res.render('admin/queue', { title: 'Queue', layout: 'layoutDashboard.hbs'});
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

// router.post('/addPOnMap/:mycotoxin/:kitID/:mapreference/:calibrator',  function(req, res, next) {
//    Kit.getWorkmapsById(kit._id).then((mapArray)=>{//access the kit and get the workmaps
//      var mapPosition = req.params.mapreference;
//      var mapPosition = mapPosition.replace("_workmap", "");
//      var mapPosition= Number(mapPosition)-1; //cats the number of the workmap, but since the array starts with zero, it's necessary subtract 1
//      var originMapPosition;
//      const sample = {
//        name: samplesV[i],
//        samplenumber: numDefault,
//        responsible: req.body.responsible
//      }
//





//});

router.post('/mapedit/:mycotoxin/:samplenumber/:kitID/:mapreference',  function(req, res, next) {


  Kit.getById(req.params.kitID).then((kit)=>{
     var mapPosition = req.params.mapreference;
     var mapPosition = mapPosition.replace("_workmap", "");
     var mapPosition= Number(mapPosition)-1; //cats the number of the workmap, but since the array starts with zero, it's necessary subtract 1
     var originMapPosition;
     console.log(kit);
     Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
         const sampleedit = sample[0]; //sample is a array with one content, to work with it just catch the first element

         Kit.getWorkmapsById(kit._id).then((mapArray)=>{//access the kit and get the workmaps
           if (req.params.mycotoxin == "aflatoxina") { //bellow the sample atributes are seted
             sampleedit.aflatoxina.status = "Mapa de Trabalho";
             originMapPosition=sampleedit.aflatoxina.mapReference;
             sampleedit.aflatoxina.mapReference=req.params.mapreference;

           }

           if (req.params.mycotoxin == "ocratoxina") {
             sampleedit.ocratoxina.status = "Mapa de Trabalho";
             originMapPosition=sampleedit.ocratoxina.mapReference;
             sampleedit.ocratoxina.mapReference=req.params.mapreference;



           }

           if (req.params.mycotoxin == "deoxinivalenol") {
             sampleedit.deoxinivalenol.status = "Mapa de Trabalho";
             originMapPosition=sampleedit.deoxinivalenol.mapReference;
             sampleedit.deoxinivalenol.mapReference=req.params.mapreference;

           }

           if (req.params.mycotoxin == "t2toxina") {
             sampleedit.t2toxina.status = "Mapa de Trabalho";
             originMapPosition=sampleedit.t2toxina.mapReference;
             sampleedit.t2toxina.mapReference=req.params.mapreference;
           }

           if (req.params.mycotoxin == "fumonisina") {
             sampleedit.fumonisina.status = "Mapa de Trabalho";
             originMapPosition=sampleedit.fumonisina.mapReference;
             sampleedit.fumonisina.mapReference=req.params.mapreference;

           }

           if (req.params.mycotoxin == "zearalenona") {
             sampleedit.zearalenona.status = "Mapa de Trabalho";
             originMapPosition=sampleedit.zearalenona.mapReference;
             sampleedit.zearalenona.mapReference=req.params.mapreference;

           }

           console.log(originMapPosition);

           if(originMapPosition!="Sem mapa") { //if is null or undefined, it cant be manipulate and will be used bellow
             originMapPosition = originMapPosition.replace("_workmap", "");//casts the old map reference of the sample to an number
             originMapPosition = Number(originMapPosition)-1;
             console.log(originMapPosition);
           }



           Sample.update(sampleedit._id, sampleedit).then(() => {
               Workmap.getOneMap(mapArray[mapPosition]._id).then((targetMap)=>{//gets only the workmap where the sample will be added
                   var isAdded=false;
                   for(i=0;i<targetMap.samplesArray.length;i++) {//check if the sample already exists in the workmap
                      if(targetMap.samplesArray[i]._id.equals(sampleedit._id)){// a simple == doest work, for _id the function.equals() is necessary
                          isAdded=true;
                          i=targetMap.samplesArray.length; //breaks the for
                      }
                   }

                  if(isAdded) {
                    res.render('admin/queue', { title: 'Queue', layout: 'layoutDashboard.hbs'});//if alredy exists, dont add
                   }
                  else {
                    if(originMapPosition=="Sem mapa"){//the sample never was in a workmap before
                      Workmap.addSample(mapArray[mapPosition], sampleedit._id,req.params.mapreference).then(() => { //else, it will be add
                          res.render('admin/queue', { title: 'Queue', layout: 'layoutDashboard.hbs'});
                       }).catch((error) => {
                         console.log(error);
                         res.redirect('/error');
                       });
                    }
                    else { //the sample was an workmap before
                      Workmap.removeSample(mapArray[originMapPosition],sampleedit._id).then(()=>{//remove from the previus workmap
                        Workmap.addSample(mapArray[mapPosition], sampleedit._id,req.params.mapreference).then(() => { //else, it will be add
                            res.render('admin/queue', { title: 'Queue', layout: 'layoutDashboard.hbs'});
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
    const sampleshow = sample[0];
    console.log(sampleshow);
    res.render('samples/edit', { title: 'Editar amostra', layout: 'layoutDashboard.hbs', sampleshow});
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.put('/edit/:samplenumber', (req, res) => {
  const { sampleX } = req.body;
  console.log(sampleX);
  Sample.update(req.params.samplenumber, sampleX).then(() => {
    req.flash('success', 'Amostra alterada');
    res.redirect('/sample/edit/'+req.params.samplenumber);
  }).catch((error) => {
    console.log("AMIGO ESTOU AQUI");
    console.log(error);
    res.redirect('/error');
  });
});


module.exports = router;
