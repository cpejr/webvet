var express = require('express');
var firebase = require('firebase');
const User = require('../models/user');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/queue', (req, res) => {
  res.render('queue', {title:'Queue'});
});

router.get('/login', (req, res) => {
  res.render('login', {title:'Login'});
});

router.get('/signup', (req, res) => {
  res.render('form', {title:'signup', layout:'layout'});
});

router.get('/user', function(req, res, next) {
  res.render('user', {title:'User'});
});

/**
 * POST LOGIN
 */

router.post('/login',(req,res)=> {
  const { email } = req.body.user;
  const { password } = req.body.user;

  firebase.auth().signInWithEmailAndPassword(user.email, user.password).then((userID) => {
    console.log('Logou o usuário');
  /* console.log(userID);*/
   res.redirect('/user');
 }).catch(function(error) {
   // Handle Errors here.
   var errorCode = error.code;
   var errorMessage = error.message;
   // ...
 });
});

router.post('/signup',(req,res)=> {
  const { user } = req.body;
  console.log(user);
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then((userF) => {
    userF.uid = user.uid;
    console.log('ATE AQUI OK');
    User.create(user).then((id) => {
      req.session.fullname = user.fullname;
      req.session.persontype = user.persontype;
      req.session.register = user.register;
      req.session.address.cep = user.address.cep;
      req.session.address.street = user.address.street;
      req.session.address.number = user.address.number;
      req.session.address.complement = user.address.complement;
      req.session.address.city = user.address.city;
      req.session.address.state = user.address.state;
      req.session.email = user.email;
      req.session.phone = user.phone;
      req.session.cellphone = user.cellphone;
      console.log(`Created new user with id: ${id}`);
      req.flash('success', 'Cadastrado com sucesso. Aguarde aprovação');
  });
  }).catch((error) => {
    // Handle Errors here.
    console.log('Ta dando erro');
    res.redirect('login');
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
});

// GET /logout
router.get('/logout', function(req, res, next) {

  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/login');
      }
    });
  }
});


module.exports = router;
