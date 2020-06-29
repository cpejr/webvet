const express = require('express');
const router = express.Router();
const auth = require('./middleware/auth');
const Requisition = require('../models/requisition');
const Sample = require('../models/sample');

router.get('/', auth.isAuthenticated, function (req, res) {
    res.render('statistics/index', { title: 'Gráficos', layout: 'layoutDashboard.hbs', ...req.session });
});

router.get('/barcharts', auth.isAuthenticated, function (req, res) {
    res.render('statistics/barcharts', { title: 'Gráficos', layout: 'layoutDashboard.hbs', ...req.session });
});

router.get('/boxcharts', auth.isAuthenticated, (req, res) => {
    res.render('statistics/boxcharts', { title: 'Gráficos', layout: 'layoutDashboard.hbs', ...req.session });
});

router.get('/statesData', auth.isAuthenticated, async (req, res) => {
    let data = await Requisition.getStateData();
    res.send(data);
});

router.get('/resultsData', async (req, res) => {
    let data = await Sample.getResultData();
    res.send(data);
});

router.get('/samplesData', auth.isAuthenticated, async (req, res) => {
    let data = await Sample.getSampleData();
    res.send(data);
});

router.get('/animalsData', auth.isAuthenticated, async (req, res) => {
    let data = await Requisition.getAnimalData();
    res.send(data);
});

router.get('/finalizationData', auth.isAuthenticated, async (req, res) =>{
    let data = await Sample.getFinalizationData();
    res.send(data);
});


module.exports = router;