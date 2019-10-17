const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Mycotoxin = require('../models/mycotoxin');
const Kit = require('../models/kit');
const User = require('../models/user');
const Workmap= require('../models/Workmap');
const Kitstock = require('../models/kitstock');




router.get('/', auth.isAuthenticated, function(req, res, next) {
  res.render('setstock', { title: 'Queue', layout: 'layoutDashboard.hbs',...req.session});
});
module.exports = router;


router.get('/setstock', (req, res) => {
  Kit.getAll().then((kits) => {
    Kitstock.getAll().then((kitstocks) => {
      var stockMap = new Map();

      for (var i = 0; i < kits.length; i++) {
        if(stockMap.has(kits[i].productCode) == true){
          x = stockMap.get(kits[i].productCode);
          stockMap.set(kits[i].productCode , kits[i].amount + x);
        }
        else {
          stockMap.set(kits[i].productCode , kits[i].amount);
        }

      }
      console.log(stockMap);

      res.send({stockMap: [...stockMap]});
      // var a2 = ["oi", "tchau"];

    });
  });
});



router.post('/', auth.isAuthenticated,  function(req,res) {
  var item = {
    min:req.body.kitstock.stockmin,
    name: req.body.kitstock.productcode,
  };
  mongo.connect(url, function(err, database) {
       assert.equal(null, err)
       var dbTest = database.db('test')
       var cursor = dbTest.collection('user-data').find()
  //  })
  const { kitstock } = req.body;
  kitstock.stripLength=kitstock.stockmin;
  Kitstock.create(kit).then((id) => {

      const kitstock= {
        stockmin:req.body.kitstock.stockmin,
      }
      console.log(workmap);

    res.redirect('/stock');
  }).catch((error) => {
  console.log(error);
  res.redirect('/error');
   });
   
})
});
