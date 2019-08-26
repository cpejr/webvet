const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Sample = require('../models/sample');
const Requisition = require('../models/requisition');
const User = require('../models/user');
const Kit = require('../models/kit');
const Kitstock = require('../models/kitstock')

/* GET home page. */
router.get('/', function(req, res, next) {

  User.count().then((countClients) => {
      Sample.count().then((countSamples) => {
            Requisition.count().then((countRequisitions) => {
              Kit.getAll().then((kits)=>{
                Kitstock.getAll().then((kitstock)=>{
                  console.log('Opaaaaa');
                  console.log(kitstock);
                  const outofStockArray = new Array;
                  var cont = 0;
                  var today = new Date();
                  var dd = String(today.getDate()).padStart(2, '0');
                  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                  var yyyy = today.getFullYear();
                  var possiveis = new Array;
                  var possiveis_dias = new Array;
                  var cont_possiveis_dias = 0;
                  var dia_vence = new Array;
                  var cont_dia_vence = 0;
                  var cont_possiveis = 0;
                  var cont_vencidos = 0;
                  var cont_afla = 0;
                  var cont_don = 0;
                  var cont_fumo = 0;
                  var cont_ota = 0;
                  var cont_t2 = 0;
                  var cont_zea = 0;
                  var vencidos = new Array;

                  for(i = 0; i < kits.length; i++){
                    if(kits[i].yearexpirationDate < yyyy){ // pelo o ano deu pra ver q venceu
                      vencidos[cont_vencidos] = kits[i];
                      cont_vencidos++;
                    }
                    if(kits[i].yearexpirationDate == yyyy){
                      possiveis[cont_possiveis] = kits[i];
                      cont_possiveis++;

                    }

                    if(kits[i].productCode == 'AFLA Romer'){
                      cont_afla+=kits[i].amount;
                    }
                    else if (kits[i].productCode == 'DON Romer'){
                      cont_don+=kits[i].amount;
                    }
                    else if (kits[i].productCode == 'FUMO Romer'){
                      cont_fumo+=kits[i].amount;
                    }
                    else if (kits[i].productCode == 'OTA Romer'){
                      cont_ota+=kits[i].amount;
                    }
                    else if (kits[i].productCode == 'T2 Romer'){
                      cont_t2+=kits[i].amount;
                    }
                    else if (kits[i].productCode == 'ZEA Romer'){
                      cont_zea+=kits[i].amount;
                    }
                  }

                  for(i = 0; i < possiveis.length; i++){
                    if(possiveis[i].monthexpirationDate < mm){
                      vencidos[cont_vencidos] = possiveis[i];
                      cont_vencidos++;
                    }
                    if(possiveis[i].monthexpirationDate == mm) {
                      possiveis_dias[cont_possiveis_dias] = possiveis[i];
                      cont_possiveis_dias++;
                    }
                  }
                  for(i = 0; i < possiveis_dias.length;i++){
                    if(possiveis_dias[i].dayexpirationDate < dd){
                      vencidos[cont_vencidos] = possiveis_dias[i];
                      cont_vencidos++;
                    }
                  }

                  var cont = 0;
                  for(var i = 0; i < kitstock.length; i++){
                    if(kitstock[i].productcode == 'AFLA Romer'){
                      if(kitstock[i].stockmin > cont_afla){
                        outofStockArray[cont] = kitstock[i];
                        cont++;
                      }
                    }
                    if(kitstock[i].productcode == 'DON Romer'){
                      if(kitstock[i].stockmin > cont_don){
                        outofStockArray[cont] = kitstock[i];
                        cont++;
                      }
                    }

                    if(kitstock[i].productcode == 'FUMO Romer'){
                      if(kitstock[i].stockmin > cont_fumo){
                        outofStockArray[cont] = kitstock[i];
                        cont++;
                      }
                    }


                    if(kitstock[i].productcode == 'OTA Romer'){
                      if(kitstock[i].stockmin > cont_ota){
                        outofStockArray[cont] = kitstock[i];
                        cont++;
                      }
                    }

                    if(kitstock[i].productcode == 'T2 Romer'){
                      if(kitstock[i].stockmin > cont_t2){
                        outofStockArray[cont] = kitstock[i];
                        cont++;
                      }
                    }
                    if(kitstock[i].productcode == 'ZEA Romer'){
                      if(kitstock[i].stockmin > cont_zea){
                        outofStockArray[cont] = kitstock[i];
                        cont++;
                      }
                    }
                  }




                res.render('admin/homeAdmin',  { title: 'Home', layout: 'layoutDashboard.hbs', countClients,vencidos ,outofStockArray ,countSamples, countRequisitions, ...req.session });

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



module.exports = router;
