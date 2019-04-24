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
  res.render('form', {title:'signup'});
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
  User.create(user).then((id) => {
    console.log(`Created new user with id: ${id}`);
    req.flash('success', 'Cadastrado com sucesso. Aguarde aprovação');
    res.redirect('/login');
  }).catch((error) => {
    // Handle Errors here.
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
