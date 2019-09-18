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
router.get('/', auth.isAuthenticated, function(req, res, next) {

  User.count().then((countClients) => {
      Sample.count().then((countSamples) => {
            Requisition.count().then((countRequisitions) => {
              Kit.getAll().then((kits)=>{
                Kitstock.getAll().then((kitstock)=>{
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




                  function outofStock(pname,amount, stockmin){
                    this.productCode = pname;
                    this.amount = amount;
                    this.stockmin =stockmin;
                  }


                  var stockMap = new Map();

                  for (var i = 0; i < kits.length; i++) {
                    if(stockMap.has(kits[i].productCode) == true){
                      x = stockMap.get(kits[i].productCode);
                      stockMap.set(kits[i].productCode , kits[i].amount + x);
                      // console.log('qtde');
                      // console.log(kits[i].amount);
                      // console.log(x);
                    }
                    else {
                      stockMap.set(kits[i].productCode , kits[i].amount);
                    }
                  }
                  //aqui em cima somou, agora falta compara os maps
                  //agora agnt compara com a quantidade minima e coloca num novo map
                  var cont_todos = 0;
                  var todos = new Object();
                  for(var i = 0; i < kitstock.length; i++){
                    stockMap.get(kitstock[i].productcode);// retorna a quantidade
                     if(stockMap.get(kitstock[i].productcode) < kitstock[i].stockmin){ // sinal q ta faltando stock
                      todos[cont_todos] = new outofStock(kitstock[i].productcode,stockMap.get(kitstock[i].productcode),kitstock[i].stockmin);
                      cont_todos++;

                     }
                  }

                res.render('admin/homeAdmin',  { title: 'Home', layout: 'layoutDashboard.hbs', countClients,outofStock,todos,vencidos ,countSamples, countRequisitions, ...req.session });

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
