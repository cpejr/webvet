const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Kit = require('../models/kit');
const User = require('../models/user');
const Workmap = require('../models/Workmap');
const Kitstock = require('../models/kitstock');
const Sample = require('../models/sample');


//a 1 é a data de validade e a 2 é a data de hoje
//retorna falso  == da vermelho
function datavalida(d1, m1, a1, d2, m2, a2) {

  if (a1 > a2) {
    return true;
  }
  if (a1 >= a2 && m1 > m2) {
    return true;
  }
  if (a1 >= a2 && m1 == m2 && d1 >= d2) {
    return true;
  }
  return false;
}

/* GET home page. */
router.get('/', auth.isAuthenticated, function (req, res, next) {
  Kit.getAll().then((kits) => {
    if (kits && kits.length > 0){
      kits.forEach(element => {
        Kit.update(element._id, element);
      });
    }
    Kitstock.getAll().then((kitstocks) => {
      var today = new Date();
      var kit90 = new Array;
      var kit60 = new Array;
      var kit30 = new Array;
      var cont90 = 0;
      var cont60 = 0;
      var cont30 = 0;
      var cont = 0;
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      var oneDay = 24 * 60 * 60 * 1000;
      var stockMap = new Map();
      for (var i = 0; i < kits.length; i++) {
        var firstDate = new Date(yyyy, mm, dd);
        var secondDate = new Date(kits[i].yearexpirationDate, kits[i].monthexpirationDate, kits[i].dayexpirationDate);
        var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
        if (diffDays > 90 && datavalida(kits[i].dayexpirationDate, kits[i].monthexpirationDate, kits[i].yearexpirationDate, dd, mm, yyyy) == true) {
          kit90[cont90] = kits[i];
          cont90++;
        }
        else if (diffDays <= 90 && diffDays >= 30) {
          kit60[cont60] = kits[i];
          cont60++;
        }
        else if (diffDays < 30 || datavalida(kits[i].dayexpirationDate, kits[i].monthexpirationDate, kits[i].yearexpirationDate, dd, mm, yyyy) == false) {
          kit30[cont30] = kits[i];
          cont30++;
        }
      }
      res.render('stock/index', { title: 'Kits', kit30, kit60, kit90, kitstocks, layout: 'layoutDashboard.hbs', ...req.session, kits });
    })
  })
});






router.get('/stock', auth.isAuthenticated, (req, res) => {
  Kit.getAll().then((kits) => {
    Kitstock.getAll().then((kitstocks) => {
      var stockMap = new Map();

      for (var i = 0; i < kits.length; i++) {
        if (stockMap.has(kits[i].productCode) == true) {
          if (!(kits[i].deleted)) {
            x = stockMap.get(kits[i].productCode);
            stockMap.set(kits[i].productCode, kits[i].amount + x);
          }
        }
        else {
          if (!(kits[i].deleted)) {
            stockMap.set(kits[i].productCode, kits[i].amount);
          }
        }
      }
      console.log(stockMap);

      res.send({ stockMap: [...stockMap] });
      // var a2 = ["oi", "tchau"];

    });
  });
});




router.get('/show/:id', auth.isAuthenticated, function (req, res, next) {
  Kit.getById(req.params.id).then((kit) => {
    //console.log(kit);
    res.render('stock/show', { title: 'Show Kit', layout: 'layoutDashboard.hbs', kit, ...req.session });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });


});

router.get('/edit/:id', auth.isAuthenticated, function (req, res, next) {
  Kit.getById(req.params.id).then((kit) => {
    console.log(kit);
    res.render('stock/edit', { title: 'Edit Kit', layout: 'layoutDashboard.hbs', kit, ...req.session });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/edit/:id', auth.isAuthenticated, function (req, res, next) {
  const { kit } = req.body;
  Kit.update(req.params.id, kit).then(() => {
    req.flash('success', 'Kit alterado com sucesso.');
    res.redirect(`/stock/show/${req.params.id}`);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});


router.get('/new', auth.isAuthenticated, function (req, res) {
  console.log(req.session.user);
  res.render('stock/newkit', { title: 'Novo Kit', layout: 'layoutDashboard.hbs', ...req.session });
});

router.post('/new', auth.isAuthenticated, function (req, res) {
  const { kit } = req.body;
  // if (kit.productCode[0] == "Outros") {
  //   kit.productCode = kit.productCode[1];
  // } else {
  //   kit.productCode = kit.productCode[0];
  // }

  kit.stripLength = kit.amount;

  Kit.getAll().then((kitsB) => {
    let alreadyExists = false;
    for (let i = 0; i < kitsB.length; i++) {
      if (kitsB[i].productCode == kit.productCode && kitsB[i].kitType == kit.kitType && !(kitsB[i].deleted)) {
        //if it gets in this, it means there's already a kit with this code and not yet deleted
        alreadyExists = true;
      }
    }
    if (!alreadyExists) {
      Kit.create(kit).then(async (id) => {
        console.log(kit);
        var size = req.body.kit.amount;

        let promises = [];

        for (i = 0; i < size; i++) {
          const workmap = {
            productCode: req.body.kit.productCode,
            mapID: i,
          }
          promises[i] = Workmap.create(workmap);
        }

        let workmapIds = await Promise.all(promises);

        Kit.addMaps(id, workmapIds).catch((error) => {
          console.log(error);
          res.redirect('/error');
        });

      }).then(() => {
        req.flash('success', 'Kit adicionado com sucesso.');
        res.redirect('/stock');
      }).catch((error) => {
        console.log(error);
        res.redirect('/error');
      });

    }
    else {
      req.flash('danger', 'Já existe um kit com esse código e mesmo tipo cadastrado');
      res.redirect('/stock');
    }
  }).catch(err => {
    res.redirect('/error');
  });
});

router.post('/delete/:id', auth.isAuthenticated, function (req, res) {
  Kit.delete(req.params.id).then(() => {
    console.log('ENTROOOUUUUU');
    res.redirect('/stock');
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/decreaseAmount/:kitid/', function (req, res, next) {
  Kit.decreaseAmount(req.params.kitid).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/increaseAmount/:kitid/', function (req, res, next) {
  Kit.increaseAmount(req.params.kitid).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});










module.exports = router;
