const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/producers', (req, res) => {
  const names = [];
  const query = { active: true };
  const sort = { name: 1 };
  User.getAll().then((producers) => {
    producers.forEach((producer) => {
      if(producer.type=="Produtor") {
        names.push(producer.fullname);
      }
    });
    console.log(names);
    res.send(names);
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

module.exports = router;
