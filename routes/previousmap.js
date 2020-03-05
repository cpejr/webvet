const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Sample = require('../models/sample');
const Workmap = require('../models/Workmap');

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers, 
     * and you may want to customize it to your needs
     */
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}

/* GET home page. */
router.get('/', /*auth.isAuthenticated,*/ async function (req, res, next) {
  let result = await Workmap.getLastFinalizedSamples();

  for (let i = 0; i < result.length; i++) {
    const element = result[i];

    let sigla = element._id.replace(" Romer", "");
    //CORREÇÃO PROVISÓRIA DA SIGLA FBS 
    if (sigla === "FUMO")
      sigla = "FBS";

    let toxina = ToxinasFull[ToxinasSigla.indexOf(sigla)];

    //Verificar se mudou de workmap
    for (let j = 0; j < element.samples.length; j++) 
      if (j > 0 && element.samples[j - 1][toxina].workmapId + "" !== element.samples[j][toxina].workmapId + "") 
        result[i].samples[j].changedWorkmap = true;
    
    result[i]._id = sigla
  }

  //Order by Sigla
  result.sort(dynamicSort("_id"));
  
  res.render('previousmap', { result, ...req.session });
});
module.exports = router;
