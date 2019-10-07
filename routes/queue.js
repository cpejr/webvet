const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Sample = require('../models/sample');
const Requisition = require('../models/requisition');
const User = require('../models/user');

// O IS isAuthenticated TA COMENTADO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


/* GET home page. */
router.get('/', auth.isAuthenticated, function(req, res, next) {
  res.render('admin/queue', { title: 'Queue', layout: 'layoutDashboard.hbs',...req.session});
});

router.post('/',function(req,res,next){
  Sample.getAll().then((sample)=>{
    const ativa = {
        ocratoxina:{active:0,status:"xxx", mapReference:"sess"},
    };
    const afla_ativa = {
      aflatoxina:{active: 0,status:"xxx",mapReference:"sess"},
    };
    const t2toxina_ativa = {
      t2toxina:{active: 0 , status:"xxx", mapReference:"sess"}
    };

    const fumonisina_ativa = {
      fumonisina:{active: 0, status:"xxx", mapReference:"sess"}
    };

    const zearalenona_ativa = {
      zearalenona:{active:0 ,status:"xxx",mapReference:"sess"}
    };

    const deoxinivalenol_ativa = {
      deoxinivalenol:{active: 0,status:"xxx",mapReference:"sess"}
    };
    
    for (var i = 0; i < sample.length; i++) {
      if(sample[i].ocratoxina.mapReference != 'Sem mapa'){
        ativa.ocratoxina.status = sample[i].ocratoxina.status;
        ativa.ocratoxina.mapReference = sample[i].ocratoxina.mapReference;
        Sample.update(sample[i]._id,ativa).then(()=>{
        }).catch((error)=>{
         console.log(error);
         });
      }

      if(sample[i].aflatoxina.mapReference != 'Sem mapa'){
        afla_ativa.aflatoxina.status = sample[i].aflatoxina.status;
        afla_ativa.aflatoxina.mapReference = sample[i].aflatoxina.mapReference;
        Sample.update(sample[i]._id,afla_ativa).then(()=>{
        }).catch((error)=>{
         console.log(error);
         });
      }
    
      
      if(sample[i].t2toxina.mapReference != 'Sem mapa'){
        t2toxina_ativa.t2toxina.status = sample[i].t2toxina.status;
        t2toxina_ativa.t2toxina.mapReference = sample[i].t2toxina.mapReference;
        Sample.update(sample[i]._id,t2toxina_ativa).then(()=>{
        }).catch((error)=>{
         console.log(error);
         });
      }

      if(sample[i].fumonisina.mapReference != 'Sem mapa'){
        fumonisina_ativa.fumonisina.status = sample[i].fumonisina.status;
        fumonisina_ativa.fumonisina.mapReference = sample[i].fumonisina.mapReference;
        Sample.update(sample[i]._id,fumonisina_ativa).then(()=>{
        }).catch((error)=>{
         console.log(error);
         });
      }

      
      if(sample[i].zearalenona.mapReference != 'Sem mapa'){
        zearalenona_ativa.zearalenona.status = sample[i].zearalenona.status;
        zearalenona_ativa.zearalenona.mapReference = sample[i].zearalenona.mapReference;
        Sample.update(sample[i]._id,zearalenona_ativa).then(()=>{
        }).catch((error)=>{
         console.log(error);
         });
      }
     
      if(sample[i].deoxinivalenol.mapReference != 'Sem mapa'){
        deoxinivalenol_ativa.deoxinivalenol.status = sample[i].deoxinivalenol.status;
        deoxinivalenol_ativa.deoxinivalenol.mapReference = sample[i].deoxinivalenol.mapReference;
        Sample.update(sample[i]._id,deoxinivalenol_ativa).then(()=>{
        }).catch((error)=>{
         console.log(error);
         });
      }
    }
    res.render('admin/queue', { title: 'Queue', layout: 'layoutDashboard.hbs'});
  }).catch((error)=>{
    console.log(error);
  });
});

module.exports = router;
