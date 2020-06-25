const express = require('express');
const router = express.Router();
const auth = require('./middleware/auth');
const Sample = require('../models/sample');
const Requisition = require('../models/requisition');
const User = require('../models/user');
const Kit = require('../models/kit');
const Counter = require('../models/counter');

/* GET home page. */
router.get('/', auth.isAuthenticated, function (req, res) {

  User.count().then((countClients) => {
    Sample.count().then((countSamples) => {
      Requisition.getAll().then((requisitions) => {
        Kit.getAll().then((kits) => {
          Counter.getEntireKitStocks().then((kitstocks) => {

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            var possiveis = new Array;
            var possiveis_dias = new Array;
            var cont_possiveis_dias = 0;
            var cont_possiveis = 0;
            var cont_vencidos = 0;
            var vencidos = new Array;
            for (i = 0; i < kits.length; i++) {
              if (kits[i].yearexpirationDate < yyyy) { // pelo o ano deu pra ver q venceu
                vencidos[cont_vencidos] = kits[i];
                cont_vencidos++;
              }
              if (kits[i].yearexpirationDate == yyyy) {
                possiveis[cont_possiveis] = kits[i];
                cont_possiveis++;
              }
            }

            for (i = 0; i < possiveis.length; i++) {
              if (possiveis[i].monthexpirationDate < mm) {
                vencidos[cont_vencidos] = possiveis[i];
                cont_vencidos++;
              }
              if (possiveis[i].monthexpirationDate == mm) {
                possiveis_dias[cont_possiveis_dias] = possiveis[i];
                cont_possiveis_dias++;
              }
            }
            for (i = 0; i < possiveis_dias.length; i++) {
              if (possiveis_dias[i].dayexpirationDate < dd) {
                vencidos[cont_vencidos] = possiveis_dias[i];
                cont_vencidos++;
              }
            }

            var stockMap = new Map();

            for (var i = 0; i < kits.length; i++) {
              if (stockMap.has(kits[i].productCode) == true) {
                x = stockMap.get(kits[i].productCode);
                stockMap.set(kits[i].productCode, kits[i].amount + x);
              }
              else {
                stockMap.set(kits[i].productCode, kits[i].amount);
              }
            }

            var novasReq = 0;
            for (var i = 0; i < requisitions.length; i++) {
              if (requisitions[i].status === "Nova") {
                novasReq++;
              }
            }
            var gt0 = false;
            var gt1 = false;
            var et1 = false;
            if (novasReq > 0) {
              gt0 = true;
            }
            if (novasReq === 1) {
              et1 = true;
            }
            if (novasReq > 1) {
              gt1 = true;
            }

            //Kitstock notification object
            let totalKitCounter = [];

            for (let k = 0; k < ToxinasSigla.length; k++) {
              totalKitCounter.push({ name: ToxinasSigla[k], count: 0 });
            }

            for (let i = 0; i < kits.length; i++) { //Will count all ammounts for all kits that are not deleted, and store in totalKitCounter.name vector.
              if (!kits[i].deleted) {
                productC = kits[i].productCode;
                let pointIndex = Number;
                let countAux = Number;

                for (let j = 0; j < ToxinasSigla.length; j++) {
                  let currentTox = ToxinasSigla[j];
                  if (ToxinasSigla[j] === "FBS") {
                    currentTox = "FUMO";
                  }
                  if (productC === ToxinasSigla[j] + " Romer") {
                    pointIndex = totalKitCounter.findIndex(element => (element.name === currentTox));
                    countAux = totalKitCounter[pointIndex].count + kits[i].amount;
                    totalKitCounter[pointIndex].count = countAux;
                  }
                }
              }
            }

            for (let p = 0; p < ToxinasAll.length; p++) {
              let stockIndex = kitstocks.findIndex(element => (element.name === ToxinasAll[p].Full));
              let countIndex = totalKitCounter.findIndex(element => (element.name === ToxinasAll[p].Sigla));
              let actualKitStock = kitstocks[stockIndex];
              let actualKitCounter = totalKitCounter[countIndex];
              if (actualKitCounter.count < actualKitStock.minStock) { //Counter is less than minimum ammount for a specific toxin
                totalKitCounter[countIndex].isLessThan = true;
                totalKitCounter[countIndex].minStock = actualKitStock.minStock;
              } else {
                totalKitCounter[countIndex].isLessThan = false;
                totalKitCounter[countIndex].minStock = actualKitStock.minStock;
              }
            }
            res.render('admin/homeAdmin', { title: 'Home', layout: 'layoutDashboard.hbs', countClients, vencidos, countSamples, requisitions, novasReq, gt0, gt1, et1, ...req.session, totalKitCounter });
          }).catch((err) => {
            console.log(err);
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
