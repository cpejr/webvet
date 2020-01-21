
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
 
  Sample.getAll().then((amostras)=>{
  Kit.getAll().then((kit)=>{
    
     
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

    res.render( 'allsamples',{amostras,afla1,fbs,zea,don1,ota1,dd,mm,yyyy,today,t2,...req.session });
  
}).catch((error)=>{
  console.log(error);
  });
}).catch((error)=>{
  console.log(error);
  });
});




router.post('/',function(req,res,next){
  Kit.getActiveAfla().then((aflaArray)=>{
    if(aflaArray.length!=0){
         
      var aflaKit=aflaArray[0];
      var new_last;
      var last_filled=0;
      var counter=0;

      
      for(let i=aflaKit.toxinaStart;i<aflaKit.mapArray.length;i++) {
        Workmap.getOneMap(aflaKit.mapArray[i]).then((workmap)=>{
          counter++;
          if(workmap.samplesArray.length>0) {
            new_last=workmap.mapID;
            new_last=new_last.replace("_workmap", "");
            new_last=Number(new_last);
    
            if(new_last>last_filled){
              last_filled=new_last;
            }
    
            
          }
          if(counter==aflaKit.mapArray.length-1) {
            aflaKit.amount=aflaKit.stripLength-last_filled;
            aflaKit.toxinaStart=last_filled;
            aflaKit.calibrators.P1.absorbance=parseFloat(req.body.aflaCalibrator.P1);
            aflaKit.calibrators.P2.absorbance=parseFloat(req.body.aflaCalibrator.P2);
            aflaKit.calibrators.P3.absorbance=parseFloat(req.body.aflaCalibrator.P3);
            aflaKit.calibrators.P4.absorbance=parseFloat(req.body.aflaCalibrator.P4);
            aflaKit.calibrators.P5.absorbance=parseFloat(req.body.aflaCalibrator.P5);
            Kit.update(aflaKit._id,aflaKit).catch((err)=>{
              console.log(err);
            });
          }
          
        });
      } 
     }
  }).catch((error)=>{
    console.log(error);
  });

  Kit.getActiveDeox().then((deoxArray)=>{ 
    if(deoxArray.length!=0){
      var deoxKit=deoxArray[0];
      var new_last;
      var last_filled=0;
      var counter=0;
      
      for(let i=deoxKit.toxinaStart;i<deoxKit.mapArray.length;i++) {
        Workmap.getOneMap(deoxKit.mapArray[i]).then((workmap)=>{
          counter++;
          if(workmap.samplesArray.length>0) {
            new_last=workmap.mapID;
            new_last=new_last.replace("_workmap", "");
            new_last=Number(new_last);

            if(new_last>last_filled){
              last_filled=new_last;
            }

            
          }
          if(counter==deoxKit.mapArray.length-1) {
            
            deoxKit.amount=deoxKit.stripLength-last_filled;
            deoxKit.toxinaStart=last_filled;
            deoxKit.calibrators.P1.absorbance=parseFloat(req.body.donCalibrator.P1);
            deoxKit.calibrators.P2.absorbance=parseFloat(req.body.donCalibrator.P2);
            deoxKit.calibrators.P3.absorbance=parseFloat(req.body.donCalibrator.P3);
            deoxKit.calibrators.P4.absorbance=parseFloat(req.body.donCalibrator.P4);
            deoxKit.calibrators.P5.absorbance=parseFloat(req.body.donCalibrator.P5);
            Kit.update(deoxKit._id,deoxKit).catch((err)=>{
              console.log(err);
            });
          }
        });
      }
    }
  }).catch((error)=>{
    console.log(error);
  });

  Kit.getActiveT2().then((t2Array)=>{ 
    if(t2Array.length!=0){
      var t2Kit=t2Array[0];
      var new_last;
      var last_filled=0;
      var counter=0;
      
      for(let i=t2Kit.toxinaStart;i<t2Kit.mapArray.length;i++) {
        Workmap.getOneMap(t2Kit.mapArray[i]).then((workmap)=>{
          counter++;
          if(workmap.samplesArray.length>0) {
            new_last=workmap.mapID;
            new_last=new_last.replace("_workmap", "");
            new_last=Number(new_last);

            if(new_last>last_filled){
              last_filled=new_last;
            }

            
          }
          if(counter==t2Kit.mapArray.length-1) {
            t2Kit.amount=t2Kit.stripLength-last_filled;
            t2Kit.toxinaStart=last_filled;
            t2Kit.calibrators.P1.absorbance=parseFloat(req.body.t2Calibrator.P1);
            t2Kit.calibrators.P2.absorbance=parseFloat(req.body.t2Calibrator.P2);
            t2Kit.calibrators.P3.absorbance=parseFloat(req.body.t2Calibrator.P3);
            t2Kit.calibrators.P4.absorbance=parseFloat(req.body.t2Calibrator.P4);
            t2Kit.calibrators.P5.absorbance=parseFloat(req.body.t2Calibrator.P5);
            Kit.update(t2Kit._id,t2Kit).catch((err)=>{
              console.log(err);
            });
          }
        });
      }
    }
  }).catch((error)=>{
    console.log(error);
  });
 
  Kit.getActiveZea().then((zeaArray)=>{ 
    if(zeaArray.length!=0){
      var zeaKit=zeaArray[0];
      var new_last;
      var last_filled=0;
      var counter=0;
      
      for(let i=zeaKit.toxinaStart;i<zeaKit.mapArray.length;i++) {
        Workmap.getOneMap(zeaKit.mapArray[i]).then((workmap)=>{
          counter++;
          if(workmap.samplesArray.length>0) {
            new_last=workmap.mapID;
            new_last=new_last.replace("_workmap", "");
            new_last=Number(new_last);

            if(new_last>last_filled){
              last_filled=new_last;
            }
          }
          if(counter==zeaKit.mapArray.length-1) {
            zeaKit.calibrators.P1.absorbance=parseFloat(req.body.zeaCalibrator.P1);
            zeaKit.calibrators.P2.absorbance=parseFloat(req.body.zeaCalibrator.P2);
            zeaKit.calibrators.P3.absorbance=parseFloat(req.body.zeaCalibrator.P3);
            zeaKit.calibrators.P4.absorbance=parseFloat(req.body.zeaCalibrator.P4);
            zeaKit.calibrators.P5.absorbance=parseFloat(req.body.zeaCalibrator.P5);
            zeaKit.amount=zeaKit.stripLength-last_filled;
            zeaKit.toxinaStart=last_filled;
            Kit.update(zeaKit._id,zeaKit).catch((err)=>{
              console.log(err);
            });
          }
        });
      }
    }
  }).catch((error)=>{
    console.log(error);
  });

  Kit.getActiveFum().then((fumArray)=>{ 
    if(fumArray.length!=0){
      var fumKit=fumArray[0];
      var new_last;
      var last_filled=0;
      var counter=0;
      
      for(let i=fumKit.toxinaStart;i<fumKit.mapArray.length;i++) {

        Workmap.getOneMap(fumKit.mapArray[i]).then((workmap)=>{
          if(workmap.samplesArray.length>0) {
            new_last=workmap.mapID;
            new_last=new_last.replace("_workmap", "");
            new_last=Number(new_last);

            if(new_last>last_filled){
              last_filled=new_last;
            }
          }
          if(i==fumKit.mapArray.length-1) {
            fumKit.amount=fumKit.stripLength-last_filled;
            fumKit.toxinaStart=last_filled;
            fumKit.calibrators.P1.absorbance=parseFloat(req.body.fbCalibrator.P1);
            fumKit.calibrators.P2.absorbance=parseFloat(req.body.fbCalibrator.P2);
            fumKit.calibrators.P3.absorbance=parseFloat(req.body.fbCalibrator.P3);
            fumKit.calibrators.P4.absorbance=parseFloat(req.body.fbCalibrator.P4);
            fumKit.calibrators.P5.absorbance=parseFloat(req.body.fbCalibrator.P5);
            Kit.update(fumKit._id,fumKit).catch((err)=>{
              console.log(err);
            });
          }
        });
      }
    }
  }).catch((error)=>{
    console.log(error);
  });

  
  Kit.getActiveOcra().then((ocraArray)=>{ 
    if(ocraArray.length!=0){
      var ocraKit=ocraArray[0];
      var new_last;
      var last_filled=0;
      var counter=0;
      
      for(let i=ocraKit.toxinaStart;i<ocraKit.mapArray.length;i++) {
        Workmap.getOneMap(ocraKit.mapArray[i]).then((workmap)=>{
          counter++;
          if(workmap.samplesArray.length>0) {
            new_last=workmap.mapID;
            new_last=new_last.replace("_workmap", "");
            new_last=Number(new_last);

            if(new_last>last_filled){
              last_filled=new_last;
            }

            
          }
          if(counter==ocraKit.mapArray.length-1) {
            ocraKit.amount=ocraKit.stripLength-last_filled;
            ocraKit.toxinaStart=last_filled;
            ocraKit.calibrators.P1.absorbance=parseFloat(req.body.otaCalibrator.P1);
            ocraKit.calibrators.P2.absorbance=parseFloat(req.body.otaCalibrator.P2);
            ocraKit.calibrators.P3.absorbance=parseFloat(req.body.otaCalibrator.P3);
            ocraKit.calibrators.P4.absorbance=parseFloat(req.body.otaCalibrator.P4);
            ocraKit.calibrators.P5.absorbance=parseFloat(req.body.otaCalibrator.P5);
            Kit.update(ocraKit._id,ocraKit).catch((err)=>{
              console.log(err);
            });
          }
        });
      }
    }
  }).catch((error)=>{
    console.log(error);
  });
  
  Sample.getAll().then((sample)=>{
    //amostras afla

   
    res.redirect('/queue');

  }).catch((error)=>{
    console.log(error);
  });
});


module.exports = router;
