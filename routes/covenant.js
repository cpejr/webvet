const express = require('express');
const router = express.Router();

const auth = require('./middleware/auth');
const Covenant = require('../models/covenant');
const User = require('../models/user');

router.get('/', auth.isAuthenticated, async function (req, res){
    let covenants = await Covenant.getAll();
    let managers = await User.getByQuery({type: "Gerencia", status: "Ativo", deleted: false});
    res.render('covenant', { title: 'Convênios', layout: 'layoutDashboard.hbs', covenants, managers });
});

router.post('/new', auth.isAuthenticated, auth.isFromLab, async function (req, res){
    let { covenant } = req.body;
    console.log(covenant);

    await Covenant.create(covenant);

    res.redirect('/covenant');
});

router.get('/edit/:id', auth.isAuthenticated, async function (req, res){
    let { id } = req.params;
    let covenant = await Covenant.findById(id);
    let managers = covenant.managers;
    res.render('covenant/show', { title: 'Convênios', layout: 'layoutDashboard.hbs', managers});
});

router.post('/delete/:id', auth.isAuthenticated, auth.isAdmin, async function (req, res){
    let { id } = req.params;
    await Covenant.delete(id);
    res.redirect('/covenant');
});

module.exports = router;