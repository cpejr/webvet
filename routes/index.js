var express = require('express');
var firebase = require('firebase');
var admin = require('firebase-admin');
var router = express.Router();
const auth = require('./middleware/auth');
const User = require('../models/user');
const Email = require('../models/email');



/* GET home page. */
router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.render('index/login', { title: 'Login', layout: 'layoutIndex' });
});

router.get('/signup', (req, res) => {
  res.render('index/form', { title: 'signup', layout: 'layoutIndex' });
});

router.get('/forgotPassword', (req, res) => {
  res.render('index/forgotPassword', { title: 'Esqueci Minha Senha', layout: 'layoutIndex' });
});

router.post('/forgotPassword', (req, res) => {
  const emailAddress = req.body.user;
  console.log(emailAddress);
  firebase.auth().sendPasswordResetEmail(emailAddress.email).then(function () {
    res.redirect('/login');
    req.flash('success', 'Email enviado');
  }).catch((error) => {
    res.render('index/forgotPassword', { title: 'Esqueci Minha Senha', layout: 'layoutIndex', error });
  });
});

/**
 * POST LOGIN
 */

router.post('/login', (req, res) => {
  const userData = req.body.user;
  firebase.auth().signInWithEmailAndPassword(userData.email, userData.password).then((userID) => {
    User.getByFirebaseId(userID.user.uid).then((currentLogged) => {
      if (currentLogged) {
        const userR = {
          type: currentLogged.type,
          fullname: currentLogged.fullname,
          userId: currentLogged._id,
          uid: currentLogged.uid,
          email: currentLogged.email,
          status: currentLogged.status,
          address: currentLogged.address
        };
        req.session.user = currentLogged;

        if (userR.status == "Aguardando aprovação") {
          req.flash('danger', 'Aguardando a aprovação do Administrador');
          res.redirect('/login')
          console.log("Usuario nao aprovado");
        }
        if (userR.status == "Ativo") {
          console.log("Usuario esta Ativo");
          if (userR.type == "Admin") {
            console.log("Login como Admin");
            res.redirect('/homeAdmin');
          }
          else {
            if (userR.type == "Analista") {
              console.log("Logado como Analista");
              res.redirect('/homeAdmin');
            }
            else {
              console.log("Logado como cliente");
              res.redirect('/user');
            }
          }
        }
        if (userR.status == "Bloqueado") {
          console.log("Esse esta bloqueado");
          req.flash('danger', 'Essa conta foi bloqueada pelo Administrador');
          res.redirect('/login');
        }
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
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(function(userF) {

    user.uid = userF.user.uid;
    User.create(user).then((id) => {
      console.log(`Created new user with id: ${id}`);
      req.flash('success', 'Cadastrado com sucesso. Aguarde aprovação');


      //Send emails
      Email.userWaitingForApproval(user.email, user.fullname.split(' ')[0]).catch(error);
      User.getAdmin().then((admin) => {
        Email.newUserNotificationEmail(admin.email).catch((error) => {
          res.redirect('/login');
        });
      }).catch((error) => {
        console.log(error);
        res.redirect('/error');
        return error;
      });

      res.redirect('/login');
    }).catch(errror2 => {
      console.log(errror2);
      console.log("Nao foi possivel criar o usuario no mongo, deletando...");
      admin.auth().deleteUser(userF.user.uid).then(() => {}).catch((err) => {console.log(err);});
      res.render('index/form', { title: 'signup', layout: 'layout', error: error2 });
    });
  }).catch(function (error) {
    console.log(error);
    res.render('index/form', { title: 'signup', layout: 'layout', error });
  });
});

// GET /logout
router.get('/logout', auth.isAuthenticated, (req, res) => {
  firebase.auth().signOut().then(() => {
    delete req.session.fullname;
    delete req.session.userId;
    delete req.session.email;
    res.redirect('/login');
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});



module.exports = router;
