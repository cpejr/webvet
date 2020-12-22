const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

/* GET home page. */
router.get('/', auth.isAuthenticated, auth.isFromLab, function (req, res) {
  res.render('admin/cardsAdmin', { title: 'Dashboard do Administrador', layout: 'layoutDashboard.hbs' });
});

module.exports = router;
