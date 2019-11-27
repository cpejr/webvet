const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Kit = require('../models/kit');
const Sample=require('../models/sample');
const regression = require('regression');


function comparara(logb_bo_amostra,intercept,slope){
  return Math.pow(10,(logb_bo_amostra-intercept)/slope);
 }
 
 router.get('/', auth.isAuthenticated,async function(req, res, next) {
  //teste kit afla
  var aflas_p = new Array;
  var sample_array = new Array;
  Kit.getActiveAfla().then((aflaArray)=>{
    // console.log(aflaArray[0].calibrators.P1.sampleID);
    console.log(aflaArray[0].stockMin);
    console.log('--------------------------------------');
    console.log(aflaArray[0].mapArray[0]);
    
    for (let i = 0; i < aflaArray[0].mapArray.length; i++) {
        Sample.getById(aflaArray[0].mapArray[i]).then((afla_amostras)=>{
        sample_array[i] = afla_amostras;
        console.log(sample_array[i]);
        
      });
    }
    aflas_p[0] = aflaArray[0].calibrators.P1;
    aflas_p[1] = aflaArray[0].calibrators.P2;
    aflas_p[2] = aflaArray[0].calibrators.P3;
    aflas_p[3] = aflaArray[0].calibrators.P4;
    aflas_p[4] = aflaArray[0].calibrators.P5;
   console.log(aflas_p);

 

 // console.log(aflas_p[0].aflatoxina.absorbance); //abs afla calibrator


  var b_b0 = new Array;
  var ln_b_b0 = new Array; // eixo y
  cont_b0 = 0;
  var log_concentracao = [Math.log10(4),Math.log10(10),Math.log10(20),Math.log10(40)]; //eixo x
  for (var i = 0; i < 4; i++){
    b_b0[cont_b0] = aflas_p[i+1].absorbance/aflas_p[0].absorbance;
    cont_b0++;
  }
 // console.log(b_b0);
  
//console.log(b_b0);
  for (var i = 0; i < b_b0.length; i++) {
    ln_b_b0[i] = Math.log10(b_b0[i]/(1-b_b0[i]));
  }
  const result = regression.linear([[log_concentracao[0],ln_b_b0[0]],[log_concentracao[1],ln_b_b0[1]],[log_concentracao[2],ln_b_b0[2]]]);
  const slope = result.equation[0];// slope
  const yIntercept = result.equation[1];// intercept
  const result2 = regression.linear([[ln_b_b0[0],log_concentracao[0]],[ln_b_b0[1],log_concentracao[1]],[ln_b_b0[2],log_concentracao[2]]]);
  const gradient2 = result2.equation[0];
  const yIntercp2 = result2.equation[1];
  const fifty_inhibition = Math.pow(10,yIntercp2); //50% inhibition
 console.log(result);
  console.log('------------');
  console.log(slope);
  console.log('__________');
  console.log(yIntercept);
  console.log('_______________________');
  console.log(fifty_inhibition);
  res.render('calibrationcurves', { title: 'Curvas de Calibração', layout: 'layoutDashboard.hbs'});
  }).catch((error)=>{
    console.log(error);
  });

})
 
module.exports = router;
