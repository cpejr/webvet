const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Kit = require('../models/kit');

/* GET home page. */
router.get('/', auth.isAuthenticated, function (req, res) {
  let copy = ToxinasAll;
  Kit.getAllActive().then((kits) => {
    for (let i = 0; i < kits.length; i++) {
      let sigla = kits[i].productCode.replace(" Romer", "");

      //Correção provisória do problema com a sigla
      if (sigla === "FUMO")
        sigla = "FBS"

      let index = ToxinasSigla.indexOf(sigla);

      copy[index].active = kits[i].kitType;
    }
    res.render('admin/queue', { toxinas: copy, title: 'Queue', layout: 'layoutDashboard.hbs', ...req.session });
  });
});

module.exports = router;
