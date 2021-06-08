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
  const kits = await Kit.findByFields({ _id: { $in: kitsIds } });

  kitsIds.forEach((kitId) => {
    const workmapsIds = Object.keys(kits[kitId]);
    const kit = kits.find((kit) => `${kit._id}` == `${kitId}`);

    workmapsIds.forEach((workmapId) => {
      const samplesIds = Object.keys(kits[kitId][workmapId]);
      promises.push(Kit.finalizeWorkmap(kitId, workmapId, finalizationNumber, kit.amount - 1));

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

  Counter.setFinalizationCount(finalizationNumber + 1);

  //       let kit = activeKits.find((x) => x.productCode === productCode);

  //       if (kit) {
  //         let objUpdate = {
  //           calibrators: kit.calibrators,
  //           kitId: kit._id,
  //           samples: samples,
  //           toxinaFull: toxinaFull,
  //         };

  //         promises.push(updateSamplesByGroup(objUpdate));
  //       }
  //     }

  //     await Promise.all(promises);
  //   }

  //   res.redirect("/finalization/result");

  //   async function updateKits(KitArray) {
  //     let promises = [];
  //     let finalizationNumber = await Counter.getFinalizationCount();

  //     KitArray.forEach(async (kit) => {
  //       var new_toxinIndex = kit.toxinIndex;

  //       const workmaps = await Workmap.getByIdArray(kit.mapArray);
  //       //Order by mapID
  //       workmaps.sort(function (a, b) {
  //         return Number(a.mapID) - Number(b.mapID);
  //       });

  //       for (let i = workmaps.length - 1; i >= kit.toxinIndex; i--) {
  //         //Ele confere de trás para frente
  //         if (workmaps[i].samplesArray.length > 0) {
  //           new_toxinIndex = Number(workmaps[i].mapID) + 1;
  //           break;
  //         }
  //       }

  //       let WorkmapsToFinalize = kit.mapArray.slice(
  //         kit.toxinIndex,
  //         new_toxinIndex
  //       );

  //       promises.push(
  //         Workmap.setFinalizationNumber(WorkmapsToFinalize, finalizationNumber)
  //       );

  //       kit.amount = kit.stripLength - new_toxinIndex;
  //       kit.toxinIndex = new_toxinIndex;
  //       promises.push(Kit.update(kit._id, kit));
  //     });

  //     //Update Finalization Count
  //     promises.push(Counter.setFinalizationCount(finalizationNumber + 1));

  //     return await Promise.all(promises);
  //   }

  //   async function updateSamplesByGroup(obj) {
  //     let { samples, calibrators, toxinaFull, kitId } = obj;
  //     let promises = [];

  //     if (samples) {
  //       for (let i = 0; i < samples.length; i++) {
  //         let sample = samples[i];
  //         promises.push(
  //           Sample.updateAbsorbancesAndFinalize(
  //             sample._id,
  //             toxinaFull,
  //             sample.absorbance,
  //             sample.absorbance2,
  //             calibrators,
  //             kitId
  //           )
  //         );
  //       }
  //     }

  //     return await Promise.all(promises);
  //   }
  // } catch (error) {
  //   res.redirect("/finalization/result");
  //   console.warn(error);
  // }
});

module.exports = router;
