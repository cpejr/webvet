const express = require("express");
const router = express.Router();
const Kit = require("../../models/kit");

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

router.get("/", async function (req, res) {
  Kit.getAllLastActiveWithSamples().then((toxinas) => {
    //Finalizando a forma de como os dados serão enviados ao front
    var displayInfo = [];

    for (let i = 0; i < toxinas.length; i++) {
      let { calibrators, samples, productCode } = toxinas[i];

      let toxinaSigla = productCode.replace(" Romer", "");

      //CORREÇÃO PROVISÓRIA DA SIGLA FBS
      if (toxinaSigla === "FUMO") toxinaSigla = "FBS";

      let toxinafull = ToxinasFull[ToxinasSigla.indexOf(toxinaSigla)];

      displayInfo[i] = { name: toxinaSigla, results: [] };

      for (let j = 0; j < samples.length; j++) {
        const sample = samples[j];

        displayInfo[i].results[j] = {
          compara: parseFloat(sample[toxinafull].result),
          average:
            (sample[toxinafull].absorbance + sample[toxinafull].absorbance2) /
            2,
          number: sample.sampleNumber,
          changed_workmap:
            j != 0 &&
            samples[j - 1][toxinafull].workmapId !=
              sample[toxinafull].workmapId, //CONFERIR ORDEM DOS SAMPLES NESSE OBJETO
          _id: sample._id,
        };
      }
      displayInfo.sort(dynamicSort("name"));
    }

    res.render("finalization/result", {
      title: "Curvas de Calibração",
      displayInfo,
      ...req.session,
    });
  });
});

module.exports = router;
