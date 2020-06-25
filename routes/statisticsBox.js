const express = require('express');
const router = express.Router();
const Sample = require('../models/sample');

router.get('/resultsData', async (req, res) => {
    let data = await Sample.getResultData();
    res.send(data);
});