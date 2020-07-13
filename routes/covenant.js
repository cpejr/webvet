const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const auth = require('./middleware/auth');
const Covenant = require('../models/covenant');
const User = require('../models/user');

router.get('/', auth.isAuthenticated, async function (req, res){
    let covenants = await Covenant.getAll();
    let hasCovenant = (covenants.length > 0) ? true : false;
    let managers = await User.getByQuery({type: "Gerencia", status: "Ativo", deleted: false});
    res.render('covenant', { title: 'Convênios', layout: 'layoutDashboard.hbs', covenants, managers, hasCovenant });
});

router.post('/new', auth.isAuthenticated, auth.isFromLab, async function (req, res){
    let { covenant } = req.body;

    let users = covenant.managers;
    users.push(covenant.admin);

    let objects = [];
    await users.forEach(user =>{
        objects.push(mongoose.Types.ObjectId(user));
    })

    await Covenant.create(covenant);
    console.log("Usuarios para adicionar convenio: ",objects);
    await User.addCovenant(objects);

    res.redirect('/covenant');
});

router.get('/edit/:id', auth.isAuthenticated, async function (req, res){
    let { id } = req.params;
    const promises = [
        Covenant.findById(id),
        User.getAllActiveManagers(),
    ]

    const [
        covenant,
        allManagers,
    ] = await Promise.all(promises);

    let managers = [];
    if(covenant.managers){
        managers = covenant.managers;
    }

    managers.forEach((element) =>{
        element.covId = covenant._id
    })

    res.render('covenant/show', { title: 'Convênios', layout: 'layoutDashboard.hbs', covenant, managers, allManagers});
});

router.post('/delete/:id', auth.isAuthenticated, auth.isAdmin, async function (req, res){
    let { id } = req.params;
    let users = await Covenant.delete(id);
    let objects = [];
    await users.forEach(user =>{
        objects.push(mongoose.Types.ObjectId(user));
    })
    console.log("Usuarios para remover: ",objects);
    User.removeCovenant(objects);
    res.redirect('/covenant');
});

router.post('/addManagers/:id', auth.isAuthenticated, auth.isAdmin, async function (req, res){
    let { id } = req.params;
    let { managers } = req.body;
    await Covenant.addManagers(id, managers);
    res.redirect(`/covenant/edit/${id}`);
})

module.exports = router;