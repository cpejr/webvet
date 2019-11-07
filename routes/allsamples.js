
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
const Sample=require('../models/sample');


router.get('/', (req, res) => {
  Kit.getActiveAfla().then((aflaArray)=>{
    var aflaKit=aflaArray[0];
    var last_filled=0;
    var counter=0;

    aflaKit.mapArray.forEach((mapid)=>{
    Workmap.getOneMap(mapid).then((workmap)=>{
      counter++;
      if(workmap.samplesArray.length>0) {
        last_filled=counter;
        
      }
      if(counter==aflaKit.mapArray.length-1) {
        aflaKit.amount=aflaKit.amount-last_filled;
        aflaKit.toxinaStart=last_filled;
        Kit.update(aflaKit._id,aflaKit).catch((err)=>{
          console.log(err);
        });
      }
      
     });
    }); 
  }).catch((error)=>{
    console.log(error);
  });

  Kit.getActiveDeox().then((deoxArray)=>{ 
    var deoxKit=deoxArray[0];
    var last_filled=0;
    var counter=0;
    deoxKit.mapArray.forEach((mapid)=>{
    Workmap.getOneMap(mapid).then((workmap)=>{
      counter++;
      console.log(counter);
      console.log("_____________________________________________");
      if(workmap.samplesArray.length>0) {
        last_filled=counter;
        console.log(last_filled);
        console.log("--------------------------------------------------------")
        
      }
      if(counter==deoxKit.mapArray.length-1) {
        deoxKit.amount=deoxKit.amount-last_filled;
        deoxKit.toxinaStart=last_filled;
        Kit.update(deoxKit._id,deoxKit).catch((err)=>{
          console.log(err);
        });
      }
      
     });
    }); 
  }).catch((error)=>{
    console.log(error);
  });
  
 
  var calib_afla_id = new Array;
  var calib_don_id = new Array;
  var calib_ocra_id = new Array;
  var calib_t2_id = new Array;
  var calib_zea_id = new Array;
  var calib_fbs_id = new Array;
  var aflas_p = new Array;
  var don_p = new Array;
  var ocra_p = new Array;
  var t2_p = new Array;
  var zea_p = new Array;
  var fbs_p = new Array;
  Sample.getAll().then((amostras)=>{
  Kit.getAll().then((kit)=>{
    for (let i = 0; i < kit.length; i++){
      kitToxin=kit[i].productCode;
      if(kit[i].active){
        if(kitToxin.includes("AFLA")||kitToxin.includes("Afla") ) { 
          calib_afla_id[0] = kit[i].calibrators.P1.sampleID; 
          calib_afla_id[1] = kit[i].calibrators.P2.sampleID;
          calib_afla_id[2] = kit[i].calibrators.P3.sampleID;
          calib_afla_id[3] = kit[i].calibrators.P4.sampleID;
          calib_afla_id[4] = kit[i].calibrators.P5.sampleID;
        }
      }
      if(kitToxin.includes("DON")) {
        calib_don_id[0] = kit[i].calibrators.P1.sampleID;
        calib_don_id[1] = kit[i].calibrators.P2.sampleID;
        calib_don_id[2] = kit[i].calibrators.P3.sampleID;
        calib_don_id[3] = kit[i].calibrators.P4.sampleID;
        calib_don_id[4] = kit[i].calibrators.P5.sampleID;
      }
      if(kitToxin.includes("OTA")||kitToxin.includes("Och")) {
        calib_ocra_id[0] = kit[i].calibrators.P1.sampleID;
        calib_ocra_id[1] = kit[i].calibrators.P2.sampleID;
        calib_ocra_id[2] = kit[i].calibrators.P3.sampleID;
        calib_ocra_id[3] = kit[i].calibrators.P4.sampleID;
        calib_ocra_id[4] = kit[i].calibrators.P5.sampleID;
      }
      if(kitToxin.includes("T2")) {
        calib_t2_id[0] = kit[i].calibrators.P1.sampleID;
        calib_t2_id[1] = kit[i].calibrators.P2.sampleID;
        calib_t2_id[2] = kit[i].calibrators.P3.sampleID;
        calib_t2_id[3] = kit[i].calibrators.P4.sampleID;
        calib_t2_id[4] = kit[i].calibrators.P5.sampleID;
      }

      if(kitToxin.includes("ZEA")||kitToxin.includes("Zea")) {
        calib_zea_id[0] = kit[i].calibrators.P1.sampleID;
        calib_zea_id[1] = kit[i].calibrators.P2.sampleID;
        calib_zea_id[2] = kit[i].calibrators.P3.sampleID;
        calib_zea_id[3] = kit[i].calibrators.P4.sampleID;
        calib_zea_id[4] = kit[i].calibrators.P5.sampleID;
      }

      if(kitToxin.includes("FUMO")||kitToxin.includes("Fum")) {
        calib_fbs_id[0] = kit[i].calibrators.P1.sampleID;
        calib_fbs_id[1] = kit[i].calibrators.P2.sampleID;
        calib_fbs_id[2] = kit[i].calibrators.P3.sampleID;
        calib_fbs_id[3] = kit[i].calibrators.P4.sampleID;
        calib_fbs_id[4] = kit[i].calibrators.P5.sampleID;
      }
    }
      Sample.getById(calib_afla_id[0]).then((p1)=>{
        aflas_p[0]=p1;
        Sample.getById(calib_afla_id[1]).then((p2)=>{
          aflas_p[1]=p2;
          Sample.getById(calib_afla_id[2]).then((p3)=>{ 
            aflas_p[2]=p3;
              Sample.getById(calib_afla_id[3]).then((p4)=>{
                aflas_p[3] = p4;
                Sample.getById(calib_afla_id[4]).then((p5)=>{
                    aflas_p[4]=p5;
                    
              Sample.getById(calib_don_id[0]).then((p1_d)=>{
                don_p[0]=p1_d;
                Sample.getById(calib_don_id[1]).then((p2_d)=>{
                  don_p[1]=p2_d;
                  Sample.getById(calib_don_id[2]).then((p3_d)=>{ 
                    don_p[2]=p3_d;
                      Sample.getById(calib_don_id[3]).then((p4_d)=>{
                        don_p[3] = p4_d;
                        Sample.getById(calib_don_id[4]).then((p5_d)=>{
                          don_p[4]=p5_d;
                          
                          Sample.getById(calib_ocra_id[0]).then((p1_o)=>{
                            ocra_p[0]=p1_o;
                            Sample.getById(calib_ocra_id[1]).then((p2_o)=>{
                              ocra_p[1]=p2_o;
                              Sample.getById(calib_ocra_id[2]).then((p3_o)=>{ 
                                ocra_p[2]=p3_o;
                                  Sample.getById(calib_ocra_id[3]).then((p4_o)=>{
                                    ocra_p[3] = p4_o;
                                    Sample.getById(calib_ocra_id[4]).then((p5_o)=>{
                                      ocra_p[4]=p5_o;
                                      
                                      Sample.getById(calib_t2_id[0]).then((p1_t)=>{
                                        t2_p[0]=p1_t;
                                        Sample.getById(calib_t2_id[1]).then((p2_t)=>{
                                          t2_p[1]=p2_t;
                                          Sample.getById(calib_t2_id[2]).then((p3_t)=>{ 
                                            t2_p[2]=p3_t;
                                              Sample.getById(calib_t2_id[3]).then((p4_t)=>{
                                                t2_p[3] = p4_t;
                                                Sample.getById(calib_t2_id[4]).then((p5_t)=>{
                                                  t2_p[4]=p5_t;   
     
                                                  Sample.getById(calib_zea_id[0]).then((p1_z)=>{
                                                    zea_p[0]=p1_z;
                                                    Sample.getById(calib_zea_id[1]).then((p2_z)=>{
                                                      zea_p[1]=p2_z;
                                                      Sample.getById(calib_zea_id[2]).then((p3_z)=>{ 
                                                        zea_p[2]=p3_z;
                                                          Sample.getById(calib_zea_id[3]).then((p4_z)=>{
                                                            zea_p[3] = p4_z;
                                                            Sample.getById(calib_zea_id[4]).then((p5_z)=>{
                                                              zea_p[4]=p5_z;   
                                                              
                                                              
                                                                Sample.getById(calib_fbs_id[0]).then((p1_f)=>{
                                                                  fbs_p[0]=p1_f;
                                                                  Sample.getById(calib_fbs_id[1]).then((p2_f)=>{
                                                                    fbs_p[1]=p2_f;
                                                                    Sample.getById(calib_fbs_id[2]).then((p3_f)=>{ 
                                                                      fbs_p[2]=p3_f;
                                                                        Sample.getById(calib_fbs_id[3]).then((p4_f)=>{
                                                                          fbs_p[3] = p4_f;
                                                                          Sample.getById(calib_fbs_id[4]).then((p5_f)=>{
                                                                            fbs_p[4]=p5_f;   
    

 
    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var scnds = today.getSeconds();

    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
 
    var afla1 = new Array;
    var don1 = new Array;
    var ota1 = new Array;
    var t2 = new Array;
    var zea = new Array;
    var fbs = new Array;
    var aflamap = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var donmap = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var otamap = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var t2map = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var zeamap = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var fbsmap = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var cont_afla = 0;
    var cont_don = 0;
    var cont_ota = 0;
    var cont_t2 = 0;
    var cont_zea = 0;
    var cont_fbs = 0;


    //so para salvar os espaços


    for (let i = 0; i < amostras.length; i++) {
      if(amostras[i].aflatoxina.active == true){

        if(amostras[i].aflatoxina.mapReference == '_workmap1' && aflamap[0] == 0){
          afla1[cont_afla] = amostras[i];
          cont_afla++;
          aflamap[0] = 1;
        }
        else if(amostras[i].aflatoxina.mapReference == '_workmap2'&& aflamap[1] == 0){
          afla1[cont_afla] = amostras[i];
          cont_afla++;
          aflamap[1] = 1;
        }
        else if(amostras[i].aflatoxina.mapReference == '_workmap3'&& aflamap[2] == 0){
          afla1[cont_afla] = amostras[i];
          cont_afla++;
          aflamap[2] = 1;
        }
        else if(amostras[i].aflatoxina.mapReference == '_workmap4'&& aflamap[3] == 0){
          afla1[cont_afla] = amostras[i];
          cont_afla++;
          aflamap[3] = 1;
        }
        else if(amostras[i].aflatoxina.mapReference == '_workmap5'&& aflamap[4] == 0){
          afla1[cont_afla] = amostras[i];
          cont_afla++;
          aflamap[4] = 1;
        }
        else if(amostras[i].aflatoxina.mapReference == '_workmap6'&& aflamap[5] == 0){
          afla1[cont_afla] = amostras[i];
          cont_afla++;
          aflamap[5] = 1;
        }
        else if(amostras[i].aflatoxina.mapReference == '_workmap7'&& aflamap[6] == 0){
          afla1[cont_afla] = amostras[i];
          cont_afla++;
          aflamap[6] = 1;
        }
        else if(amostras[i].aflatoxina.mapReference == '_workmap8'&& aflamap[7] == 0){
          afla1[cont_afla] = amostras[i];
          cont_afla++;
          aflamap[7] = 1;
        }
        else if(amostras[i].aflatoxina.mapReference == '_workmap9'&& aflamap[8] == 0){
          afla1[cont_afla] = amostras[i];
          cont_afla++;
          aflamap[8] = 1;
        }
        else if(amostras[i].aflatoxina.mapReference == '_workmap9'&& aflamap[8] == 0){
          afla1[cont_afla] = amostras[i];
          cont_afla++;
          aflamap[8] = 1;
        }
        else if(amostras[i].aflatoxina.mapReference == '_workmap10'&& aflamap[9] == 0){
          afla1[cont_afla] = amostras[i];
          cont_afla++;
          aflamap[9] = 1;
        }
        else if(amostras[i].aflatoxina.mapReference == '_workmap11'&& aflamap[10] == 0){
          afla1[cont_afla] = amostras[i];
          cont_afla++;
          aflamap[10] = 1;
        }
        else if(amostras[i].aflatoxina.mapReference == '_workmap12'&& aflamap[11] == 0){
          afla1[cont_afla] = amostras[i];
          cont_afla++;
          aflamap[11] = 1;
        }
        else if(amostras[i].aflatoxina.mapReference == '_workmap13'&& aflamap[12] == 0){
          afla1[cont_afla] = amostras[i];
          cont_afla++;
          aflamap[12] = 1;
        }
        else if(amostras[i].aflatoxina.mapReference == '_workmap14'&& aflamap[13] == 0){
          afla1[cont_afla] = amostras[i];
          cont_afla++;
          aflamap[13] = 1;
        }
        else if(amostras[i].aflatoxina.mapReference == '_workmap15'&& aflamap[14] == 0){
          afla1[cont_afla] = amostras[i];
          cont_afla++;
          aflamap[14] = 1;
        }
        else if(amostras[i].aflatoxina.mapReference == '_workmap16'&& aflamap[15] == 0){
          afla1[cont_afla] = amostras[i];
          cont_afla++;
          aflamap[15] = 1;
        }
      }
    }




      //salvas os espaços
      for (let i = 0; i < amostras.length; i++) {
        if(amostras[i].deoxinivalenol.active == true){


          if(amostras[i].deoxinivalenol.mapReference == '_workmap1' && donmap[0] == 0){
            don1[cont_don] = amostras[i];
            cont_don++;
            donmap[0] = 1;
          }
          else if(amostras[i].deoxinivalenol.mapReference == '_workmap2'&& donmap[1] == 0){
            don1[cont_don] = amostras[i];
            cont_don++;
            donmap[1] = 1;
          }
          else if(amostras[i].deoxinivalenol.mapReference == '_workmap3'&& donmap[2] == 0){
            don1[cont_don] = amostras[i];
            cont_don++;
            donmap[2] = 1;
          }
          else if(amostras[i].deoxinivalenol.mapReference == '_workmap4'&& donmap[3] == 0){
            don1[cont_don] = amostras[i];
            cont_don++;
            donmap[3] = 1;
          }
          else if(amostras[i].deoxinivalenol.mapReference == '_workmap5'&& donmap[4] == 0){
            don1[cont_don] = amostras[i];
            cont_don++;
            donmap[4] = 1;
          }
          else if(amostras[i].deoxinivalenol.mapReference == '_workmap6'&& donmap[5] == 0){
            don1[cont_don] = amostras[i];
            cont_don++;
            donmap[5] = 1;
          }
          else if(amostras[i].deoxinivalenol.mapReference == '_workmap7'&& donmap[6] == 0){
            don1[cont_don] = amostras[i];
            cont_don++;
            donmap[6] = 1;
          }
          else if(amostras[i].deoxinivalenol.mapReference == '_workmap8'&& donmap[7] == 0){
            don1[cont_don] = amostras[i];
            cont_don++;
            donmap[7] = 1;
          }
          else if(amostras[i].deoxinivalenol.mapReference == '_workmap9'&& donmap[8] == 0){
            don1[cont_don] = amostras[i];
            cont_don++;
            donmap[8] = 1;
          }
          else if(amostras[i].deoxinivalenol.mapReference == '_workmap9'&& donmap[8] == 0){
            don1[cont_don] = amostras[i];
            cont_don++;
            donmap[8] = 1;
          }
          else if(amostras[i].deoxinivalenol.mapReference == '_workmap10'&& donmap[9] == 0){
            don1[cont_don] = amostras[i];
            cont_don++;
            donmap[9] = 1;
          }
          else if(amostras[i].deoxinivalenol.mapReference == '_workmap11'&& donmap[10] == 0){
            don1[cont_don] = amostras[i];
            cont_don++;
            donmap[10] = 1;
          }
          else if(amostras[i].deoxinivalenol.mapReference == '_workmap12'&& donmap[11] == 0){
            don1[cont_don] = amostras[i];
            cont_don++;
            donmap[11] = 1;
          }
          else if(amostras[i].deoxinivalenol.mapReference == '_workmap13'&& donmap[12] == 0){
            don1[cont_don] = amostras[i];
            cont_don++;
            donmap[12] = 1;
          }
          else if(amostras[i].deoxinivalenol.mapReference == '_workmap14'&& donmap[13] == 0){
            don1[cont_don] = amostras[i];
            cont_don++;
            donmap[13] = 1;
          }
          else if(amostras[i].deoxinivalenol.mapReference == '_workmap15'&& donmap[14] == 0){
            don1[cont_don] = amostras[i];
            cont_don++;
            donmap[14] = 1;
          }
          else if(amostras[i].deoxinivalenol.mapReference == '_workmap16'&& donmap[15] == 0){
            don1[cont_don] = amostras[i];
            cont_don++;
            donmap[15] = 1;
          }
        }
      }




//salvas os espaços
      for (let i = 0; i < amostras.length; i++) {
        if(amostras[i].ocratoxina.active == true){
          if(amostras[i].ocratoxina.mapReference == '_workmap1' && otamap[0] == 0){
            ota1[cont_ota] = amostras[i];
            cont_ota++;
            otamap[0] = 1;
          }
          else if(amostras[i].ocratoxina.mapReference == '_workmap2'&& otamap[1] == 0){
            ota1[cont_ota] = amostras[i];
            cont_ota++;
            otamap[1] = 1;
          }
          else if(amostras[i].ocratoxina.mapReference == '_workmap3'&& otamap[2] == 0){
            ota1[cont_ota] = amostras[i];
            cont_ota++;
            otamap[2] = 1;
          }
          else if(amostras[i].ocratoxina.mapReference == '_workmap4'&& otamap[3] == 0){
            ota1[cont_ota] = amostras[i];
            cont_ota++;
            otamap[3] = 1;
          }
          else if(amostras[i].ocratoxina.mapReference == '_workmap5'&& otamap[4] == 0){
            ota1[cont_ota] = amostras[i];
            cont_ota++;
            otamap[4] = 1;
          }
          else if(amostras[i].ocratoxina.mapReference == '_workmap6'&& otamap[5] == 0){
            ota1[cont_ota] = amostras[i];
            cont_ota++;
            otamap[5] = 1;
          }
          else if(amostras[i].ocratoxina.mapReference == '_workmap7'&& otamap[6] == 0){
            ota1[cont_ota] = amostras[i];
            cont_ota++;
            otamap[6] = 1;
          }
          else if(amostras[i].ocratoxina.mapReference == '_workmap8'&& otamap[7] == 0){
            ota1[cont_ota] = amostras[i];
            cont_ota++;
            otamap[7] = 1;
          }
          else if(amostras[i].ocratoxina.mapReference == '_workmap9'&& otamap[8] == 0){
            ota1[cont_ota] = amostras[i];
            cont_ota++;
            otamap[8] = 1;
          }
          else if(amostras[i].ocratoxina.mapReference == '_workmap9'&& otamap[8] == 0){
            ota1[cont_ota] = amostras[i];
            cont_ota++;
            otamap[8] = 1;
          }
          else if(amostras[i].ocratoxina.mapReference == '_workmap10'&& otamap[9] == 0){
            ota1[cont_ota] = amostras[i];
            cont_ota++;
            otamap[9] = 1;
          }
          else if(amostras[i].ocratoxina.mapReference == '_workmap11'&& otamap[10] == 0){
            ota1[cont_ota] = amostras[i];
            cont_ota++;
            otamap[10] = 1;
          }
          else if(amostras[i].ocratoxina.mapReference == '_workmap12'&& otamap[11] == 0){
            ota1[cont_ota] = amostras[i];
            cont_ota++;
            otamap[11] = 1;
          }
          else if(amostras[i].ocratoxina.mapReference == '_workmap13'&& otamap[12] == 0){
            ota1[cont_ota] = amostras[i];
            cont_ota++;
            otamap[12] = 1;
          }
          else if(amostras[i].ocratoxina.mapReference == '_workmap14'&& otamap[13] == 0){
            ota1[cont_ota] = amostras[i];
            cont_ota++;
            otamap[13] = 1;
          }
          else if(amostras[i].ocratoxina.mapReference == '_workmap15'&& otamap[14] == 0){
            ota1[cont_ota] = amostras[i];
            cont_ota++;
            otamap[14] = 1;
          }
          else if(amostras[i].ocratoxina.mapReference == '_workmap16'&& otamap[15] == 0){
            ota1[cont_ota] = amostras[i];
            cont_ota++;
            otamap[15] = 1;
          }
        }
      }

      //salvas os espaços
      for (let i = 0; i < amostras.length; i++) {
        if(amostras[i].t2toxina.active == true){
          if(amostras[i].t2toxina.mapReference == '_workmap1' && t2map[0] == 0){
            t2[cont_t2] = amostras[i];
            cont_t2++;
            t2map[0] = 1;
          }
          else if(amostras[i].t2toxina.mapReference == '_workmap2'&& t2map[1] == 0){
            t2[cont_t2] = amostras[i];
            cont_t2++;
            t2map[1] = 1;
          }
          else if(amostras[i].t2toxina.mapReference == '_workmap3'&& t2map[2] == 0){
            t2[cont_t2] = amostras[i];
            cont_t2++;
            t2map[2] = 1;
          }
          else if(amostras[i].t2toxina.mapReference == '_workmap4'&& t2map[3] == 0){
            t2[cont_t2] = amostras[i];
            cont_t2++;
            t2map[3] = 1;
          }
          else if(amostras[i].t2toxina.mapReference == '_workmap5'&& t2map[4] == 0){
            t2[cont_t2] = amostras[i];
            cont_t2++;
            t2map[4] = 1;
          }
          else if(amostras[i].t2toxina.mapReference == '_workmap6'&& t2map[5] == 0){
            t2[cont_t2] = amostras[i];
            cont_t2++;
            t2map[5] = 1;
          }
          else if(amostras[i].t2toxina.mapReference == '_workmap7'&& t2map[6] == 0){
            t2[cont_t2] = amostras[i];
            cont_t2++;
            t2map[6] = 1;
          }
          else if(amostras[i].t2toxina.mapReference == '_workmap8'&& t2map[7] == 0){
            t2[cont_t2] = amostras[i];
            cont_t2++;
            t2map[7] = 1;
          }
          else if(amostras[i].t2toxina.mapReference == '_workmap9'&& t2map[8] == 0){
            t2[cont_t2] = amostras[i];
            cont_t2++;
            t2map[8] = 1;
          }
          else if(amostras[i].t2toxina.mapReference == '_workmap9'&& t2map[8] == 0){
            t2[cont_t2] = amostras[i];
            cont_t2++;
            t2map[8] = 1;
          }
          else if(amostras[i].t2toxina.mapReference == '_workmap10'&& t2map[9] == 0){
            t2[cont_t2] = amostras[i];
            cont_t2++;
            t2map[9] = 1;
          }
          else if(amostras[i].t2toxina.mapReference == '_workmap11'&& t2map[10] == 0){
            t2[cont_t2] = amostras[i];
            cont_t2++;
            t2map[10] = 1;
          }
          else if(amostras[i].t2toxina.mapReference == '_workmap12'&& t2map[11] == 0){
            t2[cont_t2] = amostras[i];
            cont_t2++;
            t2map[11] = 1;
          }
          else if(amostras[i].t2toxina.mapReference == '_workmap13'&& t2map[12] == 0){
            t2[cont_t2] = amostras[i];
            cont_t2++;
            t2map[12] = 1;
          }
          else if(amostras[i].t2toxina.mapReference == '_workmap14'&& t2map[13] == 0){
            t2[cont_t2] = amostras[i];
            cont_t2++;
            t2map[13] = 1;
          }
          else if(amostras[i].t2toxina.mapReference == '_workmap15'&& t2map[14] == 0){
            t2[cont_t2] = amostras[i];
            cont_t2++;
            t2map[14] = 1;
          }
          else if(amostras[i].t2toxina.mapReference == '_workmap16'&& t2map[15] == 0){
            t2[cont_t2] = amostras[i];
            cont_t2++;
            t2map[15] = 1;
          }
        }
      }



//salvas os espaços
      for (let i = 0; i < amostras.length; i++) {

        if(amostras[i].zearalenona.active == true){

          if(amostras[i].zearalenona.mapReference == '_workmap1' && zeamap[0] == 0){
            zea[cont_zea] = amostras[i];
            cont_zea++;
            zeamap[0] = 1;
          }
          else if(amostras[i].zearalenona.mapReference == '_workmap2'&& zeamap[1] == 0){
            zea[cont_zea] = amostras[i];
            cont_zea++;
            zeamap[1] = 1;
          }
          else if(amostras[i].zearalenona.mapReference == '_workmap3'&& zeamap[2] == 0){
            zea[cont_zea] = amostras[i];
            cont_zea++;
            zeamap[2] = 1;
          }
          else if(amostras[i].zearalenona.mapReference == '_workmap4'&& zeamap[3] == 0){
            zea[cont_zea] = amostras[i];
            cont_zea++;
            zeamap[3] = 1;
          }
          else if(amostras[i].zearalenona.mapReference == '_workmap5'&& zeamap[4] == 0){
            zea[cont_zea] = amostras[i];
            cont_zea++;
            zeamap[4] = 1;
          }
          else if(amostras[i].zearalenona.mapReference == '_workmap6'&& zeamap[5] == 0){
            zea[cont_zea] = amostras[i];
            cont_zea++;
            zeamap[5] = 1;
          }
          else if(amostras[i].zearalenona.mapReference == '_workmap7'&& zeamap[6] == 0){
            zea[cont_zea] = amostras[i];
            cont_zea++;
            zeamap[6] = 1;
          }
          else if(amostras[i].zearalenona.mapReference == '_workmap8'&& zeamap[7] == 0){
            zea[cont_zea] = amostras[i];
            cont_zea++;
            zeamap[7] = 1;
          }
          else if(amostras[i].zearalenona.mapReference == '_workmap9'&& zeamap[8] == 0){
            zea[cont_zea] = amostras[i];
            cont_zea++;
            zeamap[8] = 1;
          }
          else if(amostras[i].zearalenona.mapReference == '_workmap9'&& zeamap[8] == 0){
            zea[cont_zea] = amostras[i];
            cont_zea++;
            zeamap[8] = 1;
          }
          else if(amostras[i].zearalenona.mapReference == '_workmap10'&& zeamap[9] == 0){
            zea[cont_zea] = amostras[i];
            cont_zea++;
            zeamap[9] = 1;
          }
          else if(amostras[i].zearalenona.mapReference == '_workmap11'&& zeamap[10] == 0){
            zea[cont_zea] = amostras[i];
            cont_zea++;
            zeamap[10] = 1;
          }
          else if(amostras[i].zearalenona.mapReference == '_workmap12'&& zeamap[11] == 0){
            zea[cont_zea] = amostras[i];
            cont_zea++;
            zeamap[11] = 1;
          }
          else if(amostras[i].zearalenona.mapReference == '_workmap13'&& zeamap[12] == 0){
            zea[cont_zea] = amostras[i];
            cont_zea++;
            zeamap[12] = 1;
          }
          else if(amostras[i].zearalenona.mapReference == '_workmap14'&& zeamap[13] == 0){
            zea[cont_zea] = amostras[i];
            cont_zea++;
            zeamap[13] = 1;
          }
          else if(amostras[i].zearalenona.mapReference == '_workmap15'&& zeamap[14] == 0){
            zea[cont_zea] = amostras[i];
            cont_zea++;
            zeamap[14] = 1;
          }
          else if(amostras[i].zearalenona.mapReference == '_workmap16'&& zeamap[15] == 0){
            zea[cont_zea] = amostras[i];
            cont_zea++;
            zeamap[15] = 1;
          }
        }
      }

      //salvas os espaços
      for (let i = 0; i < amostras.length; i++) {
        if(amostras[i].fumonisina.active == true){

          if(amostras[i].fumonisina.mapReference == '_workmap1' && fbsmap[0] == 0){
            fbs[cont_fbs] = amostras[i];
            cont_fbs++;
            fbsmap[0] = 1;
          }
          else if(amostras[i].fumonisina.mapReference == '_workmap2'&& fbsmap[1] == 0){
            fbs[cont_fbs] = amostras[i];
            cont_fbs++;
            fbsmap[1] = 1;
          }
          else if(amostras[i].fumonisina.mapReference == '_workmap3'&& fbsmap[2] == 0){
            fbs[cont_fbs] = amostras[i];
            cont_fbs++;
            fbsmap[2] = 1;
          }
          else if(amostras[i].fumonisina.mapReference == '_workmap4'&& fbsmap[3] == 0){
            fbs[cont_fbs] = amostras[i];
            cont_fbs++;
            fbsmap[3] = 1;
          }
          else if(amostras[i].fumonisina.mapReference == '_workmap5'&& fbsmap[4] == 0){
            fbs[cont_fbs] = amostras[i];
            cont_fbs++;
            fbsmap[4] = 1;
          }
          else if(amostras[i].fumonisina.mapReference == '_workmap6'&& fbsmap[5] == 0){
            fbs[cont_fbs] = amostras[i];
            cont_fbs++;
            fbsmap[5] = 1;
          }
          else if(amostras[i].fumonisina.mapReference == '_workmap7'&& fbsmap[6] == 0){
            fbs[cont_fbs] = amostras[i];
            cont_fbs++;
            fbsmap[6] = 1;
          }
          else if(amostras[i].fumonisina.mapReference == '_workmap8'&& fbsmap[7] == 0){
            fbs[cont_fbs] = amostras[i];
            cont_fbs++;
            fbsmap[7] = 1;
          }
          else if(amostras[i].fumonisina.mapReference == '_workmap9'&& fbsmap[8] == 0){
            fbs[cont_fbs] = amostras[i];
            cont_fbs++;
            fbsmap[8] = 1;
          }
          else if(amostras[i].fumonisina.mapReference == '_workmap9'&& fbsmap[8] == 0){
            fbs[cont_fbs] = amostras[i];
            cont_fbs++;
            fbsmap[8] = 1;
          }
          else if(amostras[i].fumonisina.mapReference == '_workmap10'&& fbsmap[9] == 0){
            fbs[cont_fbs] = amostras[i];
            cont_fbs++;
            fbsmap[9] = 1;
          }
          else if(amostras[i].fumonisina.mapReference == '_workmap11'&& fbsmap[10] == 0){
            fbs[cont_fbs] = amostras[i];
            cont_fbs++;
            fbsmap[10] = 1;
          }
          else if(amostras[i].fumonisina.mapReference == '_workmap12'&& fbsmap[11] == 0){
            fbs[cont_fbs] = amostras[i];
            cont_fbs++;
            fbsmap[11] = 1;
          }
          else if(amostras[i].fumonisina.mapReference == '_workmap13'&& fbsmap[12] == 0){
            fbs[cont_fbs] = amostras[i];
            cont_fbs++;
            fbsmap[12] = 1;
          }
          else if(amostras[i].fumonisina.mapReference == '_workmap14'&& fbsmap[13] == 0){
            fbs[cont_fbs] = amostras[i];
            cont_fbs++;
            fbsmap[13] = 1;
          }
          else if(amostras[i].fumonisina.mapReference == '_workmap15'&& fbsmap[14] == 0){
            fbs[cont_fbs] = amostras[i];
            cont_fbs++;
            fbsmap[14] = 1;
          }
          else if(amostras[i].fumonisina.mapReference == '_workmap16'&& fbsmap[15] == 0){
            fbs[cont_fbs] = amostras[i];
            cont_fbs++;
            fbsmap[15] = 1;
          }
        }
      }

    res.render( 'allsamples',{amostras,afla1,zea_p,aflas_p,ocra_p,don_p,t2_p,fbs_p,fbs,zea,don1,ota1,dd,mm,yyyy,today,t2,...req.session });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });

}).catch((error) => {
  console.log(error);
    });
   }).catch((error) => {
    console.log(error);
   });
  }).catch((error) => {
   console.log(error);
  });
  }).catch((error) => {
   console.log(error);
  });
}).catch((error) => {
 console.log(error);
});
}).catch((error)=>{
  console.log(error);
});

}).catch((error) => {
  console.log(error);
 });
}).catch((error) => {
 console.log(error);
});
}).catch((error) => {
 console.log(error);
});
}).catch((error) => {
console.log(error);
});
}).catch((error)=>{
console.log(error);
});
}).catch((error)=>{
  console.log(error);
  });
}).catch((error)=>{
  console.log(error);
  });
}).catch((error)=>{
  console.log(error);
  });
}).catch((error)=>{
  console.log(error);
  });
}).catch((error)=>{
  console.log(error);
  });

}).catch((error)=>{
  console.log(error);
  });
}).catch((error)=>{
  console.log(error);
  });
}).catch((error)=>{
  console.log(error);
  });
}).catch((error)=>{
  console.log(error);
  });
}).catch((error)=>{
  console.log(error);
  });

}).catch((error)=>{
  console.log(error);
  });
}).catch((error)=>{
  console.log(error);
  });
}).catch((error)=>{
  console.log(error);
  });
}).catch((error)=>{
  console.log(error);
  });
}).catch((error)=>{
  console.log(error);
  });


}).catch((error)=>{
  console.log(error);
  });
}).catch((error)=>{
  console.log(error);
  });
}).catch((error)=>{
  console.log(error);
  });
}).catch((error)=>{
  console.log(error);
  });
}).catch((error)=>{
  console.log(error);
  });
});





router.post('/',function(req,res,next){
  var last_filled;
  
  Kit.getAll().then((kits)=>{ 
    kits.forEach((kit)=>{
      if(kit.active) {
          last_filled=0;
          for(let i=0;i<kit.mapArray.length;i++){
            Workmap.getOneMap(kit.mapArray[i]).then((workmap)=>{
              if(workmap.samplesArray.length!=0) {
                last_filled++;
              }
              if(i==kit.mapArray.length-1) {
                kit.amount=kit.amount-last_filled;
                kit.toxinaStart=last_filled;
              }
            });
          }
       }
    })
  }).catch((error)=>{
    console.log(error);
  })
  
  
  // Sample.getAll().then((sample)=>{
  //   //amostras afla
  //   if(req.body.sample.aflatoxina){
  //     var id_afla = req.body.sample.aflatoxina._id;
  //     var abs_afla = req.body.sample.aflatoxina.absorbance;
  //     if(abs_afla.length == 1){
  //       Sample.updateAflaAbsorbance(id_afla,abs_afla).then(()=>{
  //       }).catch((error)=>{
  //       console.log(error);
  //       });
  //     } else{
  //       for (let i = 0; i < abs_afla.length; i++) {
  //         Sample.updateAflaAbsorbance(id_afla[i],abs_afla[i]).then(()=>{
  //         }).catch((error)=>{
  //         console.log(error);
  //         });
  //       }
  //     }
  //   }
  //   if(req.body.calibrator.aflatoxina){
  //     //calibradores afla
  //     var id_calibrators_afla = req.body.calibrator.aflatoxina._id;
  //     var abs_calibritor_afla = req.body.calibrator.aflatoxina.absorbance;
  //     if(abs_calibritor_afla.length == 1){
  //       Sample.updateAflaAbsorbance(id_calibrators_afla, abs_calibritor_afla).then(()=>{
  //       }).catch((error)=>{ 
  //       console.log(error);
  //       });
  //     } else {
  //       for (let i = 0; i < abs_calibritor_afla.length; i++) {
  //         Sample.updateAflaAbsorbance(id_calibrators_afla[i],abs_calibritor_afla[i]).then(()=>{
  //         }).catch((error)=>{ 
  //         console.log(error);
  //         });
  //       } 
  //     }
  //   }
  //   if(req.body.calibrator.deoxinivalenol){
  //     //calibradores deox
  //     var id_calibrators_deox = req.body.calibrator.deoxinivalenol._id;
  //     var abs_calibritor_deox = req.body.calibrator.deoxinivalenol.absorbance;
  //     if(abs_calibritor_deox.length == 1){
  //       Sample.updateDeoxAbsorbance(id_calibrators_deox,abs_calibritor_deox).then(()=>{
  //       }).catch((error)=>{
  //       console.log(error);
  //       });
  //     } else{
  //       for(let i = 0; i< abs_calibritor_deox.length; i++){
  //         Sample.updateDeoxAbsorbance(id_calibrators_deox[i],abs_calibritor_deox[i]).then(()=>{
  //         }).catch((error)=>{
  //         console.log(error);
  //         });
  //       }
  //     }
  //   }
  //   if(req.body.sample.deoxinivalenol){
  //     //amostras deox
  //     var id_deox = req.body.sample.deoxinivalenol._id;
  //     var abs_deox = req.body.sample.deoxinivalenol.absorbance;
  //     if(abs_deox.length == 1){
  //       Sample.updateDeoxAbsorbance(id_deox, abs_deox).then(()=>{
  //       }).catch((error)=>{
  //       console.log(error);
  //       });
  //     }else{
  //       for(let i = 0; i <abs_deox.length; i++){
  //         Sample.updateDeoxAbsorbance(id_deox[i],abs_deox[i]).then(()=>{
  //         }).catch((error)=>{
  //         console.log(error);
  //         });
  //       }
  //     }
  //   }
  //   if(req.body.calibrator.ocratoxina){
  //     //calibradores ocra
  //     var id_calibrators_ocra = req.body.calibrator.ocratoxina._id;
  //     var abs_calibritor_ocra = req.body.calibrator.ocratoxina.absorbance;
  //     if(abs_calibritor_ocra.length == 1){
  //       Sample.updateOcraAbsorbance(id_calibrators_ocra,abs_calibritor_ocra).then(()=>{
  //       }).catch((error)=>{
  //       console.log(error);
  //       });
  //     } else{
  //       for(let i = 0; i< abs_calibritor_ocra.length; i++){
  //         Sample.updateOcraAbsorbance(id_calibrators_ocra[i],abs_calibritor_ocra[i]).then(()=>{
  //         }).catch((error)=>{
  //         console.log(error);
  //         });
  //       }
  //     }
  //   }


  //   if(req.body.sample.ocratoxina){
  //     //amostras ocra
  //     var id_ocra = req.body.sample.ocratoxina._id;
  //     var abs_ocra = req.body.sample.ocratoxina.absorbance;
  //     if(abs_ocra.length == 1){
  //       Sample.updateOcraAbsorbance(id_ocra,abs_ocra).then(()=>{
  //       }).catch((error)=>{
  //       console.log(error);
  //       });
  //     } else{
  //       for(let i = 0; i< abs_ocra.length; i++){
  //         Sample.updateOcraAbsorbance(id_ocra[i],abs_ocra[i]).then(()=>{
  //         }).catch((error)=>{
  //         console.log(error);
  //         });
  //       }
  //     }
  //   }

  //   if(req.body.calibrator.t2toxina){
  //     //calibradores t2
  //     var id_calibrators_t2 = req.body.calibrator.t2toxina._id;
  //     var abs_calibritor_t2 = req.body.calibrator.t2toxina.absorbance;
  //     if(abs_calibritor_t2.length == 1){
  //       Sample.updateT2Absorbance(id_calibrators_t2,abs_calibritor_t2).then(()=>{
  //       }).catch((error)=>{
  //       console.log(error);
  //       });
  //     } else{
  //       for(let i = 0; i< abs_calibritor_t2.length; i++){
  //         Sample.updateT2Absorbance(id_calibrators_t2[i],abs_calibritor_t2[i]).then(()=>{
  //         }).catch((error)=>{
  //         console.log(error);
  //         });
  //       }
  //     }
  //   }

  //   if(req.body.sample.t2toxina){
  //     //amostra t2
  //     var id_t2 = req.body.sample.t2toxina._id;
  //     var abs_t2 = req.body.sample.t2toxina.absorbance;
  //     if(abs_t2.length == 1){
  //       Sample.updateT2Absorbance(id_t2,abs_t2).then(()=>{
  //       }).catch((error)=>{
  //       console.log(error);
  //       });
  //     } else{
  //       for(let i = 0; i< abs_t2.length; i++){
  //         Sample.updateT2Absorbance(id_t2[i],abs_t2[i]).then(()=>{
  //         }).catch((error)=>{
  //         console.log(error);
  //         });
  //       }
  //     }
  //   }


  //   if(req.body.sample.zearalenona){
  //     //amostras zea
  //     var id_zea = req.body.sample.zearalenona._id;
  //     var abs_zea = req.body.sample.zearalenona.absorbance;
  //     if(abs_zea.length == 1){
  //       Sample.updateZeaAbsorbance(id_zea,abs_zea).then(()=>{
  //       }).catch((error)=>{
  //       console.log(error);
  //       });
  //     } else{
  //       for(let i = 0; i< abs_zea.length; i++){
  //         Sample.updateZeaAbsorbance(id_zea[i],abs_zea[i]).then(()=>{
  //         }).catch((error)=>{
  //         console.log(error);
  //         });
  //       }
  //     }
  //   }


  //   if(req.body.calibrator.zearalenona){
  //     //calibradores zea
  //     var id_calibrators_zea = req.body.calibrator.zearalenona._id;
  //     var abs_calibritor_zea = req.body.calibrator.zearalenona.absorbance;
  //     if(abs_calibritor_zea.length == 1){
  //       Sample.updateZeaAbsorbance(id_calibrators_zea,abs_calibritor_zea).then(()=>{
  //       }).catch((error)=>{
  //       console.log(error);
  //       });
  //     } else{
  //       for(let i = 0; i< abs_calibritor_zea.length; i++){
  //         Sample.updateZeaAbsorbance(id_calibrators_zea[i],abs_calibritor_zea[i]).then(()=>{
  //         }).catch((error)=>{
  //         console.log(error);
  //         });
  //       }
  //     }
  //   }

  //   if(req.body.sample.zearalenona){
  //     //amostras zea
  //     var id_zea = req.body.sample.zearalenona._id;
  //     var abs_zea = req.body.sample.zearalenona.absorbance;
  //     if(abs_zea.length == 1){
  //       Sample.updateZeaAbsorbance(id_calibrators_zea,abs_calibritor_zea).then(()=>{
  //       }).catch((error)=>{
  //       console.log(error);
  //       });
  //     } else{
  //       for(let i = 0; i< abs_zea.length; i++){
  //         Sample.updateZeaAbsorbance(id_zea[i],abs_zea[i]).then(()=>{
  //         }).catch((error)=>{
  //         console.log(error);
  //         });
  //       }
  //     }
  //   }


  //   if(req.body.calibrator.fumonisina){
  //     //calibradores fbs
  //     var id_calibrators_fbs = req.body.calibrator.fumonisina._id;
  //     var abs_calibritor_fbs = req.body.calibrator.fumonisina.absorbance;
  //     if(abs_calibritor_fbs.length == 1){
  //       Sample.updateFbsAbsorbance(id_calibrators_fbs,abs_calibritor_fbs).then(()=>{
  //       }).catch((error)=>{
  //       console.log(error);
  //       });
  //     } else{
  //       for(let i = 0; i< abs_calibritor_fbs.length; i++){
  //         Sample.updateFbsAbsorbance(id_calibrators_fbs[i],abs_calibritor_fbs[i]).then(()=>{
  //         }).catch((error)=>{
  //         console.log(error);
  //         });
  //       }
  //     }
      
  //   }

  //   if(req.body.sample.fumonisina){
  //     //amostras fbs
  //     var id_fbs = req.body.sample.fumonisina._id;
  //     var abs_fbs = req.body.sample.fumonisina.absorbance;
  //     if(abs_fbs.length == 1){
  //       Sample.updateFbsAbsorbance(id_fbs,abs_fbs).then(()=>{
  //       }).catch((error)=>{
  //       console.log(error);
  //       });
  //     } else{
  //       for(let i = 0; i< abs_fbs.length; i++){
  //         Sample.updateFbsAbsorbance(id_fbs[i],abs_fbs[i]).then(()=>{
  //         }).catch((error)=>{
  //         console.log(error);
  //         });
  //       }
  //     }
  //   }
    
    

    

  //   var cont = 0;

  //   for (var i = 0; i < sample.length; i++) {
  //    if(cont < sample[i].ocratoxina.contador){
  //       cont = sample[i].ocratoxina.contador;
  //     }
  //     if(cont < sample[i].deoxinivalenol.contador){
  //       cont = sample[i].deoxinivalenol.contador;
  //     }
  //     if(cont <  sample[i].t2toxina.contador){
  //       cont = sample[i].t2toxina.contador;
  //     }
  //     if(cont < sample[i].fumonisina.contador){
  //       cont = sample[i].fumonisina.contador;
  //     }
  //     if(cont < sample[i].zearalenona.contador){
  //       cont = sample[i].zearalenona.contador;
  //     }
  //     if (cont < sample[i].aflatoxina.contador) {
  //       cont = sample[i].aflatoxina.contador;
  //     }
  //   }



    
  //   for (var i = 0; i < sample.length; i++) {

  //     if(sample[i].ocratoxina.mapReference != 'Sem mapa' && sample[i].ocratoxina.active == true){
  //       Sample.updateOcraWorkmap(sample[i]._id,cont+1).then(()=>{
  //       }).catch((error)=>{
  //        console.log(error);
  //        });
  //        Sample.updateOcraActive(sample[i]._id,false).then(()=>{
  //       }).catch((error)=>{
  //      console.log(error);
  //      });
         
         
  //     }

  //     if(sample[i].aflatoxina.mapReference != 'Sem mapa' &&sample[i].aflatoxina.active == true ){
  //       Sample.updateAflaWorkmap(sample[i]._id,cont+1).then(()=>{
  //       }).catch((error)=>{
  //        console.log(error);
  //        });
  //         Sample.updateAflaActive(sample[i]._id,false).then(()=>{
  //          }).catch((error)=>{
  //         console.log(error);
  //         });  
         
        
  //     }
      
  //     if(sample[i].deoxinivalenol.mapReference != 'Sem mapa' && sample[i].deoxinivalenol.active == true ){
  //       Sample.updateDeoxWorkmap(sample[i]._id,cont+1).then(()=>{
  //       }).catch((error)=>{
  //        console.log(error);
  //        });
  //         Sample.updateDeoxActive(sample[i]._id,false).then(()=>{
  //          }).catch((error)=>{
  //        console.log(error);
  //        });
  //     }

  //     if(sample[i].t2toxina.mapReference != 'Sem mapa' && sample[i].t2toxina.active == true ){
  //       Sample.updateT2Workmap(sample[i]._id,cont+1).then(()=>{
  //       }).catch((error)=>{
  //        console.log(error);
  //        });
  //        Sample.updateT2Active(sample[i]._id,false).then(()=>{
  //       }).catch((error)=>{
  //       console.log(error);
  //       });
  //     }
      
  //     if(sample[i].fumonisina.mapReference != 'Sem mapa' && sample[i].fumonisina.active == true ){
  //       Sample.updatefumWorkmap(sample[i]._id,cont+1).then(()=>{
  //       }).catch((error)=>{
  //        console.log(error);
  //        });
  //        Sample.updateFumActive(sample[i]._id,false).then(()=>{
  //       }).catch((error)=>{
  //       console.log(error);
  //       });

  //     }

  //     if(sample[i].zearalenona.mapReference != 'Sem mapa' && sample[i].zearalenona.active == true ){
  //       Sample.updateZeaWorkmap(sample[i]._id,cont+1).then(()=>{
  //       }).catch((error)=>{
  //        console.log(error);
  //        });
  //        Sample.updateZeaActive(sample[i]._id,false).then(()=>{
  //       }).catch((error)=>{
  //       console.log(error);
  //       });
        

  //     }
  //   }

    res.redirect('/allsamples');

  // }).catch((error)=>{
  //   console.log(error);
  // });
});






module.exports = router;
