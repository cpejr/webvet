const express = require('express');
const router = express.Router();
const auth = require('./middleware/auth');
const Requisition = require('../models/requisition');
const Sample = require('../models/sample');
const Kitstock = require('../models/kitstock');

router.get('/', auth.isAuthenticated, function (req, res) {
    res.render('statistics/index', { title: 'Gráficos', layout: 'layoutDashboard.hbs', ...req.session });
});

router.get('/barcharts'/*, auth.isAuthenticated*/, function (req, res) {
    res.render('statistics/barcharts', { title: 'Gráficos', layout: 'layoutDashboard.hbs', ...req.session });
});

router.get('/boxcharts', auth.isAuthenticated, (req, res) => {
    res.render('statistics/boxcharts', { title: 'Gráficos', layout: 'layoutDashboard.hbs', ...req.session });
});

router.get('/statesData', (req, res)=>{
    Requisition.getStateData();
});

module.exports = router;