const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Kit = require('../models/kit');
const Sample = require('../models/sample');
const regression = require('regression');
const Workmap=  require('../models/Workmap');



function comparara(logb_bo_amostra,intercept,slope){
  return Math.pow(10,(logb_bo_amostra-intercept)/slope);
 }
 
 router.get('/',async function(req, res, next) {
  var mapas = new Array;
  var amostras_afla = new Array;
  let kit_afla_ativo = await Kit.getActiveAfla();
  //console.log(kit_afla_ativo);
  var Aflaconcentration_p  = new Array;
  var Aflaabsorbance_p = new Array;
  var AflalogB_Bo = new Array; 
  var result;
  var slope; 
  var yIntercept; 


  if(kit_afla_ativo.length!=0){
  //Parte responsável por pegar a concentracao e absorvancia settadas no kit afla ativo
      Aflaconcentration_p[0] = kit_afla_ativo[0].calibrators.P1.concentration;
      Aflaconcentration_p[1] = kit_afla_ativo[0].calibrators.P2.concentration;
      Aflaconcentration_p[2] = kit_afla_ativo[0].calibrators.P3.concentration;
      Aflaconcentration_p[3] = kit_afla_ativo[0].calibrators.P4.concentration;
      Aflaconcentration_p[4] = kit_afla_ativo[0].calibrators.P5.concentration;
     
      Aflaabsorbance_p[0] = kit_afla_ativo[0].calibrators.P1.absorbance;
      Aflaabsorbance_p[1] = kit_afla_ativo[0].calibrators.P2.absorbance;
      Aflaabsorbance_p[2] = kit_afla_ativo[0].calibrators.P3.absorbance;
      Aflaabsorbance_p[3] = kit_afla_ativo[0].calibrators.P4.absorbance;
      Aflaabsorbance_p[4] = kit_afla_ativo[0].calibrators.P5.absorbance;
            
      
    

  

    //Agora já se tem os valores de todos os calibradores, com isso basta agora usar as fórmulas da planilha para calcula o B Bo seu log, slope , intercept e etc.

    var log_concentracao = [Math.log10(Aflaconcentration_p[1]),Math.log10(Aflaconcentration_p[2]),Math.log10(Aflaconcentration_p[3]),Math.log10(Aflaconcentration_p[4])]; //eixo x
    var b_b0 = new Array; 
    var ln_b_b0 = new Array;
    console.log('log concentracao');
    console.log(log_concentracao);
    for (var i = 0; i < 4; i++){
      b_b0[i] = Aflaabsorbance_p[i+1]/Aflaabsorbance_p[0];
    }  
    console.log('B B0');
    
    console.log(b_b0);

    for (var i = 0; i < b_b0.length; i++) {
      ln_b_b0[i] = Math.log10(b_b0[i]/(1-b_b0[i]));
    }
    

    console.log('ln_b_b0');
    console.log(ln_b_b0);


    result_afla = regression.linear([[log_concentracao[0],ln_b_b0[0]],[log_concentracao[1],ln_b_b0[1]],[log_concentracao[2],ln_b_b0[2]]]);
    slope_afla = result_afla.equation[0];// slope
    yIntercept_afla = result_afla.equation[1];// intercept
    
    console.log('slope');
    console.log(slope);
    console.log('yintercept');
    console.log(yIntercept);

    //Aflaconcentration_p ,Aflaabsorbance_p , yIntercept, result, slope

    var resultado_afla = {
      intercept: yIntercept_afla,
      resultado: result_afla,
      slope: slope_afla,
    };
    
     
//--------------------------------------Aqui termina a parte que calcula todos os dados dos calibradores-------------------------------------------------------------


//---------------------------------------Agora começa a parte que pega as absorvancias e calcula o que é preciso- em realação a amostra Essa parte será levada para outra página----------------------------------------------------
    
    //parte responsável por pegar as amostras do kit de aflatoxina, logo  através do kit ativo de afla pega na variável mapArray o id dos mapas que estão sendo utilizados naqueles kits
    let size = kit_afla_ativo[0].mapArray.length;
    for (let i = 0; i < size; i++) {
      mapas[i] = await Workmap.getOneMap(kit_afla_ativo[0].mapArray[i]);
    }
    var cont = 0;
    //Após ter os ids dos mapas de trabalho que estão sendo utilizados roda um for para percorrer todos os mapas e um for dentro desse para acessar todas as amostras em cada mapa
    for (let j = 0; j < mapas.length; j++) {
      for(let i = 0; i < mapas[j].samplesArray.length; i++){
        amostras_afla[cont] = await Sample.getById(mapas[j].samplesArray[i]);
        cont++;
        
      }
    }
    console.log("absss");
    
   console.log(amostras_afla[0].aflatoxina.absorbance);
   console.log(amostras_afla[1].aflatoxina.absorbance);

    var Afla_log_b_b0 = new Array;
    for (let i = 0; i < amostras_afla.length; i++) {
      Afla_log_b_b0[i] = Math.log10((amostras_afla[i].aflatoxina.absorbance/Aflaabsorbance_p[0])/(1-(amostras_afla[i].aflatoxina.absorbance/Aflaabsorbance_p[0])));
      console.log("log b bo");
      console.log(Afla_log_b_b0[i]);
      
    }
  
  }



  //-----------------------------------Agora o processo se repete para todas as micotoxinas-----------------------------------------------------------------

  
  var mapas_deox = new Array;
  var amostras_deox = new Array;
  var Deoxconcentration_p = new Array;
  var DeoxAbsorbance_p = new Array;
  var kit_deox_ativo = await Kit.getActiveDeox() ;
  if(kit_deox_ativo.length != 0){
    Deoxconcentration_p[0] = kit_deox_ativo[0].calibrators.P1.concentration;
    Deoxconcentration_p[1] = kit_deox_ativo[0].calibrators.P2.concentration;
    Deoxconcentration_p[2] = kit_deox_ativo[0].calibrators.P3.concentration;
    Deoxconcentration_p[3] = kit_deox_ativo[0].calibrators.P4.concentration;
    Deoxconcentration_p[4] = kit_deox_ativo[0].calibrators.P5.concentration;
   
    DeoxAbsorbance_p[0] = kit_deox_ativo[0].calibrators.P1.absorbance;
    DeoxAbsorbance_p[1] = kit_deox_ativo[0].calibrators.P2.absorbance;
    DeoxAbsorbance_p[2] = kit_deox_ativo[0].calibrators.P3.absorbance;
    DeoxAbsorbance_p[3] = kit_deox_ativo[0].calibrators.P4.absorbance;
    DeoxAbsorbance_p[4] = kit_deox_ativo[0].calibrators.P5.absorbance;
    
    for(let i = 0; i < kit_deox_ativo[0].mapArray.length;i++){
      mapas_deox[i] = await Workmap.getOneMap(kit_deox_ativo[0].mapArray[i]);
    }
    var cont_deox = 0;
   // ATE AQUI OK console.log(mapas_deox);
    for (let j = 0; j < mapas_deox.length; j++) {
      for (let i = 0; i < mapas_deox[j].samplesArray.length; i++) {
        amostras_deox[cont_deox] = await Sample.getById(mapas_deox[j].samplesArray[i]);
        cont_deox++;
      }
    }
    var log_concentracao_deox = [Math.log10(Deoxconcentration_p[1]),Math.log10(Deoxconcentration_p[2]),Math.log10(Deoxconcentration_p[3]),Math.log10(Deoxconcentration_p[4])]; //eixo x
    var b_b0_deox = new Array; 
    var ln_b_b0_deox = new Array;
    console.log('log concentracao');
    console.log(log_concentracao_deox);
    for (var i = 0; i < 4; i++){
      b_b0_deox[i] = DeoxAbsorbance_p[i+1]/DeoxAbsorbance_p[0];
    }  
    console.log('B B0');
    console.log(b_b0_deox);
    for (var i = 0; i < b_b0_deox.length; i++) {
      ln_b_b0_deox[i] = Math.log10(b_b0_deox[i]/(1-b_b0_deox[i]));
    }
    
    console.log('ln_b_b0');
    console.log(ln_b_b0_deox);

    
    const result_deox = regression.linear([[log_concentracao_deox[0],ln_b_b0_deox[0]],[log_concentracao_deox[1],ln_b_b0_deox[1]],[log_concentracao_deox[2],ln_b_b0_deox[2]]]);
    const slope_deox = result_deox.equation[0];// slope
    const yIntercept_deox = result_deox.equation[1];// intercept
    
    console.log('slope');
    console.log(slope_deox);
    console.log('yintercept');
    console.log(yIntercept_deox);
    
    var resultado_deox = {
      intercept: yIntercept_deox,
      resultado: result_deox,
      slope: slope_deox,
    };
    var Deox_log_b_b0 = new Array;
    //log b/b0 = Math.log10((absorvanciaAmostras/AbsorvanciaP1)/(1-(absorvanciaAmostras/AbsorvanciaP1)))

  }

    
  //console.log(amostras_deox.length);
  //for (let i = 0; i < amostras_deox.length; i++) {
    //console.log(amostras_deox[i]);
  //}

 var mapas_ota = new Array;
 var amostras_ota = new Array;  
 var kit_ota_ativo = await Kit.getActiveOcra();
 //console.log(kit_ota_ativo);
 var Otaconcentration_p  = new Array;
 var OtaAbsorbance_p = new Array;
 if(kit_ota_ativo.length!= 0){
  Otaconcentration_p[0] = kit_ota_ativo[0].calibrators.P1.concentration;
  Otaconcentration_p[1] = kit_ota_ativo[0].calibrators.P2.concentration;
  Otaconcentration_p[2] = kit_ota_ativo[0].calibrators.P3.concentration;
  Otaconcentration_p[3] = kit_ota_ativo[0].calibrators.P4.concentration;
  Otaconcentration_p[4] = kit_ota_ativo[0].calibrators.P5.concentration;
 
  OtaAbsorbance_p[0] = kit_ota_ativo[0].calibrators.P1.absorbance;
  OtaAbsorbance_p[1] = kit_ota_ativo[0].calibrators.P2.absorbance;
  OtaAbsorbance_p[2] = kit_ota_ativo[0].calibrators.P3.absorbance;
  OtaAbsorbance_p[3] = kit_ota_ativo[0].calibrators.P4.absorbance;
  OtaAbsorbance_p[4] = kit_ota_ativo[0].calibrators.P5.absorbance;


 
  for (let i = 0; i < kit_ota_ativo[0].mapArray.length; i++) {
    mapas_ota[i] = await Workmap.getOneMap(kit_ota_ativo[0].mapArray[i]);
  }
  var cont_ota = 0;
  for (let j = 0; j < mapas_ota.length; j++) {
    for (let i = 0; i < mapas_ota[j].samplesArray.length; i++) {
      amostras_ota[cont_ota] = await Sample.getById(mapas_ota[j].samplesArray[i]);
      cont_ota++;
      console.log('0000000000000000');
      
      console.log(amostras_ota);
      
    }
  }
  var log_concentracao_ota = [Math.log10(Otaconcentration_p[1]),Math.log10(Otaconcentration_p[2]),Math.log10(Otaconcentration_p[3]),Math.log10(Otaconcentration_p[4])];
  var b_b0_ota = new Array;
  var ln_b_b0_ota = new Array;
  console.log('log concentracao');
  console.log(log_concentracao_ota);
  for (var i = 0; i < 4; i++){
    b_b0_ota[i] = OtaAbsorbance_p[i+1]/OtaAbsorbance_p[0];
  }  
  console.log('B B0');
  
  console.log(b_b0_ota);

  
  for (var i = 0; i < b_b0_ota.length; i++) {
    ln_b_b0_ota[i] = Math.log10(b_b0_ota[i]/(1-b_b0_ota[i]));
  }
  console.log('ln_b_b0');
  console.log(ln_b_b0_ota);
  

  const result_ota = regression.linear([[log_concentracao_ota[0],ln_b_b0_ota[0]],[log_concentracao_ota[1],ln_b_b0_ota[1]],[log_concentracao_ota[2],ln_b_b0_ota[2]]]);
  const slope_ota = result_ota.equation[0];// slope
  const yIntercept_ota = result_ota.equation[1];// intercept
  
  console.log('slope');
  console.log(slope_ota);
  console.log('yintercept');
  console.log(yIntercept_ota);

  var resultado_ota = {
    intercept: yIntercept_ota,
    resultado: result_ota,
    slope: slope_ota,
  };
  var Ota_log_b_b0 = new Array;
  //log b/b0 = Math.log10((absorvanciaAmostras/AbsorvanciaP1)/(1-(absorvanciaAmostras/AbsorvanciaP1)))
  for (let i = 0; i < amostras_ota.length; i++) {
    Ota_log_b_b0[i] = Math.log10((amostras_ota[i].ocratoxina.absorbance/OtaAbsorbance_p[0])/(1-(amostras_ota[i].ocratoxina.absorbance/OtaAbsorbance_p [0])));
    
  }
  console.log(Ota_log_b_b0);

}



var mapas_t2 = new Array;
var amostras_t2 = new Array;
var kit_t2_ativo = await Kit.getActiveT2();
var T2concentration_p  = new Array;
var T2absorbance_p = new Array;

if(kit_t2_ativo.length != 0){
  T2concentration_p[0] = kit_t2_ativo[0].calibrators.P1.concentration;
  T2concentration_p[1] = kit_t2_ativo[0].calibrators.P2.concentration;
  T2concentration_p[2] = kit_t2_ativo[0].calibrators.P3.concentration;
  T2concentration_p[3] = kit_t2_ativo[0].calibrators.P4.concentration;
  T2concentration_p[4] = kit_t2_ativo[0].calibrators.P5.concentration;
 
  T2absorbance_p[0] = kit_t2_ativo[0].calibrators.P1.absorbance;
  T2absorbance_p[1] = kit_t2_ativo[0].calibrators.P2.absorbance;
  T2absorbance_p[2] = kit_t2_ativo[0].calibrators.P3.absorbance;
  T2absorbance_p[3] = kit_t2_ativo[0].calibrators.P4.absorbance;
  T2absorbance_p[4] = kit_t2_ativo[0].calibrators.P5.absorbance;

  for (let i = 0; i < kit_t2_ativo[0].mapArray.length; i++) {
    mapas_t2[i] = await Workmap.getOneMap(kit_t2_ativo[0].mapArray[i]);
  }
  var cont_t2 = 0;
  for (let j = 0; j < mapas_t2.length; j++) {
    for (let i = 0; i < mapas_t2[j].samplesArray.length; i++) {
      amostras_t2[cont_t2] = await Sample.getById(mapas_t2[j].samplesArray[i]);
      cont_t2++;
    }
  }
  
  var log_concentracao_t2 = [Math.log10(T2concentration_p[1]),Math.log10(T2concentration_p[2]),Math.log10(T2concentration_p[3]),Math.log10(T2concentration_p[4])]; //eixo x
  var b_b0_t2 = new Array; 
  var ln_b_b0_t2 = new Array;
  console.log('log concentracao');
  console.log(log_concentracao_t2);
  for (var i = 0; i < 4; i++){
    b_b0_t2[i] = T2absorbance_p[i+1]/T2absorbance_p[0];
  }  
  console.log('B B0');
    
  console.log(b_b0_t2);
  for (var i = 0; i < b_b0_t2.length; i++) {
    ln_b_b0_t2[i] = Math.log10(b_b0_t2[i]/(1-b_b0_t2[i]));
  }

  
  console.log('ln_b_b0');
  console.log(ln_b_b0_t2);

  const result_t2 = regression.linear([[log_concentracao[0],ln_b_b0[0]],[log_concentracao[1],ln_b_b0[1]],[log_concentracao[2],ln_b_b0[2]]]);
  const slope_t2 = result_t2.equation[0];// slope
  const yIntercept_t2 = result_t2.equation[1];// intercept
  console.log('slope');
  console.log(slope_t2);
  console.log('yintercept');
  console.log(yIntercept_t2);

  var resultado_t2 = {
    intercept: yIntercept_t2,
    resultado: result_t2,
    slope: slope_t2,
  };


  var T2_log_b_b0 = new Array;
  //log b/b0 = Math.log10((absorvanciaAmostras/AbsorvanciaP1)/(1-(absorvanciaAmostras/AbsorvanciaP1)))
  for (let i = 0; i < amostras_t2.length; i++) {
    T2_log_b_b0[i] = Math.log10((amostras_t2[i].t2toxina.absorbance/T2absorbance_p[0])/(1-(amostras_t2[i].t2toxina.absorbance/T2absorbance_p[0])));
  }
  console.log(T2_log_b_b0);
      

}

var Zeaconcentration_p  = new Array;
var ZeaAbsorbance_p = new Array;
var mapas_zea = new Array;
var amostras_zea = new Array;
var kit_zea_ativo = await Kit.getActiveZea();
if(kit_zea_ativo.length !=0){
  Zeaconcentration_p[0] = kit_zea_ativo[0].calibrators.P1.concentration;
  Zeaconcentration_p[1] = kit_zea_ativo[0].calibrators.P2.concentration;
  Zeaconcentration_p[2] = kit_zea_ativo[0].calibrators.P3.concentration;
  Zeaconcentration_p[3] = kit_zea_ativo[0].calibrators.P4.concentration;
  Zeaconcentration_p[4] = kit_zea_ativo[0].calibrators.P5.concentration;
 
  ZeaAbsorbance_p[0] = kit_zea_ativo[0].calibrators.P1.absorbance;
  ZeaAbsorbance_p[1] = kit_zea_ativo[0].calibrators.P2.absorbance;
  ZeaAbsorbance_p[2] = kit_zea_ativo[0].calibrators.P3.absorbance;
  ZeaAbsorbance_p[3] = kit_zea_ativo[0].calibrators.P4.absorbance;
  ZeaAbsorbance_p[4] = kit_zea_ativo[0].calibrators.P5.absorbance;
  

  for (let i = 0; i < kit_zea_ativo[0].mapArray.length; i++) {
    mapas_zea[i] = await Workmap.getOneMap(kit_zea_ativo[0].mapArray[i]);
  }
  var cont_zea = 0;
  for (let j = 0; j < mapas_zea.length; j++) {
    for (let i = 0; i < mapas_zea[j].samplesArray.length; i++) {
      amostras_zea[cont_zea] = await Sample.getById(mapas_zea[j].samplesArray[i]);
      cont_zea++;
    }
  }
  var log_concentracao_zea = [Math.log10(Zeaconcentration_p[1]),Math.log10(Zeaconcentration_p[2]),Math.log10(Zeaconcentration_p[3]),Math.log10(Zeaconcentration_p[4])]; //eixo x
  var b_b0_zea = new Array; 
  var ln_b_b0_zea = new Array;
  console.log('log concentracao');
  console.log(log_concentracao_zea);
  for (var i = 0; i < 4; i++){
    b_b0_zea[i] = ZeaAbsorbance_p[i+1]/ZeaAbsorbance_p[0];
  }  
  
  console.log('B B0');
    
  console.log(b_b0_zea);

  for (var i = 0; i < b_b0_zea.length; i++) {
    ln_b_b0_zea[i] = Math.log10(b_b0_zea[i]/(1-b_b0_zea[i]));
  }
  

  console.log('ln_b_b0');
  console.log(ln_b_b0_zea);
  
  const result_zea = regression.linear([[log_concentracao_zea[0],ln_b_b0_zea[0]],[log_concentracao_zea[1],ln_b_b0_zea[1]],[log_concentracao_zea[2],ln_b_b0_zea[2]]]);
  const slope_zea = result_zea.equation[0];// slope
  const yIntercept_zea = result_zea.equation[1];// intercept
  
  console.log('slope');
  console.log(slope_zea);
  console.log('yintercept');
  console.log(yIntercept_zea);

  var resultado_zea = {
    intercept: yIntercept_zea,
    resultado: result_zea,
    slope: slope_zea,
  };

  var Zea_log_b_b0 = new Array;
    //log b/b0 = Math.log10((absorvanciaAmostras/AbsorvanciaP1)/(1-(absorvanciaAmostras/AbsorvanciaP1)))
    for (let i = 0; i < amostras_zea.length; i++) {
      Zea_log_b_b0[i] = Math.log10((amostras_zea[i].zearalenona.absorbance/ZeaAbsorbance_p[0])/(1-(amostras_zea[i].zearalenona.absorbance/ZeaAbsorbance_p[0])));
    }

 console.log(Zea_log_b_b0);


}

  var Fbsconcentration_p  = new Array;
  var Fbsabsorbance_p = new Array;
  var mapas_fbs = new Array;
  var amostras_fbs = new Array;
  var kit_fbs_ativo = await Kit.getActiveFum();
  if(kit_fbs_ativo.length != 0 ){
    Fbsconcentration_p[0] = kit_fbs_ativo[0].calibrators.P1.concentration;
    Fbsconcentration_p[1] = kit_fbs_ativo[0].calibrators.P2.concentration;
    Fbsconcentration_p[2] = kit_fbs_ativo[0].calibrators.P3.concentration;
    Fbsconcentration_p[3] = kit_fbs_ativo[0].calibrators.P4.concentration;
    Fbsconcentration_p[4] = kit_fbs_ativo[0].calibrators.P5.concentration;
   
    Fbsabsorbance_p[0] = kit_fbs_ativo[0].calibrators.P1.absorbance;
    Fbsabsorbance_p[1] = kit_fbs_ativo[0].calibrators.P2.absorbance;
    Fbsabsorbance_p[2] = kit_fbs_ativo[0].calibrators.P3.absorbance;
    Fbsabsorbance_p[3] = kit_fbs_ativo[0].calibrators.P4.absorbance;
    Fbsabsorbance_p[4] = kit_fbs_ativo[0].calibrators.P5.absorbance;

    for (let i = 0; i < kit_fbs_ativo[0].mapArray.length; i++) {
      mapas_fbs[i]= await Workmap.getOneMap(kit_fbs_ativo[0].mapArray[i]);
    }
    var cont_fbs = 0;
    for (let j = 0; j < mapas_fbs.length; j++) {
      for (let i = 0; i < mapas_fbs[j].samplesArray.length; i++) {
        amostras_fbs[cont_fbs] = await Sample.getById(mapas_fbs[j].samplesArray[i]);
        
      }
    }
    
    var log_concentracao_fbs = [Math.log10(Fbsconcentration_p[1]),Math.log10(Fbsconcentration_p[2]),Math.log10(Fbsconcentration_p[3]),Math.log10(Fbsconcentration_p[4])]; //eixo x
    var b_b0_fbs = new Array; 
    var ln_b_b0_fbs = new Array;
    console.log('log concentracao');
    console.log(log_concentracao_fbs);
    for (var i = 0; i < 4; i++){
      b_b0_fbs[i] = Fbsabsorbance_p[i+1]/Fbsabsorbance_p[0];
    }  
    console.log('B B0');
    
    console.log(b_b0_fbs);
    for (var i = 0; i < b_b0_fbs.length; i++) {
      ln_b_b0_fbs[i] = Math.log10(b_b0_fbs[i]/(1-b_b0_fbs[i]));
    }
    
  
    console.log('ln_b_b0');
    console.log(ln_b_b0_fbs);
    const result_fbs = regression.linear([[log_concentracao_fbs[0],ln_b_b0_fbs[0]],[log_concentracao_fbs[1],ln_b_b0_fbs[1]],[log_concentracao_fbs[2],ln_b_b0_fbs[2]]]);
    const slope_fbs = result_fbs.equation[0];// slope
    const yIntercept_fbs = result_fbs.equation[1];// intercept
    
    console.log('slope');
    console.log(slope_fbs);
    console.log('yintercept');
    console.log(yIntercept_fbs);

    var resultado_fbs = {
      intercept: yIntercept_fbs,
      resultado: result_fbs,
      slope: slope_fbs,
    };
    
    var Fbs_log_b_b0 = new Array;
    //log b/b0 = Math.log10((absorvanciaAmostras/AbsorvanciaP1)/(1-(absorvanciaAmostras/AbsorvanciaP1)))
    for (let i = 0; i < amostras_fbs.length; i++) {
      Fbs_log_b_b0[i] = Math.log10((amostras_fbs[i].fumonisina.absorbance/Fbsabsorbance_p[0])/(1-(amostras_fbs[i].fumonisina.absorbance/Fbsabsorbance_p[0])));
      
    }
    console.log(Fbs_log_b_b0);
  
  }

 

  
  
   var deox_p = new Array;
   var deox_array = new Array;
  //  Kit.getActiveDeox().then((deoxArray)=>{ 
    //  let deoxKit= deoxArray[0];
    //  deox_p[0] = deoxKit.calibrators.P1;
    //  deox_p[1] = deoxKit.calibrators.P2;
    //  deox_p[2] = deoxKit.calibrators.P3;
    //  deox_p[3] = deoxKit.calibrators.P4;
    //  deox_p[4] = deoxKit.calibrators.P5;

    //  var b_b0 = new Array;
    //  var ln_b_b0 = new Array; // eixo y
    //  cont_b0 = 0;
    //  var log_concentracao = [Math.log10(4),Math.log10(10),Math.log10(20),Math.log10(40)]; //eixo x
    //  for (var i = 0; i < 4; i++){
    //    b_b0[cont_b0] = aflas_p[i+1].absorbance/aflas_p[0].absorbance;
    //    cont_b0++;
    //  }  
    //  for (var i = 0; i < b_b0.length; i++) {
    //   ln_b_b0[i] = Math.log10(b_b0[i]/(1-b_b0[i]));
    // }
    // const result = regression.linear([[log_concentracao[0],ln_b_b0[0]],[log_concentracao[1],ln_b_b0[1]],[log_concentracao[2],ln_b_b0[2]]]);
    // const slope = result.equation[0];// slope
    // const yIntercept = result.equation[1];// intercept
    // const result2 = regression.linear([[ln_b_b0[0],log_concentracao[0]],[ln_b_b0[1],log_concentracao[1]],[ln_b_b0[2],log_concentracao[2]]]);
    // const gradient2 = result2.equation[0];
    // const yIntercp2 = result2.equation[1];
    // const fifty_inhibition = Math.pow(10,yIntercp2); //50% inhibition

  //  }).catch((error)=>{
  //   console.log(error);
  // });

  //teste kit afla
 

    // console.log(aflaArray[0].calibrators.P1.sampleID);
    //console.log(aflaArray[0].stockMin);
    //console.log('--------------------------------------');
    //console.log(aflaArray[0].mapArray[0]);
     //   console.log(sample_array[i]);
        
   //console.log(aflas_p);

 

 // console.log(aflas_p[0].aflatoxina.absorbance); //abs afla calibrator


  // var b_b0 = new Array;
  // var ln_b_b0 = new Array; // eixo y
  // cont_b0 = 0;
  // var log_concentracaco = [Math.log10(4),Math.log10(10),Math.log10(20),Math.log10(40)]; //eixo x
  // for (var i = 0; i < 4; i++){
  //   b_b0[cont_b0] = aflas_p[i+1].absorbance/aflas_p[0].absorbance;
  //   cont_b0++;
  // }
 // console.log(b_b0);
  
//console.log(b_b0);
  //for (var i = 0; i < b_b0.length; i++) {
   // ln_b_b0[i] = Math.log10(b_b0[i]/(1-b_b0[i]));
 // }
  // const result = regression.linear([[log_concentracao[0],ln_b_b0[0]],[log_concentracao[1],ln_b_b0[1]],[log_concentracao[2],ln_b_b0[2]]]);
  // const slope = result.equation[0];// slope
  // const yIntercept = result.equation[1];// intercept
  // const result2 = regression.linear([[ln_b_b0[0],log_concentracao[0]],[ln_b_b0[1],log_concentracao[1]],[ln_b_b0[2],log_concentracao[2]]]);
  // const gradient2 = result2.equation[0];
  // const yIntercp2 = result2.equation[1];
  // const fifty_inhibition = Math.pow(10,yIntercp2); //50% inhibition
  // //console.log(result);
  //console.log('------------');
  //console.log(slope);
  //console.log('__________');
  //console.log(yIntercept);
  //console.log('_______________________');
  //console.log(fifty_inhibition);var resultados = {}

  // resultados[0] = { name: 'AFLA', result: Aflaconcentration_p };
  // resultados[1] = { name: 'DEOX', result: Fbsabsorbance_p };
  // resultados[2] = { name: 'OTA', result: yIntercept };
  // resultados[3] = { name: 'T2', result: slope };
  // resultados[4] = { name: 'ZEA', result: result };

  // res.render('sampleresult', { title: 'Curvas de Calibração', resultados });
  

  // name: "",
  // absorvancia: "",
  // concentracao: "",


  var toxinas = {}

  toxinas[0] = { 
    name: 'AFLA', 
    calibradores: {},
    valores: resultado_afla
  };

  toxinas[1] = { 
    name: 'DEOX', 
    calibradores: {},
    valores: resultado_deox
  };

  toxinas[2] = { 
    name: 'OTA', 
    calibradores: {},
    valores: resultado_ota
  };

  toxinas[3] = { 
    name: 'T2', 
    calibradores: {},
    valores: resultado_t2
  };

  toxinas[4] = { 
    name: 'ZEA', 
    calibradores: {},
    valores: resultado_zea
  };

  toxinas[5] = { 
    name: 'FBS', 
    calibradores: {},
    valores: resultado_fbs
  };

  for (i = 0; i < 6; i++){
    for (j = 0; j < 5; j++){
      console.log("Variaveis - i: " + i + " ; j: " + j + ". ");
      toxinas[i].calibradores[j] = {calname: "P" + (j+1)};
      console.log(toxinas[i].calibradores[j].calname);
      if (i == 0){
        toxinas[i].calibradores[j] = {concentracao: Aflaconcentration_p[j], absorvancia: Aflaabsorbance_p[j], calname: "P" + (j+1)};
      } else if (i == 1) {
        toxinas[i].calibradores[j] = {concentracao: Deoxconcentration_p[j], absorvancia: DeoxAbsorbance_p[j], calname: "P" + (j+1)};
      } else if (i == 2) {
        toxinas[i].calibradores[j] = {concentracao: Otaconcentration_p[j], absorvancia: OtaAbsorbance_p[j], calname: "P" + (j+1)};
      } else if (i == 3) {
        toxinas[i].calibradores[j] = {concentracao: T2concentration_p[j], absorvancia: T2absorbance_p[j], calname: "P" + (j+1)};
      } else if (i == 4) {
        toxinas[i].calibradores[j] = {concentracao: Zeaconcentration_p[j], absorvancia: ZeaAbsorbance_p[j], calname: "P" + (j+1)};
      } else if (i == 5) {
        toxinas[i].calibradores[j] = {concentracao: Fbsconcentration_p[j], absorvancia: Fbsabsorbance_p[j], calname: "P" + (j+1)};
      } else {
        console.log("Erro de tamanho de for");
      }  
    }
  }

  console.log("Imprimir todas as toxinas: ");
  console.log(toxinas);

  console.log("Imprimir calibrador AFLA P2: ");
  console.log(toxinas[0].calibradores[1]);

  console.log("Imprimir todos calibradores de AFLA: ");
  console.log(toxinas[0].calibradores);

  console.log("Imprimir numero do calibrador P1 de AFLA: ");
  console.log(toxinas[0].calibradores[0].calname);

  console.log("Imprimir numero de absorvancia do calibrador P1 de AFLA: ");
  console.log(toxinas[0].calibradores[0].absorvancia);

  console.log("Imprimir valor do resultado do calibrador 1 de AFLA")
  console.log(toxinas[0].valores.resultado);

  console.log("Tipo")
  console.log(typeof toxinas[0].valores.resultado);
  res.render('calibrationcurves', { title: 'Curvas de Calibração', toxinas });
})

 
module.exports = router;
