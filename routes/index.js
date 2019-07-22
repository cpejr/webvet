var express = require('express');
var firebase = require('firebase');
var router = express.Router();
const auth = require('./middleware/auth');
const User = require('../models/user');
const Requisition = require('../models/requisition');
const Kit = require('../models/kit');
const Mycotoxin = require('../models/mycotoxin');
const Email = require('../models/email');


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

// router.get('/requisition', (req, res) => {
//   res.render('requisition', {title:'requisition',layout:'layoutDashboard.hbs'});
// });

router.get('/forgotPassword', (req, res) => {
  res.render('forgotPassword', {title:'Esqueci Minha Senha',layout:'layout'});
});

router.get('/requisition/show', (req, res) => {
  res.render('record/show', {title:'show',layout:'layoutRecShow'});
});

router.get('/requisition/index', (req, res) => {
  res.render('record/index', {title:'index',layout:'layoutDashboard'});
});

/**
 * POST LOGIN
 */

 router.post('/login',(req,res)=> {
   const userData  = req.body.user;
   firebase.auth().signInWithEmailAndPassword(userData.email, userData.password).then((userID) => {
     User.getByUid(userID.user.uid).then((currentLogged) =>   {
       if (currentLogged) {
        // console.log(currentLogged);
         const userR = {
           type: currentLogged.type,
           fullname: currentLogged.fullname,
           userId: currentLogged._id,
           uid: currentLogged.uid,
           email: currentLogged.email,
           status: currentLogged.status,
           address:  currentLogged.address
         };
        req.session.user = currentLogged;

        if (userR.status == "Aguardando aprovação") {
          req.flash('danger', 'Aguardando a aprovação do Administrador');
          res.redirect('/login')
          console.log("AINDA NAO APROVADOOO");
        }
        if (userR.status == "Ativo") {
          console.log("ATIVISTA");
          if (userR.type == "Admin") {
            console.log("ADMINNNNNNNN");
            res.redirect('/homeAdmin');
          }
          else {
            if (userR.type == "Analista") {
              console.log("ANALAISTAAAA");
              res.redirect('/homeAdmin');
            }
            else {
              console.log("CLIENT");
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
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then((userF) => {
    user.uid = userF.user.uid;
    console.log(userF);
    User.create(user).then((id) => {
      console.log(`Created new user with id: ${id}`);
      req.flash('success', 'Cadastrado com sucesso. Aguarde aprovação');
      res.redirect('/login');
      User.getAdmin().then((admin) => {
        Email.notificationEmail(admin).catch((error) => {
          res.redirect('/login');
        });
      }).catch((error) => {
        console.log(error);
        res.redirect('/error');
        return error;
      });
    }).catch((error) => {
      console.log(error);
      res.redirect('/error');
    });
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

//post / NovoRegistro
// router.post('/requisition', (req,res) => {
//
//   const newRequisition = req.body;
//
//       console.log(newRequisition);
//       Requisition.create(newRequisition).then((userID)=>{
//         console.log(`New requisition with user id: ${userID}`);
//         req.flash('success', 'Nova requisição enviada')
//         res.redirect('/homeAdmin');
//       }).catch((error) => {
//         console.log(error);
//         res.redirect('/error');
//       });
// });

//POST password reset
router.post('/forgotPassword', (req, res) => {
  const emailAddress = req.body.user;
  console.log(emailAddress);
  firebase.auth().sendPasswordResetEmail(emailAddress.email).then(function() {
    res.redirect('/login');
    req.flash('success', 'Email enviado');
  }).catch((error) => {
    console.log(error);
    res.redirect('/error');
  });
});

// GET /logout
router.get('/logout', auth.isAuthenticated, (req, res, next) => {
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
