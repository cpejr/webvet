var express = require("express");
var router = express.Router();
const auth = require("../../middlewares/auth");
const Kit = require("../../models/kit");

router.get("/", async (req, res) => {
  const kits = await Kit.getAllActive();

  res.render("finalization/calibrators", {
    kits,
    ...req.session,
    layout: "layoutFinalization.hbs",
  });
});

router.post("/", auth.isAuthenticated, async function (req, res) {
  const { body } = req;
  const kitIds = Object.keys(req.body);

  const promises = [];

  kitIds.forEach((kitId) => {
    const fieldsToUpdate = {};
    body[kitId]?.calibrators?.forEach((calibrator, index) => {
      fieldsToUpdate[`calibrators.${index}.absorbance`] = calibrator.absorbance;
    });
    
    promises.push(Kit.updateOne({ _id: kitId }, { $set: fieldsToUpdate }));
  });

  await Promise.all(promises);

  res.redirect("/finalization/calibrationcurves");
});

module.exports = router;
