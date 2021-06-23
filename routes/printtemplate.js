var express = require("express");
const Kit = require("../models/kit");
var router = express.Router();
const auth = require("../middlewares/auth");

router.get("/", auth.isAuthenticated, async (req, res) => {
  const lastFinalizedKits = await Kit.getAllActiveWithSamples();

  let displayInfo = [];
  lastFinalizedKits.forEach((kit, i) => {
    displayInfo[i] = { name: kit.toxin.sigle, results: [] };

    let changedWorkmap = false;
    kit.workmaps.forEach((workmap) => {
      if (!workmap.wasUsed) {
        workmap.samples.forEach((sample) => {
          displayInfo[i].results.push({
            number: sample.sampleNumber,
            changed_workmap: changedWorkmap,
            _id: sample._id,
          });

          changedWorkmap = false;
        });
        changedWorkmap = true;
      }
    });
  });

  res.render("printtemplate", {
    displayInfo,
    ...req.session,
    layout: "layoutFinalization.hbs",
  });
});

module.exports = router;
