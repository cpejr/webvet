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
router.get('/', auth.isAuthenticated, function(req, res, next) {

  User.count().then((countClients) => {
      Sample.count().then((countSamples) => {
            Requisition.count().then((countRequisitions) => {
              Kit.getAll().then((kits)=>{
                const outofStockArray = new Array;
                var cont = 0;
                for(i = 0; i < kits.length; i++){
                  if(kits[i].stockMin >= kits[i].amount){
                    outofStockArray[cont] = kits[i];
                    cont++;
                  }
                }
                console.log(outofStockArray);
                res.render('admin/homeAdmin', { title: 'Home', layout: 'layoutDashboard.hbs', countClients, outofStockArray ,countSamples, countRequisitions, ...req.session });

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
