var express = require('express');
var firebase = require('firebase');
const User = require('../models/user');

var router = express.Router();

router.get('/', (req, res) => {
  res.render('test', { title: 'Teste' });
});

router.post('/signup', (req, res) => {
  const { user } = req.body;
  console.log(user);
  // firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then((userF) => {
  //   user.uid = userF.uid;
  //   delete user.password;
  //   User.create(user).then((id) => {
  //     console.log(`Created new user with id: ${id}`);
  //     req.flash('success', 'Cadastrado com sucesso. Aguarde aprovação');
  //     res.redirect('/');
  //   });
  // }).catch((error) => {
  //   console.log(error);
  //   res.redirect('/error');
  // });
});


module.exports = router;
