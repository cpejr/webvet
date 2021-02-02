const express = require("express");
const router = express.Router();
const Kit = require("../models/kit");
const Workmap = require("../models/Workmap");
const Sample = require("../models/sample");
const Counter = require("../models/counter");
const auth = require("../middlewares/auth");

router.get("/", auth.isAuthenticated, auth.isFromLab, (req, res) => {
  Sample.getAllActiveWithWorkmap()
    .then((amostras) => {
      var today = new Date();

      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();

      result = [];

      for (let i = 0; i < ToxinasSigla.length; i++) {
        const sigla = ToxinasSigla[i];

        result[i] = {
          name: sigla,
          samples: [],
        };
      }

      function addSample(index, element, toxinaFull) {
        if (
          element[toxinaFull].active &&
          element[toxinaFull].status === "Mapa de Trabalho"
        ) {
          //                     se não é o primeiro elemento        compara o workmapid com a ultima amostra da lista
          var changedworkmap =
            result[index].samples.length > 0 &&
            result[index].samples[result[index].samples.length - 1]
              .workmapId !== element[toxinaFull].workmapId;
          //changedworkmap serve para soltar os espaços entre os campos

          result[index].samples.push({
            changedworkmap: changedworkmap,
            _id: element._id,
            samplenumber: element.samplenumber,
          });
        }
      }

      for (let i = 0; i < amostras.length; i++)
        for (let j = 0; j < ToxinasFull.length; j++)
          addSample(j, amostras[i], ToxinasFull[j]);

      /*
    Result é um vetor de 6 dimensões 
    e cada posição faz referência a uma toxina diferente   
    */
      res.render("allsamples", {
        result,
        dd,
        mm,
        yyyy,
        today,
        ...req.session,
        layout: "layoutFinalization.hbs",
      });
    })
    .catch((error) => {
      console.warn(error);
    });
});

// router.get('/renameSample', async function(req, res){
//   await Sample.rename();
//   console.log("Ta feita a merda");
//   res.redirect("/")
// });

router.post("/", auth.isAuthenticated, auth.isFromLab, async (req, res) => {
  try {
    //Dando update em todos os kits ativos.
    const activeKits = await Kit.getAllActive();

    let toxinas = req.body.toxinas;
    let promises = [];

    promises.push(updateKits(activeKits));

    if (toxinas) {
      for (let i = 0; i < ToxinasAll.length; i++) {
        const toxinaFull = ToxinasAll[i].Full;
        const toxinaSigla = ToxinasAll[i].Sigla;

        let samples = toxinas[toxinaSigla];

        let productCode = toxinaSigla;
        //CORREÇÃO PROVISÓRIA DA SIGLA FBS
        if (productCode === "FBS") productCode = "FUMO";
        productCode += " Romer";

        //Encontrar kit correspondente da toxina
        let kit = activeKits.find((x) => x.productCode === productCode);

        if (kit) {
          let objUpdate = {
            calibrators: kit.calibrators,
            kitId: kit._id,
            samples: samples,
            toxinaFull: toxinaFull,
          };

          promises.push(updateSamplesByGroup(objUpdate));
        }
      }

      await Promise.all(promises);
    }

    console.log("Redirect");
    res.redirect("/sampleresult");

    async function updateKits(KitArray) {
      console.log("I updateKits");
      let promises = [];
      let finalizationNumber = await Counter.getFinalizationCount();

      KitArray.forEach(async (kit) => {
        var new_toxinaStart = kit.toxinaStart;

        const workmaps = await Workmap.getByIdArray(kit.mapArray);
        //Order by mapID
        workmaps.sort(function (a, b) {
          return Number(a.mapID) - Number(b.mapID);
        });

        for (let i = workmaps.length - 1; i >= kit.toxinaStart; i--) {
          //Ele confere de trás para frente
          if (workmaps[i].samplesArray.length > 0) {
            new_toxinaStart = Number(workmaps[i].mapID) + 1;
            break;
          }
        }

        let WorkmapsToFinalize = kit.mapArray.slice(
          kit.toxinaStart,
          new_toxinaStart
        );

        promises.push(
          Workmap.setFinalizationNumber(WorkmapsToFinalize, finalizationNumber)
        );

        kit.amount = kit.stripLength - new_toxinaStart;
        kit.toxinaStart = new_toxinaStart;
        promises.push(Kit.update(kit._id, kit));
      });

      //Update Finalization Count
      promises.push(Counter.setFinalizationCount(finalizationNumber + 1));

      console.log("F updateKits");
      return await Promise.all(promises);
    }

    async function updateSamplesByGroup(obj) {
      console.log("I updateKits");
      let { samples, calibrators, toxinaFull, kitId } = obj;
      let promises = [];

      if (samples) {
        for (let i = 0; i < samples.length; i++) {
          let sample = samples[i];
          promises.push(
            Sample.updateAbsorbancesAndFinalize(
              sample._id,
              toxinaFull,
              sample.absorbance,
              sample.absorbance2,
              calibrators,
              kitId
            )
          );
        }
      }
      console.log("f updateKits");
      return await Promise.all(promises);
    }
  } catch (error) {
    res.redirect("/sampleresult");
    console.warn(error);
  }
});

module.exports = router;
