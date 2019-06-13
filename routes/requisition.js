var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Requisition = require('../models/requisition');


router.get('/new', (req, res) => {
  res.render('requisition', {title:'Requisição',layout:'layoutDashboard_user.hbs'});
});


router.post('/new', (req,res) => {
  const newRequisition = req.body;

  if (req.body.producerAddress == "0") {
  
  }

  Requisition.create(newRequisition).then((userID)=>{
    console.log(`New requisition with user id: ${userID}`);
    req.flash('success', 'Nova requisição enviada')
    res.redirect('/homeAdmin');
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

module.exports = router;
