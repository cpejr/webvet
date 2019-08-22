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

router.post('/mapwork/edit/:mycotoxin/:samplenumber/:mapreference',  function(req, res, next) {

  Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
    const sampleedit = sample[0];
    sampleedit.status = "Mapa de Trabalho";

    console.log(sampleedit);
    console.log(req.params.mapreference);


    if (req.params.mycotoxin == "aflatoxina") {
      sampleedit.aflatoxina.status = "Mapa de Trabalho";
      sampleedit.aflatoxina.mapReference=req.params.mapreference;
    }

    if (req.params.mycotoxin == "ocratoxina") {
      sampleedit.ocratoxina.status = "Mapa de Trabalho";
      sampleedit.ocratoxina.mapReference=req.params.mapreference;
    }

    if (req.params.mycotoxin == "deoxinivalenol") {
      sampleedit.deoxinivalenol.status = "Mapa de Trabalho";
      sampleedit.deoxinivalenol.mapReference=req.params.mapreference;
    }

    if (req.params.mycotoxin == "t2toxina") {
      sampleedit.t2toxina.status = "Mapa de Trabalho";
      sampleedit.t2toxina.mapReference=req.params.mapreference;
    }

    if (req.params.mycotoxin == "fumonisina") {
      sampleedit.fumonisina.status = "Mapa de Trabalho";
      sampleedit.fumonisina.mapReference=req.params.mapreference;
    }

    if (req.params.mycotoxin == "zearalenona") {
      sampleedit.zearalenona.status = "Mapa de Trabalho";
      sampleedit.zearalenona.mapReference=req.params.mapreference;
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

router.post('/mapedit/:mycotoxin/:samplenumber/:kitID/:mapreference',  function(req, res, next) {
    console.log("IN");
  Kit.getById(req.params.kitID).then((kit)=>{
     var map = req.params.mapreference;
     var map = map.replace("_workmap", "");
     var map= Number(map)-1;
     Sample.getBySampleNumber(req.params.samplenumber).then((sample) => {
         const sampleedit = sample[0];
         console.log(sampleedit);
         console.log(req.params.mapreference);
         console.log(sampleedit.aflatoxina);
         Kit.getWorkmapsById(kit).then((mapArray)=>{
           if (req.params.mycotoxin == "aflatoxina") {
             sampleedit.aflatoxina.status = "Mapa de Trabalho";
             sampleedit.aflatoxina.mapReference=req.params.mapreference;
                mapArray[map].samplesArray.push(sampleedit._id);
           }

           if (req.params.mycotoxin == "ocratoxina") {
             sampleedit.ocratoxina.status = "Mapa de Trabalho";
             sampleedit.ocratoxina.mapReference=req.params.mapreference;
              mapArray[map].samplesArray.push(  sampleedit._id);
           }

           if (req.params.mycotoxin == "deoxinivalenol") {
             sampleedit.deoxinivalenol.status = "Mapa de Trabalho";
             sampleedit.deoxinivalenol.mapReference=req.params.mapreference;
                mapArray[map].samplesArray.push(  sampleedit._id);
           }

           if (req.params.mycotoxin == "t2toxina") {
             sampleedit.t2toxina.status = "Mapa de Trabalho";
             sampleedit.t2toxina.mapReference=req.params.mapreference;
             mapArray[map].samplesArray.push(  sampleedit._id);
           }

           if (req.params.mycotoxin == "fumonisina") {
             sampleedit.fumonisina.status = "Mapa de Trabalho";
             sampleedit.fumonisina.mapReference=req.params.mapreference;
              mapArray[map].samplesArray.push(  sampleedit._id);
           }

           if (req.params.mycotoxin == "zearalenona") {
             sampleedit.zearalenona.status = "Mapa de Trabalho";
             sampleedit.zearalenona.mapReference=req.params.mapreference;
                 mapArray[map].samplesArray.push(  sampleedit._id);
           }
           console.log(map);
           console.log(mapArray[map].mapID);
           Sample.update(sampleedit._id, sampleedit).then(() => {

               Workmap.addSample(mapArray[map]._id, sampleedit._id).then(() => {
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
