var express = require('express');
var firebase = require('firebase');
var router = express.Router();
const User = require('../models/user');
const Kit = require('../models/kit');
const Mycotoxin = require('../models/mycotoxin');
const auth = require('./middleware/auth');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login', layout: 'layout' });
});

router.get('/signup', (req, res) => {
  res.render('form', { title: 'signup', layout: 'layout' });
});

/**
 * POST LOGIN
 */

 router.post('/login',(req,res)=> {
   const userData  = req.body.user;
   firebase.auth().signInWithEmailAndPassword(userData.email, userData.password).then((userID) => {
     User.getByUid(userID.user.uid).then((currentLogged) =>   {
       if (currentLogged) {
         const userR = {
           type: currentLogged.type,
           fullname: currentLogged.fullname,
           userId: currentLogged._id,
           uid: currentLogged.uid,
           email: currentLogged.email,
           status: currentLogged.status
         };
        req.session.user = userR;
        res.redirect('/user');
       }
       // else
     }).catch((error) => {
       // Handle Errors here.
       var errorCode = error.code;
       var errorMessage = error.message
     });
   }).catch((error) => {
       switch (error.code) {
      case 'auth/wrong-password':
        req.flash('danger', 'Senha incorreta.');
        break;
      case 'auth/user-not-found':
        req.flash('danger', 'Email não cadastrado.');
        break;
      case 'auth/network-request-failed':
        req.flash('danger', 'Falha na internet. Verifique sua conexão de rede.');
        break;
      default:
        req.flash('danger', 'Erro indefinido.');
    }
    console.log(`Error Code: ${error.code}`);
    console.log(`Error Message: ${error.message}`);
    res.redirect('/login');

   });
 });


router.post('/signup', (req, res) => {
  const { user } = req.body;
  console.log(user);
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then((userF) => {
    user.uid = userF.user.uid;
    console.log(userF);
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
router.get('/logout', auth.isAuthenticated, (req, res, next) => {
  firebase.auth().signOut().then(() => {
      delete req.session.fullName;
      delete req.session.userId;
      delete req.session.email;
      res.redirect('/login');
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
  });



module.exports = router;
