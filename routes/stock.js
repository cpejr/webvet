const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Mycotoxin = require('../models/mycotoxin');
const Kit = require('../models/kit');
const User = require('../models/user');
const Workmap= require('../models/Workmap');





/* GET home page. */
router.get('/', auth.isAuthenticated, function(req, res, next) {
  Kit.getAll().then((kits) => {
    // console.log(kits);
    // console.log("THE KIT IS HEEEREEE");
    // console.log(req.session);

    res.render('stock/index', { title: 'Kits', layout: 'layoutDashboard.hbs', ...req.session, kits });
  })
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
