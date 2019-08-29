var express = require('express');
var firebase = require('firebase');
var router = express.Router();
const auth = require('./middleware/auth');
const User = require('../models/user');
const Requisition = require('../models/requisition');
const Kit = require('../models/kit');
const Mycotoxin = require('../models/mycotoxin');
const Email = require('../models/email');
const Workmap=require('../models/Workmap');


router.get('/', (req, res) => {
  Workmap.getAll().then((workmaps)=>{
    var mapas = 0;
    console.log('hehehehe');
    for(i = 0; i < workmaps.length; i++){
      if (workmaps[i].deleted) {
        mapas = mapas;
      }
      else {
        mapas++;
      }
    console.log(mapas);
    res.render('printtemplate', { title: 'Mapa de Trabalho', });
    }
  });
});


module.exports = router;
