const firebase = require('firebase');

module.exports = {
  isAuthenticated: (req, res, next) => {
    const user = firebase.auth().currentUser;
    if(user!== null){
      next();
    }
    else {
      res.redirect('login');
    }
  },
  isProducer: (req, res, next) => {
    const {userType} = req.session;
    if(user === 'Produtor'){
      next();
    }
    else {
      res.redirect('/user');
    }
  },
  isManager: (req, res, next) => {
    const {userType} = req.session;
    if(user === 'Gerencia'){
      next();
    }
    else {
      res.redirect('/user');
    }
  },
  isConvenio: (req, res, next) => {
    const {userType} = req.session;
    if(user === 'Convenio'){
      next();
    }
    else {
      res.redirect('/user');
    }
  },
  isAnalyst: (req, res, next) => {
    const {userType} = req.session;
    if(user === 'Analista'){
      next();
    }
    else {
      res.redirect('/user');
    }
  },
  isAdmin: (req, res, next) => {
    const {userType} = req.session;
    if(user === 'Admin'){
      next();
    }
    else {
      res.redirect('/user');
    }
  },
}
