var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  User.getAll().then((users) => {
    console.log(users);
    res.render('admin/queue', { title: 'Usuários', layout: 'layoutDashboard.hbs', users, ...req.session });

    return;
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
    return error;
  });
});

module.exports = router;
