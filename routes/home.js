var express = require("express");
var firebase = require("firebase");
var admin = require("firebase-admin");
var router = express.Router();
const auth = require("../middlewares/auth");
const User = require("../models/user");
const Email = require("../models/email");
const GmailOAuth = require("../utils/GmailOAuth");

/* GET home page. */
router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("index/login", { title: "Login", layout: "layoutIndex" });
});

router.get("/signup", (req, res) => {
  res.render("index/form", { title: "signup", layout: "layoutIndex" });
});

router.get("/forgotPassword", (req, res) => {
  res.render("index/forgotPassword", {
    title: "Esqueci Minha Senha",
    layout: "layoutIndex",
  });
});

router.post("/forgotPassword", (req, res) => {
  const emailAddress = req.body.user;

  firebase
    .auth()
    .sendPasswordResetEmail(emailAddress.email)
    .then(function () {
      res.redirect("/login");
      req.flash("success", "Email enviado");
    })
    .catch((error) => {
      res.render("index/forgotPassword", {
        title: "Esqueci Minha Senha",
        layout: "layoutIndex",
        error,
      });
    });
});

router.get("/toxins", async (req, res) => {
  res.send(Toxins);
});

/**
 * POST LOGIN
 */

router.post("/login", (req, res) => {
  const userData = req.body.user;
  firebase
    .auth()
    .signInWithEmailAndPassword(userData.email, userData.password)
    .then((userID) => {
      User.getByFirebaseId(userID.user.uid)
        .then((currentLogged) => {
          if (currentLogged === null) {
            req.flash("danger", "Uusário não cadastrado.");
            res.redirect("/login");
          }
       
          const userR = {
            type: currentLogged.type,
            fullname: currentLogged.fullname,
            userId: currentLogged._id,
            uid: currentLogged.uid,
            email: currentLogged.email,
            status: currentLogged.status,
            address: currentLogged.address,
          };
          req.session.user = currentLogged;

          if (userR.status == "Aguardando aprovação") {
            req.flash("danger", "Aguardando a aprovação do Administrador");
            res.redirect("/login");
          }
          if (userR.status == "Ativo") {
            if (userR.type == "Admin") {
              res.redirect("/homeAdmin");
            } else {
              if (userR.type == "Analista") {
                res.redirect("/homeAdmin");
              } else {
                res.redirect("/user");
              }
            }
          }
          if (userR.status == "Bloqueado") {
            req.flash("danger", "Essa conta foi bloqueada pelo Administrador");
            res.redirect("/login");
          }
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
        });
    })
    .catch((error) => {
      switch (error.code) {
        case "auth/wrong-password":
          req.flash("danger", "Senha incorreta.");
          break;
        case "auth/user-not-found":
          req.flash("danger", "Email não cadastrado.");
          break;
        case "auth/network-request-failed":
          req.flash(
            "danger",
            "Falha na internet. Verifique sua conexão de rede."
          );
          break;
        default:
          req.flash("danger", "Erro indefinido.");
      }
      console.warn(`Error Code: ${error.code}`);
      console.warn(`Error Message: ${error.message}`);
      res.redirect("/login");
    });
});

router.post("/signup", (req, res) => {
  const { user } = req.body;
  firebase
    .auth()
    .createUserWithEmailAndPassword(user.email, user.password)
    .then(function (userF) {
      user.uid = userF.user.uid;
      User.create(user)
        .then((id) => {
          req.flash("success", "Cadastrado com sucesso. Aguarde aprovação");

          //Send emails
          Email.userWaitingForApproval(
            user.email,
            user.fullname.split(" ")[0]
          ).catch((error) => console.warn(error));
          User.getAdmin()
            .then((admin) => {
              Email.newUserNotificationEmail(admin.email).catch((error) => {
                res.redirect("/login");
              });
            })
            .catch((error) => {
              console.warn(error);
              res.redirect("/error");
              return error;
            });

          res.redirect("/login");
        })
        .catch((error2) => {
          console.warn(error2);
          console.warn(
            "Nao foi possivel criar o usuario no mongo, deletando..."
          );
          admin
            .auth()
            .deleteUser(userF.user.uid)
            .then(() => {})
            .catch((err) => {
              console.warn(err);
            });
          res.render("index/form", {
            title: "signup",
            layout: "layoutIndex",
            error: error2,
          });
        });
    })
    .catch(function (error) {
      console.warn(error);
      res.render("index/form", {
        title: "signup",
        layout: "layoutIndex",
        error,
      });
    });
});

// GET /logout
router.get("/logout", auth.isAuthenticated, (req, res) => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      delete req.session.fullname;
      delete req.session.userId;
      delete req.session.email;
      res.redirect("/login");
    })
    .catch((error) => {
      console.warn(error);
      res.redirect("/error");
    });
});

router.get("/validateCredentials", async (request, response) => {
  try {
    const code = decodeURI(request.query.code);
    const scope = decodeURI(request.query.scope);

    await GmailOAuth.validateCredentials(code, scope);

    response.status(200).json({ response: "ok" });
  } catch (err) {
    console.warn(err);
    response.status(400).json({ error: "Invalid data" });
  }
});

module.exports = router;
