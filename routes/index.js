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

router.post('/form',(req,res)=> {
  const { user } = req.body;

  // pra quem estiver vendo esse código comentado:
  // essa linha de cima substitui tudo isso. É mais prático e as variáveis não podem ter nome com ponto
  // (tipo register.type) porque dá pau de sintaxe. Depois de verem podem apagar o comentado, só deixei registrado
  // pra mostrar pra vocês.

  // const { username } = req.body.user;
  // const { persontype } = req.body.user;
  // const { fullname } = req.body.user;
  // const { register.type } = req.body.user;
  // const { type.type } = req.body.user;
  // const { adress.cep } = req.body.user;
  // const { address.street } = req.body.user;
  // const { adress.number } = req.body.user;
  // const { adress.complement } = req.body.user;
  // const { adress.city } = req.body.user;
  // const { adress.state } = req.body.user;
  // const { email.type } = req.body.user;
  // const { phone } = req.body.user;
  // const { cellphone } = req.body.user;
  // const { status.type } = req.body.user;
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
