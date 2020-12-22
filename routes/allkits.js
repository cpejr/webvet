const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Kit = require('../models/kit');


router.get('/', auth.isAuthenticated, function (req, res) {
  Kit.getAll().then((kits) => {
    res.render('allkits', { title: 'Histórico dos kits', layout: 'layoutDashboard.hbs', kits });
  })
});

module.exports = router;