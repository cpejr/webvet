const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Kit = require('../models/kit');
const Sample = require('../models/sample');
const regression = require('regression');
const Workmap = require('../models/Workmap');

const ToxinasSigla = ['AFLA', 'DON', 'OTA', 'T2', 'ZEA', 'FBS'];
const ToxinasFull = ['aflatoxina', 'deoxinivalenol', 'ocratoxina', 't2toxina', 'zearalenona', 'fumonisina'];

function comparara(logb_bo_amostra, intercept, slope) {
  return Math.pow(10, (logb_bo_amostra - intercept) / slope);
}

router.get('/', async function (req, res, next) {


  async function calcular(toxinafull, toxinasigla) {

    var kit = await Kit.getActive(toxinasigla);
    if (kit !== null) {
      var mapas = [];
      var amostras = [];
      var p_concentration = [];
      var p_absorvance = [];
      var resultado = [];

      //Parte responsável por pegar a concentracao e absorvancia settadas no kit ativo
      p_concentration[0] = kit.calibrators.P1.concentration;
      p_concentration[1] = kit.calibrators.P2.concentration;
      p_concentration[2] = kit.calibrators.P3.concentration;
      p_concentration[3] = kit.calibrators.P4.concentration;
      p_concentration[4] = kit.calibrators.P5.concentration;

      p_absorvance[0] = kit.calibrators.P1.absorbance;
      p_absorvance[1] = kit.calibrators.P2.absorbance;
      p_absorvance[2] = kit.calibrators.P3.absorbance;
      p_absorvance[3] = kit.calibrators.P4.absorbance;
      p_absorvance[4] = kit.calibrators.P5.absorbance;

      //parte responsável por pegar as amostras do kit, logo  através do kit ativo de afla pega na variável mapArray o id dos mapas que estão sendo utilizados naqueles kits
      mapas = await Workmap.getByIdArray(kit.mapArray);

      var samples_id = [];
      //Após ter os ids dos mapas de trabalho que estão sendo utilizados roda um for para percorrer todos os mapas e um for dentro desse para acessar todas as amostras em cada mapa
      for (let j = 0; j < mapas.length; j++)
        for (let i = 0; i < mapas[j].samplesArray.length; i++)
          samples_id.push(mapas[j].samplesArray[i]);

      amostras = await Sample.getByIdArray(samples_id);

      var log_concentracao = [Math.log10(p_concentration[1]), Math.log10(p_concentration[2]), Math.log10(p_concentration[3]), Math.log10(p_concentration[4])]; //eixo x
      var b_b0 = [];
      var ln_b_b0 = [];

      for (var i = 0; i < 4; i++)
        b_b0[i] = p_absorvance[i + 1] / p_absorvance[0];


      for (var i = 0; i < b_b0.length; i++)
        ln_b_b0[i] = Math.log10(b_b0[i] / (1 - b_b0[i]));

      if (toxinasigla == "OTA") {
        console.log("original----")
        console.log(log_concentracao)
        console.log(ln_b_b0)
      }
      const result = regression.linear([[log_concentracao[0], ln_b_b0[0]], [log_concentracao[1], ln_b_b0[1]], [log_concentracao[2], ln_b_b0[2]]]);
      const slope = result.equation[0];// slope
      const yIntercept = result.equation[1];// intercept

      var log_b_b0 = new Array;
      var log_b_b0_2 = new Array;

      for (let i = 0; i < amostras.length; i++) {
        log_b_b0[i] = Math.log10((amostras[i][toxinafull].absorbance / p_absorvance[0]) / (1 - (amostras[i][toxinafull].absorbance / p_absorvance[0])));
        log_b_b0_2[i] = Math.log10((amostras[i][toxinafull].absorbance2 / p_absorvance[0]) / (1 - (amostras[i][toxinafull].absorbance2 / p_absorvance[0])));
      }

      for (let i = 0; i < log_b_b0.length; i++) {
        var avg = (amostras[i][toxinafull].absorbance + amostras[i][toxinafull].absorbance2) / 2;
        var avgcompara = (comparara(log_b_b0[i], yIntercept, slope) + comparara(log_b_b0_2[i], yIntercept, slope)) / 2;

        resultado[i] = {
          compara: avgcompara,
          average: avg,
          number: amostras[i].samplenumber,
          changed_workmap: i != 0 && amostras[i - 1][toxinafull].mapReference != amostras[i][toxinafull].mapReference,
          _id: amostras[i]._id
        };
      }

      return resultado;
    }
    else
      return null;
  }


  var mapas = new Array;
  var amostras_afla = new Array;
  let kit_afla_ativo = await Kit.getActiveAfla();
  //////console.log(kit_afla_ativo);

  var resultado_afla = new Array;
  var resultado_don = new Array;
  var resultado_ota = new Array;
  var resultado_t2 = new Array;
  var resultado_zea = new Array;
  var resultado_fbs = new Array;

  var Aflaabsorbance_p = new Array;
  var Aflaconcentration_p = new Array;

  if (kit_afla_ativo.length != 0) {
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

    var log_concentracao = [Math.log10(Aflaconcentration_p[1]), Math.log10(Aflaconcentration_p[2]), Math.log10(Aflaconcentration_p[3]), Math.log10(Aflaconcentration_p[4])]; //eixo x
    var b_b0 = new Array;
    var ln_b_b0 = new Array;
    //console.log('log concentracao');
    //console.log(log_concentracao);
    for (var i = 0; i < 4; i++) {
      b_b0[i] = Aflaabsorbance_p[i + 1] / Aflaabsorbance_p[0];
    }
    //console.log('B B0');

    //console.log(b_b0);

    for (var i = 0; i < b_b0.length; i++) {
      ln_b_b0[i] = Math.log10(b_b0[i] / (1 - b_b0[i]));
    }


    //console.log('ln_b_b0');
    //console.log(ln_b_b0);


    const result = regression.linear([[log_concentracao[0], ln_b_b0[0]], [log_concentracao[1], ln_b_b0[1]], [log_concentracao[2], ln_b_b0[2]]]);
    const slope = result.equation[0];// slope
    const yIntercept = result.equation[1];// intercept

    //console.log('slope');
    //console.log(slope);
    //console.log('yintercept');
    //console.log(yIntercept);

    //---------------------------------------Agora começa a parte que pega as absorvancias e calcula o que é preciso- em realação a amostra Essa parte será levada para outra página----------------------------------------------------

    //parte responsável por pegar as amostras do kit de aflatoxina, logo  através do kit ativo de afla pega na variável mapArray o id dos mapas que estão sendo utilizados naqueles kits
    let size = kit_afla_ativo[0].mapArray.length;
    for (let i = 0; i < size; i++) {
      mapas[i] = await Workmap.getOneMap(kit_afla_ativo[0].mapArray[i]);
    }
    var cont = 0;

    //Após ter os ids dos mapas de trabalho que estão sendo utilizados roda um for para percorrer todos os mapas e um for dentro desse para acessar todas as amostras em cada mapa
    for (let j = 0; j < mapas.length; j++) {
      for (let i = 0; i < mapas[j].samplesArray.length; i++) {
        amostras_afla[cont] = await Sample.getById(mapas[j].samplesArray[i]);
        cont++;
      }
    }
    //console.log("absss");

    //console.log(amostras_afla[0].aflatoxina.absorbance);

    var Afla_log_b_b0 = new Array;
    var Afla_log_b_b0_2 = new Array;

    for (let i = 0; i < amostras_afla.length; i++) {
      Afla_log_b_b0[i] = Math.log10((amostras_afla[i].aflatoxina.absorbance / Aflaabsorbance_p[0]) / (1 - (amostras_afla[i].aflatoxina.absorbance / Aflaabsorbance_p[0])));
      Afla_log_b_b0_2[i] = Math.log10((amostras_afla[i].aflatoxina.absorbance2 / Aflaabsorbance_p[0]) / (1 - (amostras_afla[i].aflatoxina.absorbance2 / Aflaabsorbance_p[0])));
      //console.log("log b bo");
      //console.log(Afla_log_b_b0[i]);

    }



    for (let i = 0; i < Afla_log_b_b0.length; i++) {
      var avg = (amostras_afla[i].aflatoxina.absorbance + amostras_afla[i].aflatoxina.absorbance2) / 2;
      var avgcompara = (comparara(Afla_log_b_b0[i], yIntercept, slope) + comparara(Afla_log_b_b0_2[i], yIntercept, slope)) / 2;
      resultado_afla[i] = {
        compara: avgcompara,
        average: avg,
        number: amostras_afla[i].samplenumber,
        changed_workmap: i != 0 && amostras_afla[i - 1].aflatoxina.mapReference != amostras_afla[i].aflatoxina.mapReference,
        _id: amostras_afla[i]._id
      }
    }
    //console.log('funcao compara');

    //console.log(resultado_afla);

  }



  //-----------------------------------Agora o processo se repete para todas as micotoxinas-----------------------------------------------------------------


  var mapas_deox = new Array;
  var amostras_deox = new Array;
  var Deoxconcentration_p = new Array;
  var DeoxAbsorbance_p = new Array;
  var kit_deox_ativo = await Kit.getActiveDeox();

  if (kit_deox_ativo.length != 0) {
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

    //parte responsável por pegar as amostras do kit de aflatoxina, logo  através do kit ativo de afla pega na variável mapArray o id dos mapas que estão sendo utilizados naqueles kits
    for (let i = 0; i < kit_deox_ativo[0].mapArray.length; i++) {
      mapas_deox[i] = await Workmap.getOneMap(kit_deox_ativo[0].mapArray[i]);
    }

    var cont_deox = 0;
    // ATE AQUI OK //console.log(mapas_deox);
    for (let j = 0; j < mapas_deox.length; j++) {
      for (let i = 0; i < mapas_deox[j].samplesArray.length; i++) {
        amostras_deox[cont_deox] = await Sample.getById(mapas_deox[j].samplesArray[i]);
        cont_deox++;
      }
    }
    var log_concentracao_deox = [Math.log10(Deoxconcentration_p[1]), Math.log10(Deoxconcentration_p[2]), Math.log10(Deoxconcentration_p[3]), Math.log10(Deoxconcentration_p[4])]; //eixo x
    var b_b0_deox = new Array;
    var ln_b_b0_deox = new Array;
    //console.log('log concentracao');
    //console.log(log_concentracao_deox);
    for (var i = 0; i < 4; i++) {
      b_b0_deox[i] = DeoxAbsorbance_p[i + 1] / DeoxAbsorbance_p[0];
    }
    //console.log('B B0');
    //console.log(b_b0_deox);
    for (var i = 0; i < b_b0_deox.length; i++) {
      ln_b_b0_deox[i] = Math.log10(b_b0_deox[i] / (1 - b_b0_deox[i]));
    }

    //console.log('ln_b_b0');
    //console.log(ln_b_b0_deox);


    const result_deox = regression.linear([[log_concentracao_deox[0], ln_b_b0_deox[0]], [log_concentracao_deox[1], ln_b_b0_deox[1]], [log_concentracao_deox[2], ln_b_b0_deox[2]]]);
    const slope_deox = result_deox.equation[0];// slope
    const yIntercept_deox = result_deox.equation[1];// intercept

    //console.log('slope');
    //console.log(slope_deox);
    //console.log('yintercept');
    //console.log(yIntercept_deox);

    var Deox_log_b_b0 = new Array;
    var Deox_log_b_b0_2 = new Array;

    for (let i = 0; i < amostras_deox.length; i++) {
      Deox_log_b_b0[i] = Math.log10((amostras_deox[i].deoxinivalenol.absorbance / DeoxAbsorbance_p[0]) / (1 - (amostras_deox[i].deoxinivalenol.absorbance / DeoxAbsorbance_p[0])));
      Deox_log_b_b0_2[i] = Math.log10((amostras_deox[i].deoxinivalenol.absorbance2 / DeoxAbsorbance_p[0]) / (1 - (amostras_deox[i].deoxinivalenol.absorbance2 / DeoxAbsorbance_p[0])));
    }

    for (let i = 0; i < Deox_log_b_b0.length; i++) {
      var avg = (amostras_deox[i].deoxinivalenol.absorbance + amostras_deox[i].deoxinivalenol.absorbance2) / 2;
      var avgcompara = (comparara(Deox_log_b_b0[i], yIntercept_deox, slope_deox) + comparara(Deox_log_b_b0_2[i], yIntercept_deox, slope_deox)) / 2;
      resultado_don[i] = {
        compara: avgcompara,
        average: avg,
        number: amostras_deox[i].samplenumber,
        changed_workmap: i != 0 && amostras_deox[i - 1].deoxinivalenol.mapReference != amostras_deox[i].deoxinivalenol.mapReference,
        _id: amostras_deox[i]._id
      };
    }
    //console.log('funcao compara');
    //console.log(resultado_deox);
  }


  ////console.log(amostras_deox.length);
  //for (let i = 0; i < amostras_deox.length; i++) {
  //console.log(amostras_deox[i]);
  //}

  var mapas_ota = new Array;
  var amostras_ota = new Array;
  var kit_ota_ativo = await Kit.getActiveOcra();
  ////console.log(kit_ota_ativo);
  var Otaconcentration_p = new Array;
  var OtaAbsorbance_p = new Array;



  if (kit_ota_ativo.length != 0) {
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
        //console.log('0000000000000000');

        //console.log(amostras_ota);

      }
    }

    var log_concentracao_ota = new Array;
    var b_b0_ota = new Array;
    var ln_b_b0_ota = new Array;
    //console.log('log concentracao');
    //console.log(log_concentracao_ota);
    for (var i = 0; i < 4; i++) {
      b_b0_ota[i] = OtaAbsorbance_p[i + 1] / OtaAbsorbance_p[0];
    }
    //console.log('B B0');

    //console.log(b_b0_ota);


    for (var i = 0; i < b_b0_ota.length; i++) {
      ln_b_b0_ota[i] = Math.log10(b_b0_ota[i] / (1 - b_b0_ota[i]));
    }
    //console.log('ln_b_b0');
    //console.log(ln_b_b0_ota);

    console.log("original----")
    console.log(log_concentracao_ota)
    console.log(ln_b_b0_ota)

    const result_ota = regression.linear([[log_concentracao_ota[0], ln_b_b0_ota[0]], [log_concentracao_ota[1], ln_b_b0_ota[1]], [log_concentracao_ota[2], ln_b_b0_ota[2]]]);
    const slope_ota = result_ota.equation[0];// slope
    const yIntercept_ota = result_ota.equation[1];// intercept

    //console.log('slope');
    //console.log(slope_ota);
    //console.log('yintercept');
    //console.log(yIntercept_ota);

    var Ota_log_b_b0 = new Array;
    var Ota_log_b_b0_2 = new Array;

    for (let i = 0; i < amostras_ota.length; i++) {
      Ota_log_b_b0[i] = Math.log10((amostras_ota[i].ocratoxina.absorbance / OtaAbsorbance_p[0]) / (1 - (amostras_ota[i].ocratoxina.absorbance / OtaAbsorbance_p[0])));
      Ota_log_b_b0_2[i] = Math.log10((amostras_ota[i].ocratoxina.absorbance2 / OtaAbsorbance_p[0]) / (1 - (amostras_ota[i].ocratoxina.absorbance2 / OtaAbsorbance_p[0])));
    }

    //console.log(Ota_log_b_b0);

    for (let i = 0; i < Ota_log_b_b0.length; i++) {
      var avg = (amostras_ota[i].ocratoxina.absorbance + amostras_ota[i].ocratoxina.absorbance2) / 2;
      var avgcompara = (comparara(Ota_log_b_b0[i], yIntercept_ota, slope_ota) + comparara(Ota_log_b_b0_2[i], yIntercept_ota, slope_ota)) / 2;
      resultado_ota[i] = {
        compara: avgcompara,
        average: avg,
        number: amostras_ota[i].samplenumber,
        changed_workmap: i != 0 && amostras_ota[i - 1].ocratoxina.mapReference != amostras_ota[i].ocratoxina.mapReference,
        _id: amostras_ota[i]._id
      };
    }
    //console.log('funcao compara');

    //console.log(resultado_ota);

  }



  var mapas_t2 = new Array;
  var amostras_t2 = new Array;
  var kit_t2_ativo = await Kit.getActiveT2();
  var T2concentration_p = new Array;
  var T2absorbance_p = new Array;

  if (kit_t2_ativo.length != 0) {
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

    var log_concentracao_t2 = [Math.log10(T2concentration_p[1]), Math.log10(T2concentration_p[2]), Math.log10(T2concentration_p[3]), Math.log10(T2concentration_p[4])]; //eixo x
    var b_b0_t2 = new Array;
    var ln_b_b0_t2 = new Array;
    //console.log('log concentracao');
    //console.log(log_concentracao_t2);
    for (var i = 0; i < 4; i++) {
      b_b0_t2[i] = T2absorbance_p[i + 1] / T2absorbance_p[0];
    }
    //console.log('B B0');

    //console.log(b_b0_t2);
    for (var i = 0; i < b_b0_t2.length; i++) {
      ln_b_b0_t2[i] = Math.log10(b_b0_t2[i] / (1 - b_b0_t2[i]));
    }


    //console.log('ln_b_b0');
    //console.log(ln_b_b0_t2);

    const result_t2 = regression.linear([[log_concentracao[0], ln_b_b0[0]], [log_concentracao[1], ln_b_b0[1]], [log_concentracao[2], ln_b_b0[2]]]);
    const slope_t2 = result_t2.equation[0];// slope
    const yIntercept_t2 = result_t2.equation[1];// intercept
    //console.log('slope');
    //console.log(slope_t2);
    //console.log('yintercept');
    //console.log(yIntercept_t2);


    var T2_log_b_b0 = new Array;
    var T2_log_b_b0_2 = new Array;

    for (let i = 0; i < amostras_t2.length; i++) {
      T2_log_b_b0[i] = Math.log10((amostras_t2[i].t2toxina.absorbance / T2absorbance_p[0]) / (1 - (amostras_t2[i].t2toxina.absorbance / T2absorbance_p[0])));
      T2_log_b_b0_2[i] = Math.log10((amostras_t2[i].t2toxina.absorbance2 / T2absorbance_p[0]) / (1 - (amostras_t2[i].t2toxina.absorbance2 / T2absorbance_p[0])));
    }
    //console.log(T2_log_b_b0);

    for (let i = 0; i < T2_log_b_b0.length; i++) {
      var avg = (amostras_t2[i].t2toxina.absorbance + amostras_t2[i].t2toxina.absorbance2) / 2;
      var avgcompara = (comparara(T2_log_b_b0[i], yIntercept_t2, slope_t2) + comparara(T2_log_b_b0_2[i], yIntercept_t2, slope_t2)) / 2;
      resultado_t2[i] = {
        compara: avgcompara,
        average: avg,
        number: amostras_t2[i].samplenumber,
        changed_workmap: i != 0 && amostras_t2[i - 1].t2toxina.mapReference != amostras_t2[i].t2toxina.mapReference,
        _id: amostras_t2[i]._id
      };
    }
    //console.log('funcao compara');

    //console.log(resultado_t2);




  }



  var Zeaconcentration_p = new Array;
  var ZeaAbsorbance_p = new Array;
  var mapas_zea = new Array;
  var amostras_zea = new Array;
  var kit_zea_ativo = await Kit.getActiveZea();
  if (kit_zea_ativo.length != 0) {
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
    var log_concentracao_zea = [Math.log10(Zeaconcentration_p[1]), Math.log10(Zeaconcentration_p[2]), Math.log10(Zeaconcentration_p[3]), Math.log10(Zeaconcentration_p[4])]; //eixo x
    var b_b0_zea = new Array;
    var ln_b_b0_zea = new Array;
    //console.log('log concentracao');
    //console.log(log_concentracao_zea);
    for (var i = 0; i < 4; i++) {
      b_b0_zea[i] = ZeaAbsorbance_p[i + 1] / ZeaAbsorbance_p[0];
    }

    //console.log('B B0');

    //console.log(b_b0_zea);

    for (var i = 0; i < b_b0_zea.length; i++) {
      ln_b_b0_zea[i] = Math.log10(b_b0_zea[i] / (1 - b_b0_zea[i]));
    }


    //console.log('ln_b_b0');
    //console.log(ln_b_b0_zea);

    const result_zea = regression.linear([[log_concentracao_zea[0], ln_b_b0_zea[0]], [log_concentracao_zea[1], ln_b_b0_zea[1]], [log_concentracao_zea[2], ln_b_b0_zea[2]]]);
    const slope_zea = result_zea.equation[0];// slope
    const yIntercept_zea = result_zea.equation[1];// intercept

    //console.log('slope');
    //console.log(slope_zea);
    //console.log('yintercept');
    //console.log(yIntercept_zea);

    var Zea_log_b_b0 = new Array;
    var Zea_log_b_b0_2 = new Array;

    for (let i = 0; i < amostras_zea.length; i++) {
      Zea_log_b_b0[i] = Math.log10((amostras_zea[i].zearalenona.absorbance / ZeaAbsorbance_p[0]) / (1 - (amostras_zea[i].zearalenona.absorbance / ZeaAbsorbance_p[0])));
      Zea_log_b_b0_2[i] = Math.log10((amostras_zea[i].zearalenona.absorbance2 / ZeaAbsorbance_p[0]) / (1 - (amostras_zea[i].zearalenona.absorbance2 / ZeaAbsorbance_p[0])));
    }

    //console.log(Zea_log_b_b0);
    for (let i = 0; i < Zea_log_b_b0.length; i++) {
      var avg = (amostras_zea[i].zearalenona.absorbance + amostras_zea[i].zearalenona.absorbance2) / 2;
      var avgcompara = (comparara(Zea_log_b_b0[i], yIntercept_zea, slope_zea) + comparara(Zea_log_b_b0_2[i], yIntercept_zea, slope_zea)) / 2;

      resultado_zea[i] = {
        compara: avgcompara,
        average: avg,
        number: amostras_zea.samplesnumber,
        changed_workmap: i != 0 && amostras_zea[i - 1].zearalenona.mapReference != amostras_zea[i].zearalenona.mapReference,
        _id: amostras_zea[i]._id
      };
    }
    //console.log('funcao compara');

    //console.log(resultado_zea);


  }

  var Fbsconcentration_p = new Array;
  var resultado_fbs = new Array;
  var Fbsabsorbance_p = new Array;
  var mapas_fbs = new Array;
  var amostras_fbs = new Array;
  var kit_fbs_ativo = await Kit.getActiveFum();
  if (kit_fbs_ativo.length != 0) {
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
      mapas_fbs[i] = await Workmap.getOneMap(kit_fbs_ativo[0].mapArray[i]);
    }
    var cont_fbs = 0;
    for (let j = 0; j < mapas_fbs.length; j++) {
      for (let i = 0; i < mapas_fbs[j].samplesArray.length; i++) {
        amostras_fbs[cont_fbs] = await Sample.getById(mapas_fbs[j].samplesArray[i]);

      }
    }

    var log_concentracao_fbs = [Math.log10(Fbsconcentration_p[1]), Math.log10(Fbsconcentration_p[2]), Math.log10(Fbsconcentration_p[3]), Math.log10(Fbsconcentration_p[4])]; //eixo x
    var b_b0_fbs = new Array;
    var ln_b_b0_fbs = new Array;
    //console.log('log concentracao');
    //console.log(log_concentracao_fbs);
    for (var i = 0; i < 4; i++) {
      b_b0_fbs[i] = Fbsabsorbance_p[i + 1] / Fbsabsorbance_p[0];
    }
    //console.log('B B0');

    //console.log(b_b0_fbs);
    for (var i = 0; i < b_b0_fbs.length; i++) {
      ln_b_b0_fbs[i] = Math.log10(b_b0_fbs[i] / (1 - b_b0_fbs[i]));
    }


    //console.log('ln_b_b0');
    //console.log(ln_b_b0_fbs);
    const result_fbs = regression.linear([[log_concentracao_fbs[0], ln_b_b0_fbs[0]], [log_concentracao_fbs[1], ln_b_b0_fbs[1]], [log_concentracao_fbs[2], ln_b_b0_fbs[2]]]);
    const slope_fbs = result_fbs.equation[0];// slope
    const yIntercept_fbs = result_fbs.equation[1];// intercept

    //console.log('slope');
    //console.log(slope_fbs);
    //console.log('yintercept');
    //console.log(yIntercept_fbs);

    var Fbs_log_b_b0 = new Array;
    var Fbs_log_b_b0_2 = new Array;

    for (let i = 0; i < amostras_fbs.length; i++) {
      Fbs_log_b_b0[i] = Math.log10((amostras_fbs[i].fumonisina.absorbance / Fbsabsorbance_p[0]) / (1 - (amostras_fbs[i].fumonisina.absorbance / Fbsabsorbance_p[0])));
      Fbs_log_b_b0_2[i] = Math.log10((amostras_fbs[i].fumonisina.absorbance2 / Fbsabsorbance_p[0]) / (1 - (amostras_fbs[i].fumonisina.absorbance2 / Fbsabsorbance_p[0])));
    }
    //console.log(Fbs_log_b_b0);


    for (let i = 0; i < Fbs_log_b_b0.length; i++) {
      var avg = (amostras_fbs[i].fumonisina.absorbance + amostras_fbs[i].fumonisina.absorbance2) / 2;
      var avgcompara = (comparara(Fbs_log_b_b0[i], yIntercept_fbs, slope_fbs) + comparara(Fbs_log_b_b0_2[i], yIntercept_fbs, slope_fbs)) / 2;
      resultado_fbs[i] = {
        compara: avgcompara,
        average: avg,
        number: amostras_fbs[i].samplenumber,
        changed_workmap: i != 0 && amostras_fbs[i - 1].fumonisina.mapReference != amostras_fbs[i].fumonisina.mapReference
      };
    }

    //console.log('funcao compara');
    //console.log(resultado_fbs);
  }
  var r1 = await calcular(ToxinasFull[0], ToxinasSigla[0]);
  var r2 = await calcular(ToxinasFull[1], ToxinasSigla[1]);
  var r3 = await calcular(ToxinasFull[2], ToxinasSigla[2]);
  var r4 = await calcular(ToxinasFull[3], ToxinasSigla[3]);
  var r5 = await calcular(ToxinasFull[4], ToxinasSigla[4]);
  var r6 = await calcular(ToxinasFull[5], ToxinasSigla[5]);

  //Finalizando a forma de como os dados serão enviados ao front
  var resultados = {}

  resultados[0] = { name: 'AFLA', result: resultado_afla };
  resultados[1] = { name: 'DON', result: resultado_don };
  resultados[2] = { name: 'OTA', result: resultado_ota };
  resultados[3] = { name: 'T2', result: resultado_t2 };
  resultados[4] = { name: 'ZEA', result: resultado_zea };
  resultados[5] = { name: 'FBS', result: resultado_fbs };

  res.render('sampleresult', { title: 'Curvas de Calibração', resultados });
});


router.post("/", async function (req, res, next) {
  var amostras = new Array;

  for (var i = 0; i < ToxinasSigla.length; i++) {
    amostras = req.body.sample[ToxinasSigla[i]];

    if (typeof amostras === 'object') {
      var kit = await Kit.getActiveID(ToxinasSigla[i]);
      console.log("kit id");

      console.log(kit);
      if (Array.isArray(amostras._id))
        for (var j = 0; j < amostras._id.length; j++) {
          Sample.finalizeSample(amostras._id[j], ToxinasFull[i], kit._id);
        }
      else
        Sample.finalizeSample(amostras._id, ToxinasFull[i], kit._id);
    }

    console.log("i: " + i);
    console.log("amostras");
    console.log(amostras);
    console.log(typeof amostras);
  }

  res.render('allworkmaps', { title: 'finalizado', amostras, toxinas: ToxinasSigla });
});

module.exports = router;
