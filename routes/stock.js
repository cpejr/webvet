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



//É PARA MEXER NESSA
/* GET home page. */
router.get('/', function(req, res, next) {
  Kit.getAll().then((kits) => {
    Kitstock.getAll().then((kitstocks) => {
    var today = new Date();
    var kit90 = new Array;
    var kit60 = new Array;
    var kit30 = new Array;
    var cont90 = 0;
    var cont60 = 0;
    var cont30 = 0;
    var cont_afla = 0;
    var cont_don = 0;
    var cont_fumo = 0;
    var cont_ota = 0;
    var cont_t2 = 0;
    var cont_zea = 0;
    var cont = 0;
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var oneDay = 24*60*60*1000;
    var stockMap = new Map();
    for (var i = 0; i < kits.length; i++) {
      var firstDate = new Date(yyyy,mm,dd);
      var secondDate = new Date(kits[i].yearexpirationDate,kits[i].monthexpirationDate,kits[i].dayexpirationDate);
      var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));

      if(diffDays > 90){
        kit90[cont90] = kits[i];
        cont90++;
      }
      else if(diffDays <= 90 && diffDays >= 30){
        kit60[cont60] = kits[i];
        cont60++;
      }
      else if (diffDays < 30) {
        kit30[cont30] = kits[i];
        cont30++;
      }
  }

// var x = new Array;
// x = stockMap.keys();
// console.log(stockMap.keys());




    for (var i = 0; i < kits.length; i++) {
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





    res.render('stock/index', { title: 'Kits', kit30,kit60,kit90,kitstocks,layout: 'layoutDashboard.hbs',...req.session, kits });
  })
  })
});






  router.get('/stock', (req, res) => {
    // console.log(a2);
    // res.send( a2 );
    Kit.getAll().then((kits) => {
      Kitstock.getAll().then((kitstocks) => {
        var stockMap = new Map();
        for (var i = 0; i < kitstocks.length; i++) {
          stockMap.set(kitstocks[i].productcode,0);
        }
        for (var i = 0; i < kits.length; i++) {
          if(stockMap.has(kits[i].productCode) == true){
            x = stockMap.get(kits[i].productCode);
            stockMap.set(kits[i].productCode , kits[i].amount + x);
          }

        }
        console.log(stockMap);

        res.send({stockMap: [...stockMap]});
        // var a2 = ["oi", "tchau"];

  });
  });
  });




router.get('/show/:id', auth.isAuthenticated, function(req, res, next) {
  Kit.getById(req.params.id).then((kit) => {
    //console.log(kit);
    res.render('stock/show', { title: 'Show Kit', layout: 'layoutDashboard.hbs', kit });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
});


});

router.get('/edit/:id', function(req, res, next) {
  Kit.getById(req.params.id).then((kit) => {
    console.log(kit);
    res.render('stock/edit', { title: 'Edit Kit', layout: 'layoutDashboard.hbs', kit });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.put('/:id', auth.isAuthenticated, function(req, res, next) {
  const { kit } = req.body;
  Kit.update(req.params.id, kit).then(() => {
    req.flash('success', 'Kit alterado com sucesso.');
    res.redirect(`/stock/show/${req.params.id}`)
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});


router.get('/new', auth.isAuthenticated,  function(req,res) {
  console.log(req.session.user);
  res.render('stock/newkit', {title:'Novo Kit',layout:'layoutDashboard.hbs', ...req.session });
});

router.post('/new', auth.isAuthenticated,  function(req,res) {
  console.log(req.session.user);
  const { kit } = req.body;
  console.log(kit);
  Kit.create(kit).then((id) => {
    var size=req.body.kit.amount;
    for(i=0;i<size;i++){
      const workmap= {
        productCode:req.body.kit.productCode,
      }
      console.log(workmap);
      Workmap.create(workmap).then((mapid)=>{
          console.log(`New Workmap with id: ${mapid}`);
        Kit.addMap(id,mapid).catch((error) => {
           console.log(error);
           res.redirect('/error');
        });

      })

    }
    req.flash('success', 'Kit adicionado com sucesso.');
    res.redirect('/stock');
  }).catch((error) => {
  console.log(error);
  res.redirect('/error');
  });

});

router.post('/delete/:id',auth.isAuthenticated, function(req,res){
  Kit.delete(req.params.id).then(()=>{
    console.log('ENTROOOUUUUU');
    res.redirect('/stock');
  }).catch((error) => {
  console.log(error);
  res.redirect('/error');
  });
});







module.exports = router;
