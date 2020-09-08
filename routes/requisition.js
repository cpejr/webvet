const express = require("express");
const router = express.Router();

const auth = require('./middleware/auth');
const Requisition = require('../models/requisition');
const Sample = require('../models/sample');
const User = require('../models/user');

router.get("/new", auth.isAuthenticated, async function (req, res) {
  let users = await User.getByQuery({ status: "Ativo", deleted: "false" });
  // console.log(req.session);
  res.render("requisition/newrequisition", {
    title: "Requisition",
    layout: "layoutDashboard.hbs",
    users,
    ...req.session,
  });
});

router.post('/delete/:id', auth.isAuthenticated, auth.isAdmin, (req, res) => {
  Requisition.delete(req.params.id).then(() => {
    res.redirect("/requisition");
  });
});

router.post("/new", auth.isAuthenticated, function (req, res) {
  const { requisition } = req.body;
  if (
    req.session.user.type !== "Analista" &&
    req.session.user.type !== "Admin"
  ) {
    requisition.user = req.session.user._id;
  }

  //CORREÇÃO PROVISÓRIA DO CAMPO DESTINATION
  if (Array.isArray(requisition.destination))
    requisition.destination = requisition.destination.toString();

  if (req.body.producerAddress == 0) {
    const address = req.session.user.address;
    requisition.address = address;
  }
  const samplesVector  = [...requisition.sampleVector];
  
  delete requisition.sampleVector;

  Requisition.create(requisition)
    .then((reqid) => {
      let sampleObjects = [];
      for (let i = 0; i < samplesVector.length; i++) {
        const { name, citrus } = samplesVector[i];

        const sample = {
          name,
          samplenumber: -1,
          responsible: req.body.requisition.responsible,
          requisitionId: NaN,
          isCitrus: citrus ? true : false,
          aflatoxina: {
            active: false,
          },
          ocratoxina: {
            active: false,
          },
          deoxinivalenol: {
            active: false,
          },
          fumonisina: {
            active: false,
          },
          t2toxina: {
            active: false,
          },
          zearalenona: {
            active: false,
          },
        };

        for (let i = 0; i < ToxinasFormal.length; i++) {
          const formal = ToxinasFormal[i];
          const full = ToxinasFull[i];

          if (req.body.requisition.mycotoxin.includes(formal))
            sample[full].active = true;
        }

        sample.requisitionId = reqid;
        sampleObjects.push(sample);
      }

      Sample.createMany(sampleObjects)
        .then((sids) => {
          for (let index = 0; index < sids.length; index++) {
            const sid = sids[index]._id;

            //Isso aq dá para otimizar (acho)
            Requisition.addSample(reqid, sid).catch((error) => {
              console.log(error);
              res.redirect("/error");
            });
          }
        })
        .catch((error) => {
          console.log(error);
          res.redirect("/error");
        });

      req.flash("success", "Nova requisição enviada");
      if (
        req.session.user.type === "Analista" ||
        req.session.user.type === "Admin"
      ) {
        res.redirect("/requisition");
      } else {
        res.redirect("/user");
      }
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/error"); //catch do create
    });
});

router.get("/", auth.isAuthenticated, function (req, res) {
  Requisition.getAll().then((requisitions) => {
    requisitions = requisitions.reverse();
    res.render("requisition/index", {
      title: "Requisições Disponíveis",
      layout: "layoutDashboard.hbs",
      ...req.session,
      requisitions,
    });
  });
});

router.get("/edit/:id", auth.isAuthenticated, auth.isAdmin, function (
  req,
  res
) {
  Requisition.getById(req.params.id)
    .then((requisition) => {
      Sample.getByIdArray(requisition.samples).then((samples) => {
        var nova = false;

        if (requisition.status === "Nova") {
          nova = true;
        }
        res.render("requisition/edit", {
          title: "Edit Requisition",
          layout: "layoutDashboard.hbs",
          requisition,
          nova,
          ...req.session,
          samples,
        });
      });
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/error");
    });
});

router.get("/useredit/:id", auth.isAuthenticated , function (
  req,
  res
) {
  Requisition.getById(req.params.id)
    .then((requisition) => {
      res.render("requisition/useredit", {
        title: "Edit Requisition",
        layout: "layoutDashboard.hbs",
        requisition,
        ...req.session,
      });
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/error");
    });
});

router.post("/edit/:id", auth.isAuthenticated, auth.isAdmin, function (
  req,
  res
) {
  var { requisition, sample } = req.body;
  // console.log(sample);
  const isApproved = req.body.novaCheck === "isChecked";

  if (isApproved) {
    requisition.status = "Aprovada";
  }

  for (let i = 0; i < sample.length; i++) {
    let samples = {
      name: sample[i].name,
      sampletype: sample[i].sampletype,
      approved: isApproved,
      isCitrus: sample[i].isCitrus ? true : false
    };

    ToxinasAll.forEach((toxina) => {
      const contaisToxin = requisition.mycotoxin.includes(toxina.Formal);
      samples[`${toxina.Full}.active`] = contaisToxin;
    });



    Sample.update(sample[i]._id, samples)
      .then(() => {})
      .catch((error) => {
        console.log(error);
        res.redirect("/error");
      });
  }
  Requisition.update(req.params.id, requisition)
    .then(() => {
      req.flash("success", "Requisição alterada com sucesso.");
      res.redirect(`/requisition/edit/${req.params.id}`);
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/error");
    });
});

router.post("/useredit/:id", auth.isAuthenticated, function (
  req,
  res
) {
  var requisition = req.body.requisition;
  Requisition.update(req.params.id, requisition)
    .then(() => {
      req.flash("success", "Requisição alterada com sucesso.");
      res.redirect(`/requisition/useredit/${req.params.id}`);
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/error");
    });
});

module.exports = router;
