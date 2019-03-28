var express = require('express');
var firebase = require('firebase');
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

  firebase.auth().signInWithEmailAndPassword(user.email, user.password).then((userID) => {

  /* console.log(userID);*/
   res.redirect('/user');
 }).catch(function(error) {
   // Handle Errors here.
   var errorCode = error.code;
   var errorMessage = error.message;
   // ...
 });
});

module.exports = router;
