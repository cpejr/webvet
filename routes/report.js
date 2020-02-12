var express = require('express');
var firebase = require('firebase');
var router = express.Router();
const auth = require('./middleware/auth');
const User = require('../models/user');
const Requisition = require('../models/requisition');
const Kit = require('../models/kit');
const Mycotoxin = require('../models/mycotoxin');
const Email = require('../models/email');
const Workmap = require('../models/Workmap');
const Sample = require('../models/sample');

router.get('/', auth.isAuthenticated, function (req, res, next) {
  Requisition.getAll().then((requisitions) => {
    var user = req.session.user.register;
    var logados = new Array;
    var usuarios = new Array;
    var countlogados = 0;
    for (var i = 0; i < requisitions.length; i++) {
      if (requisitions[i].user.register == user) {
        logados[countlogados] = requisitions[i];
        countlogados++;
      } else {
        console.log("nadinha");
      }
    }
    res.render('report/index', { title: 'Requisições Disponíveis', layout: 'layoutDashboard.hbs', ...req.session, logados });
  });
});

router.get('/show/:id', auth.isAuthenticated, function (req, res, next) {
  Sample.getById(req.params.id).then((sample) => {
    res.render('report/show', { title: 'Show ', sample });
    console.log(sample);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/show/admin/:id', /* auth.isAuthenticated, */ function (req, res, next) {
  function arrayContains(needle, arrhaystack) {
    return (arrhaystack.indexOf(needle) > -1);
  }

  Sample.getById(req.params.id).then((sample) => { //Função que busca os kits usando o kitId dos samples.
    const ToxinasLower = ['aflatoxina', 'deoxinivalenol', 'fumonisina', 'ocratoxina', 't2toxina', 'zearalenona'];
    const ToxinasFormal = ['Aflatoxinas', 'Deoxinivalenol', 'Fumonisinas', 'Ocratoxina A', 'T-2 toxina', 'Zearalenona'];
    const productCode = ['AFLA Romer', 'DON Romer', 'FUMO Romer', 'OCRA Romer', 'T2 Romer', 'ZEA Romer'];
    var toxiKit = {};
    var listIds = [];
    for (i = 0; i < ToxinasLower.length; i++) {
      console.log(i + " KitId " + ToxinasLower[i]);
      toxiKit = sample[ToxinasLower[i]];
      console.log(toxiKit);
      if (toxiKit.kitId !== null) {
        listIds.push(toxiKit.kitId);
      }

    }

    Kit.getByIdArray(listIds).then((kits) => {
      var orderedKits = [];
      var kit = {};
      var name = {};
      var listNames = [];
      for (i = 0; i < productCode.length; i++) {
        console.log("Entrou no primeiro for.");
        for (j = 0; j < kits.length; j++) {
          console.log("Entrou no segundo for.");
          if (kits[j].productCode === productCode[i]) {
            console.log("kits[j].productCode: " + kits[j].productCode);
            console.log("productCode[i]: " + productCode[i]);
            kit = kits[j];
            name = ToxinasLower[i];
            listNames.push(ToxinasLower[i]);
            orderedKits.push({ kit, name });
          }
        }
      }

      for (h = 0; h < ToxinasLower.length; h++) {
        if (!arrayContains(ToxinasLower[h], listNames)){
          kit = {
            Loq: NaN,
            Lod: NaN,
          };
          name = ToxinasLower[h];
          orderedKits.push({ kit, name });
        }
      }

      console.log("Resultado Final?")
      console.log(orderedKits);
      var Values = {}
      var toxinaData = {
        Sample: sample,
        Values,
      };
      var Name = {};
      var Pair = {};
      for (var k = 0; k < orderedKits.length; k++) {
        if (orderedKits[k].kit !== undefined && orderedKits[k].kit !== null) {
          for(m = 0; m < ToxinasLower.length; m++){
            if(ToxinasLower[m] === orderedKits[k].name){
              Pair = orderedKits[k];
              Name = ToxinasFormal[m];
              Values[m] = { Name, Pair };
            }
          }
        } else {
          console.log("Algo deu errado, o kit em orderedKits[k] nao deveria estar desse jeito, vai dar merda");
          Pair.name = orderedKits[k].name;
          Name = ToxinasFormal[k];
          Values.push({ Name, Pair });
        }
        
      }

      console.log("Objeto final: ");
      console.log(toxinaData);
      
      var data = {};
      Requisition.getById(sample.requisitionId).then((requisition) => {
        data.toxinas = requisition.mycotoxin;
        data.requisitionnumber = requisition.requisitionnumber;
        data.year = requisition.createdAt.getFullYear();
      }).then((tu) => {
        res.render('report/editAdmin', { title: 'Show ', sample, toxinaData, data });
      });
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/show/admin/:id', auth.isAuthenticated, async function (req, res, next) {
  var concentrations = req.body;
  var id = req.params.id;
  try {
    await Sample.updateAflaConcentration(id, concentrations.aflatoxinaConc);
    await Sample.updateDeoxinivalenolConcentration(id, concentrations.deoxConc);
    await Sample.updateFumonisinaConcentration(id, concentrations.fumoConc);
    await Sample.updateOcraConcentration(id, concentrations.ocratoxConc);
    await Sample.updateT2Concentration(id, concentrations.T2Conc);
    await Sample.updateZeaConcentration(id, concentrations.ZearalenonaConc);
    await Sample.updateDescription(id, concentrations.Description);
    req.flash('success', 'Atualizado com sucesso.');
    res.redirect('/report/show/admin/' + id);
  }
  catch (err) {
    req.flash('danger', 'Problem ao atualizar');
    res.redirect('/report/show/admin/' + id);
  }
});

router.get('/samples/:id', auth.isAuthenticated, function (req, res, next) {
  var amostras = new Array;
  var teste1 = new Array;
  Requisition.getById(req.params.id).then((requisitions) => {
    amostras = requisitions.samples;
    Sample.getById(amostras).then((tututu) => {
      for (var i = 0; i < amostras.length; i++) {
        teste1[i] = tututu[i];
        console.log("DEEEEEEEEEEEEEU");
        console.log(teste1[i]);
      }
      res.render('report/samples', { title: 'Amostas', layout: 'layoutDashboard.hbs', teste1 });
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/admreport', auth.isAuthenticated || is.Admin || is.Analista, function (req, res, next) {
  var laudos = new Array;
  let result = {};

  Sample.getAllReport().then((amostras) => {
    let reqids = [];

    for (var i = 0; i < amostras.length; i++)
      reqids.push(amostras[i].requisitionId);

    Requisition.getByIdArray(reqids).then((requisitions) => {
      for (let j = 0; j < amostras.length; j++) {
        for (let k = 0; k < requisitions.length; k++) {
          if (JSON.stringify(amostras[j].requisitionId) === JSON.stringify(requisitions[k]._id))//Check if is equal
            result[j] = {
              number: requisitions[k].requisitionnumber,
              year: requisitions[k].createdAt.getFullYear(),
              _id: amostras[j]._id,
            }
        }
      }
    }).then((params) => {
      res.render('report/admreport', { title: 'Laudos Disponíveis', layout: 'layoutDashboard.hbs', ...req.session, result });
    });
  });
});

module.exports = router;