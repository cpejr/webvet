const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Kit = require('../models/kit');


router.get('/', auth.isAuthenticated, function (req, res, next) {
  Kit.getAll().then((kits) => {
    res.render('allkits', { title: 'Histórico dos kits', layout: 'layoutDashboard.hbs', kits });
  })
});
module.exports = router;



//
// router.get('/', function(req, res, next) {
//   Kit.getAll().then((kits) => {
//     for(var i = 0; i < kits.length; i++){
//       var ja_existe = false;
//       for(var j = 0; j < allKits.length; j++){
//         if(kits[i].productCode == allKits[j].productCode){
//           console.log('j EXISTE');
//           ja_existe = true;
//         }
//       }
//       if(ja_existe == false){
//         allKits[cont_kits] = kits[i];
//         cont_kits++;
//       }
//     }
//     console.log('TODOS KITS');
//     console.log(allKits);
//     console.log('TODOS KITS ^^^^^^^^^^^^^^^^^^');
//     res.render('allkits', { title: 'Histórico dos kits', layout: 'layoutDashboard.hbs',allKits });
//   })
// });
// module.exports = router;
