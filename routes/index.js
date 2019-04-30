var express = require('express');
var firebase = require('firebase');
var router = express.Router();
const firebase = require('firebase');
const User = require('../models/user');
const Kit = require('../models/kit');
const Mycotoxin = require('../models/mycotoxin');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', (req, res) => {
  res.render('login', {title:'Login'});
});

router.get('/form', (req, res) => {
  res.render('form', {title:'Form'});
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

  firebase.auth().signInWithEmailAndPassword(email, password).then((userID) => {

<<<<<<< HEAD
=======
  firebase.auth().signInWithEmailAndPassword(user.email, user.password).then((userID) => {

>>>>>>> master
  /* console.log(userID);*/
   res.redirect('/user');
 }).catch(function(error) {
   // Handle Errors here.
   var errorCode = error.code;
   var errorMessage = error.message;
   // ...
 });
});

//get /logout

router.get('/logout',(req,res) => {
    firebase.auth().signOut().then(function() {
      console.log('Signed Out');
      res.redirect('/login');
    }, function(error) {
      console.error('Sign Out Error', error);
    });
});



module.exports = router;
