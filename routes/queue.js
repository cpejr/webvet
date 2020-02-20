const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Sample = require('../models/sample');
const Requisition = require('../models/requisition');
const User = require('../models/user');
const Kit = require('../models/kit');

// O IS isAuthenticated TA COMENTADO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


/* GET home page. */
router.get('/', auth.isAuthenticated, function (req, res, next) {
  let copy = ToxinasAll;
  Kit.getAllActive().then((kits) => {
    for (let i = 0; i < kits.length; i++) {
      let sigla = kits[i].productCode.replace(" Romer", "");

      //Correção provisória do problema com a sigla
      if (sigla === "FUMO")
        sigla = "FBS"

      let index = ToxinasSigla.indexOf(sigla);

      copy[ToxinasFull[index]].active = kits[i].kitType;
    }
    res.render('admin/queue', { toxinas: copy, title: 'Queue', layout: 'layoutDashboard.hbs', ...req.session });
  });
});

module.exports = router;
