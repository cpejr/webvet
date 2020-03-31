var express = require('express');
var firebase = require('firebase');
var router = express.Router();

module.exports = {

// Essa função confere se o usuário está logado antes de entrar nas páginas
// A const user pega as informações do usuário que está logado no firebase e compara com o usuário que quer acessar as páginas
// Caso não haja nenhum usuário logado, a página é redirecionada para o login. Caso haja um usuário logado, a página que o usuário quer acessar é carregada
  isAuthenticated: (req, res, next) => {
    const test = firebase.auth();

    const user = test.currentUser;

    if(user !== null){
      next();
    }
    else {
      res.redirect('/login');
    }
  },

// Essa função confere se o tipo do usuário é "produtor" e permite que ele entre nas páginas disponíveis apenas para produtores
// A const type identifica qual o tipo do usuário que está logado e compara essa string com "Produtor", se o usuário for produtor ele poderá acessar a página desejada, caso contrário, ele é redirecionado para a página de clientes
  isProducer: (req, res, next) => {
    const { type } = req.session.user;
    if(type === 'Produtor'){
      next();
    }
    else {
      res.redirect('/user');
    }
  },

// Essa função confere se o tipo do usuário é "gerente" e permite que ele entre nas páginas disponíveis apenas para gerentes
// A const type identifica qual o tipo do usuário que está logado e compara essa string com "Gerencia", se o usuário for gerente ele poderá acessar a página desejada, caso contrário, ele é redirecionado para a página de clientes

  isManager: (req, res, next) => {
    const { type } = req.session.user;
    if(type === 'Gerencia'){
      next();
    }
    else {
      res.redirect('/user');
    }
  },

// Essa função confere se o tipo do usuário é "convenio" e permite que ele entre nas páginas disponíveis apenas para convenios
// A const type identifica qual o tipo do usuário que está logado e compara essa string com "Convenio", se o usuário for convenio ele poderá acessar a página desejada, caso contrário, ele é redirecionado para a página de clientes

  isConvenio: (req, res, next) => {
    const { type } = req.session.user;
    if(type === 'Convenio'){
      next();
    }
    else {
      res.redirect('/user');
    }
  },

// Essa função confere se o tipo do usuário é "Analista" e permite que ele entre nas páginas disponíveis apenas para analistas
// A const type identifica qual o tipo do usuário que está logado e compara essa string com "Analista", se o usuário for analista ele poderá acessar a página desejada, caso contrário, ele é redirecionado para a página de clientes

  isAnalyst: (req, res, next) => {

    const { type } = req.session.user;
  
    if(type === 'Analista'){
      next();
    }
    else {
      res.redirect('/user');
    }
  },

// Essa função confere se o tipo do usuário é "administrador" e permite que ele entre nas páginas disponíveis apenas para administradores
// A const type identifica qual o tipo do usuário que está logado e compara essa string com "Admin", se o usuário for administrador ele poderá acessar a página desejada, caso contrário, ele é redirecionado para a página de clientes

  isAdmin: (req, res, next) => {
    const { type } = req.session.user;
    if(type === 'Admin'){
      next();
    }
    else {
      res.redirect('/user');
    }
  },
}
