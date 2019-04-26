const express = require('express');
const router = express.Router();
const Mycotoxin = require('../models/mycotoxin');
const Kit = require('../models/kit');
const User = require('../models/user');


/* GET home page. */
router.get('/', function(req, res, next) {
  Kit.getAll().then((kits) => {
    console.log(kits);
    res.render('stock/index', { title: 'Kits', layout: 'layoutDashboard.hbs',});
  })
});

router.get('/:id', function(req, res, next) {
  Kit.getById(req.params.id).then((kit) => {
    //console.log(kit);
    res.render('stock/edit', { title: 'Show Kit', layout: 'layoutDashboard.hbs', kit });
  })


});

// router.get('/:id/edit', function(req, res, next) {
//   Kit.getById(req.params.id).then((kit) => {
//     console.log(kit);
//     res.render('stock/edit', { title: 'Edit Kit', layout: 'layoutDashboard.hbs', kit });
//   })
// });

router.put('/:id', function(req, res, next) {
  const { kit } = req.body;
  //
  Kit.update(req.params.id, kit).then(() => {
    res.redirect(`/stock/${req.params.id}`)
    // res.render('show', { title: 'Show Kit', layout: 'layoutDashboard.hbs', kit });
  })
});
module.exports = router;
