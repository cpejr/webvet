var express = require('express');
var firebase = require('firebase');
var router = express.Router();
const User = require('../models/user');
const Kit = require('../models/kit');
const Mycotoxin = require('../models/mycotoxin');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});


router.get('/queue', (req, res) => {
  res.render('queue', { title: 'Queue' });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.get('/signup', (req, res) => {
  res.render('form', { title: 'signup', layout: 'layout' });
});

router.get('/user', (req, res) => {
  res.render('user', { title: 'User', layout: 'layoutDashboard' });
});

router.get('/forgotPassword', (req, res) => {
  res.render('forgotPassword', { title: 'forgotPassword' });
});

/**
 * POST LOGIN
 */

router.post('/login',(req,res)=> {
  const userData  = req.body.user;
    firebase.auth().signInWithEmailAndPassword(userData.email, userData.password).then((userID) => {
    console.log(userID);
     res.redirect('/user');
   }).catch(function(error) {
     // Handle Errors here.
     var errorCode = error.code;
     var errorMessage = error.message;
     // ...
   });
});

router.post('/signup', (req, res) => {
  const { user } = req.body;
  console.log(user);
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then((userF) => {
    user.uid = userF.uid;
    User.create(user).then((id) => {
      console.log(`Created new user with id: ${id}`);
      req.flash('success', 'Cadastrado com sucesso. Aguarde aprovação');
      res.redirect('/login');
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

//POST password reset
router.post('/forgotPassword', (req, res) => {
  var emailAddress = req.user.email;
  console.log(emailAddress);
  firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

// GET /logout
router.get('/logout', (req, res, next) => {
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
