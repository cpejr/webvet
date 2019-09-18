const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Mycotoxin = require('../models/mycotoxin');
const Requisition = require('../models/requisition');
const Kit = require('../models/kit');
const User = require('../models/user');
const Workmap= require('../models/Workmap');
const Kitstock = require('../models/kitstock');



router.get('/', (req, res) => {
  Sample.getAll().then((workmaps)=>{
    var mapas = 0;
    console.log('hehehehe');
    for(i = 0; i < workmaps.length; i++){
      if (workmaps[i].deleted) {
        mapas = mapas;
      }
      else {
        mapas++;
      }
    // console.log(mapas);
    }


    res.render( 'printtemplate',{ title: 'Kits',workmaps ,layout: 'layoutDashboard.hbs',...req.session });


  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

module.exports = router;
