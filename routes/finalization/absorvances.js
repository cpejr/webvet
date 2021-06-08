const express = require("express");
const router = express.Router();
const Kit = require("../../models/kit");
const Sample = require("../../models/sample");
const Counter = require("../../models/counter");
const auth = require("../../middlewares/auth");

router.get("/", auth.isAuthenticated, auth.isFromLab, async (req, res) => {
  const kits = await Kit.getAllActiveWithSamples();
  result = [];

  kits.forEach((kit, index) => {
    let samples = [];

    kit.workmaps.forEach((workmap) => {
      if (!workmap.wasUsed) {
        samples = [...samples, ...workmap.samples];

        // changedworkmap serve para soltar os espaços entre os campos
        samples[samples.length - 1].changedworkmap = true;
      }
    });

    result[index] = {
      _id: kit.toxin._id,
      name: kit.toxin.sigle,
      samples,
    };
  });

  console.log(
    "🚀 ~ file: absorvances.js ~ line 36 ~ router.get ~ result",
    result
  );

  res.render("finalization/absorbances", {
    result,
    ...req.session,
    layout: "layoutFinalization.hbs",
  });
});

router.post("/", auth.isAuthenticated, auth.isFromLab, async (req, res) => {
  const { kits } = req.body;
  let finalizationNumber = await Counter.getFinalizationCount();

  const promises = [];
  const kitsIds = Object.keys(kits);
  const kitsObj = await Kit.findByFields({ _id: { $in: kitsIds } });

  kitsIds.forEach((kitId) => {
    const workmapsIds = Object.keys(kits[kitId]);
    const kit = kitsObj.find((kit) => `${kit._id}` == `${kitId}`);

    workmapsIds.forEach((workmapId) => {
      const samplesIds = Object.keys(kits[kitId][workmapId]);
      promises.push(
        Kit.finalizeWorkmap(
          kitId,
          workmapId,
          finalizationNumber,
          kit.amount - 1
        )
      );

      samplesIds.forEach((sampleId) => {
        const analysisId = Object.keys(sampleData)[0];
        const sampleData = kits[kitId][workmapId][sampleId][analysisId];

        promises.push(
          Sample.finalize(
            sampleId,
            analysisId,
            sampleData.absorbance1,
            sampleData.absorbance1,
            kit.calibrators,
            finalizationNumber
          )
        );
      });
    });
  });

  promises.push(Counter.setFinalizationCount(finalizationNumber + 1));

  await Promise.all(promises);

  res.redirect("finalization/result");
});

module.exports = router;
