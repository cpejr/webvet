const express = require(express);
const router = express.Routes();

const auth = require('./middleware/auth');
const Covenant = require('../models/covenant');

router.get('/', async function (req, res){

});

module.exports = router;