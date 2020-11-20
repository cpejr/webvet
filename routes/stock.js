const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Kit = require('../models/kit');
const Workmap = require('../models/Workmap');
const Counter = require('../models/counter')

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

const KITS_PER_PAGE = 12;
router.get('/', auth.isAuthenticated, async function (req, res) {

  let promises = [Kit.getAllForStock(), Kit.getAllArchived(0, KITS_PER_PAGE), Kit.countAvailableWorkmaps(), Counter.getEntireKitStocks()];

  [resultActivesKits, resultDisabledKits, sumAmounts, reqKitstocks] = await Promise.all(promises);

  let kitstocks = [];
  for (let i = 0; i < sumAmounts.length; i++){
    let indSum = sumAmounts[i];
    let indKit = reqKitstocks[i];
    kitstocks[i] = {...indSum, minStock: indKit.minStock, name: indKit.name};
  }
  
  let number_of_pages = 0;
  if (resultDisabledKits.length > 0 ){
    number_of_pages = Math.ceil(resultDisabledKits[0].totalCount / KITS_PER_PAGE);
  }
  number_of_pages++;

  const oneDay = 24 * 60 * 60 * 1000;
  const now = Date.now();

  let activeKits = resultActivesKits.map(kit => processKit(kit));
  activeKits = activeKits.sort(dynamicSort('productCode'));

  let disabledKits = {};
  if(resultDisabledKits.length > 0){
    disabledKits = resultDisabledKits[0].kits.map(kit => processKit(kit));
  }

  function processKit(kit) {
    let expirationDate = new Date(`${kit.monthexpirationDate}/${kit.dayexpirationDate}/${kit.yearexpirationDate}`);

    let diffDays = Math.ceil((expirationDate - now) / oneDay);

    if (diffDays > 90)
      kit.color = "Green"
    else if (diffDays >= 30)
      kit.color = "Yellow"
    else
      kit.color = "Red"

    return kit;
  }

  res.render('stock/index', { title: 'Kits', disabledKits, activeKits, number_of_pages, layout: 'layoutDashboard.hbs', kitstocks, ...req.session });
});

router.get('/archived', async (req, res) => {
  let page = req.query.page

  res.send((await Kit.getAllArchived(page, KITS_PER_PAGE))[0].kits);
});

router.post('/setstock', auth.isAuthenticated, async function (req, res) {
  let params = req.body;
  let kitstocks = [];
  for (let i = 0; i < ToxinasFull.length; i++) {
    toxiName = ToxinasFull[i];
    kitstocks.push({ name: toxiName, minStock: params[toxiName] });
  }
  await Counter.setKitStocks(kitstocks);
  res.redirect('/stock');
})

router.get('/edit/:id', auth.isAuthenticated, function (req, res) {
  Kit.getById(req.params.id).then((kit) => {
    res.render('stock/edit', { title: 'Edit Kit', layout: 'layoutDashboard.hbs', kit, ...req.session });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/edit/:id', auth.isAuthenticated, function (req, res) {
  const kit = req.body;
  Kit.findByIdAndEdit(req.params.id, kit).then((response) => {
    req.flash('success', 'Kit alterado com sucesso.');
    res.redirect(`/stock/edit/${req.params.id}`);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.get('/new', auth.isAuthenticated, function (req, res) {
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
    res.redirect('/stock');
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/decreaseAmount/:kitid/', function (req, res) {
  Kit.decreaseAmount(req.params.kitid).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

router.post('/increaseAmount/:kitid/', function (req, res) {
  Kit.increaseAmount(req.params.kitid).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});


module.exports = router;
