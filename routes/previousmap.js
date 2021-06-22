const express = require("express");
const Counter = require("../models/counter");
const Kit = require("../models/kit");
const router = express.Router();
const auth = require("../middlewares/auth");

/* GET home page. */
router.get("/", auth.isAuthenticated, async function (req, res) {
  const finalizationNumber = (await Counter.getFinalizationCount()) - 1;
  const lastFinalizedKits = await Kit.getAllByFinalizationNumber(
    finalizationNumber
  );

  let displayInfo = [];
  lastFinalizedKits.forEach((kit, i) => {
    displayInfo[i] = { name: kit.toxin.sigle, results: [] };

    let changedWorkmap = false;
    kit.workmaps.forEach((workmap) => {
      if (workmap.finalizationNumber === finalizationNumber) {
        workmap.samples.forEach((sample) => {
          const analysis = sample.analysis;

          displayInfo[i].results.push({
            compara: parseFloat(analysis.resultNumber),
            average: (analysis.absorbance1 + analysis.absorbance2) / 2,
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

  res.render("previousmap", {
    displayInfo,
    ...req.session,
    layout: "layoutFinalization.hbs",
  });
});
module.exports = router;
