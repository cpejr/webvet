const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Requisition = require("../models/requisition");

router.get("/", auth.isAuthenticated, (req, res) => {
  let _id = req.session.user._id;

  Requisition.getAndPopulate({ "charge.user": _id })
    .then((requisitions) => {
      res.render("record/index", {
        title: "Histórico",
        layout: "layoutDashboard.hbs",
        requisitions,
        ...req.session,
      });
    })
    .catch((error) => {
      console.warn(error);
      res.redirect("/error");
    });
});

module.exports = router;
