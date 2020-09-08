const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const auth = require('./middleware/auth');
const Covenant = require('../models/covenant');
const User = require('../models/user');

router.get('/', auth.isAuthenticated, auth.isFromLab, async function (req, res) {
    const covenants = await Covenant.getAll();
    const hasCovenant = (covenants.length > 0) ? true : false;

    const managers = await User.getAllActiveUnaffiliatedManagers();
    const canCreate = (managers.length >= 2) ? true : false;
    const manaNumber = managers.length;
    res.render(
        'covenant',
        {
            title: 'Convênios',
            layout: 'layoutDashboard.hbs',
            covenants,
            managers,
            hasCovenant,
            canCreate,
            manaNumber,
            ...req.session
        }
    );
});

router.post('/new', auth.isAuthenticated, auth.isFromLab, async function (req, res) {
    const { covenant } = req.body;
    // console.log("Convenio a ser criado:", covenant);

    let users = [...covenant.managers];
    if (!Array.isArray(covenant.managers)) users = [covenant.managers];
    users.push(covenant.admin);

    let objects = [];
    await users.forEach(user => {
        objects.push(mongoose.Types.ObjectId(user));
    })
    // console.log("Convenio a ser criado:", covenant);
    await Covenant.create(covenant);
    // console.log("Usuarios para adicionar isOnCovenant: ", objects);
    await User.addCovenant(objects);

    res.redirect('/covenant');
});

router.get('/edit/:id', auth.isAuthenticated, async function (req, res) {
    const { id } = req.params;
    const promises = [
        Covenant.findById(id),
        User.getAllActiveUnaffiliatedManagers(),
    ]

    const [
        covenant,
        allManagers,
    ] = await Promise.all(promises);

    let managers = [];
    if (covenant.managers) {
        managers = covenant.managers;
    }

    const hasManagers = (managers.length > 0) ? true : false;
    const haveAvailable = (allManagers.length > 0) ? true : false;

    managers.forEach((element) => {
        element.covId = covenant._id
    })

    res.render(
        'covenant/show',
        {
            title: 'Convênios',
            layout: 'layoutDashboard.hbs',
            covenant,
            managers,
            allManagers,
            hasManagers,
            haveAvailable,
            ...req.session
        }
    );
});

router.post('/delete/:id', auth.isAuthenticated, auth.isAdmin, async function (req, res) {
    const { id } = req.params;
    const users = await Covenant.delete(id);
    let objects = [];
    await users.forEach(user => {
        objects.push(mongoose.Types.ObjectId(user));
    })
    // console.log("Usuarios para remover: ", objects);
    User.removeCovenant(objects);
    res.redirect('/covenant');
});

router.post('/addManagers/:id', auth.isAuthenticated, auth.isAdmin, async function (req, res) {
    const { id } = req.params;
    const { managers } = req.body;

    let users = managers;
    if (!Array.isArray(managers)) users = [managers];

    await Covenant.addManagers(id, managers);
    await User.addCovenant(users);
    res.redirect(`/covenant/edit/${id}`);
})

module.exports = router;