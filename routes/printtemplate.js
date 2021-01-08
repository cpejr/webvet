var express = require("express");
const Kit = require("../models/kit");
const Workmap = require("../models/Workmap");
var router = express.Router();

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

router.get("/", async (req, res) => {
  let result = await Kit.getCurrentWorkmapsSamples();

  for (let i = 0; i < result.length; i++) {
    const element = result[i];

    let sigla = element._id.replace(" Romer", "");
    //CORREÇÃO PROVISÓRIA DA SIGLA FBS
    if (sigla === "FUMO") sigla = "FBS";

    let toxina = ToxinasFull[ToxinasSigla.indexOf(sigla)];

    //Verificar se mudou de workmap
    for (let j = 0; j < element.samples.length; j++)
      if (
        j > 0 &&
        element.samples[j - 1][toxina].workmapId + "" !==
          element.samples[j][toxina].workmapId + ""
      )
        result[i].samples[j].changedWorkmap = true;

    result[i]._id = sigla;
  }

  //Order by Sigla
  result.sort(dynamicSort("_id"));

  res.render("printtemplate", { result, ...req.session });
});

module.exports = router;
