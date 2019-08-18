const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Sample = require('../models/sample');
const Requisition = require('../models/requisition');
const User = require('../models/user');
const Kit = require('../models/kit');

/* GET home page. */
router.get('/', function(req, res, next) {

  User.count().then((countClients) => {
      Sample.count().then((countSamples) => {
            Requisition.count().then((countRequisitions) => {
              Kit.getAll().then((kits)=>{
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
                var vencidos = new Array;
                for(i = 0; i < kits.length; i++){
                  if(kits[i].yearexpirationDate < yyyy){ // pelo o ano deu pra ver q venceu
                    vencidos[cont_vencidos] = kits[i];
                    cont_vencidos++;
                  }
                  if(kits[i].yearexpirationDate == yyyy){
                    possiveis[cont_possiveis] = kits[i];
                    cont_possiveis++;
                    console.log(possiveis);
                  }

                  if(kits[i].stockMin >= kits[i].amount){
                    outofStockArray[cont] = kits[i];
                    cont++;
                  }
                }
                console.log(vencidos);
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


                console.log('VENCEUUU ');
                console.log(vencidos);
                console.log('VENCEUUU ^^^^^^^^^^^^^^ ');
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
});

// const kit
// Kit.getAll().then(kit) =>{
//  console.log(kit);
//  var i;
//  catch((error) =>{
//    console.log(error);
//  });
// }
//



// Kit.getAll().then((kit) => {
//   console.log('O que esta imprimindo');
//   console.log(kit);
//   console.log('O que esta imprimindo');
//
//   res.render('admin/homeAdmin', {kit,stockMin,...req.session});
// }).catch((error) =>{
//     console.log(error);
// });


module.exports = router;
