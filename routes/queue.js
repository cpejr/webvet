const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Kit = require("../models/kit");

/* GET home page. */
router.get("/", auth.isAuthenticated, async function (req, res) {
  let toxins = ToxinasAll;

  const activeKits = await Kit.getAllActive();
  ToxinasAll.forEach((toxin, index) => {
    const activeKit = activeKits.find((kit) => kit.toxinId == toxin._id);
    if (activeKit) toxins[index].active = activeKit.kitType;
  });

  res.render("admin/queue", {
    toxins,
    title: "Queue",
    layout: "layoutDashboard.hbs",
    ToxinasAll,
    ...req.session,
  });
});

module.exports = router;
