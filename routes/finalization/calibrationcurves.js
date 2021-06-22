const express = require("express");
const SimpleLinearRegression = require("ml-regression-simple-linear");
const router = express.Router();

const auth = require("../../middlewares/auth");
const Kit = require("../../models/kit");
const Sample = require("../../models/sample");
const Workmap = require("../../models/Workmap");

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

router.get("/", auth.isAuthenticated, async function (req, res) {
  function calcular(kit) {
    let p_concentration = [];
    let p_absorvance = [];
    let resultado = {};

    //Parte responsável por pegar a concentracao e absorvancia settadas no kit ativo
    p_concentration = kit.calibrators.map((p) => p.concentration);
    p_absorvance = kit.calibrators.map((p) => p.absorbance);

    let log_concentration = [
      Math.log10(p_concentration[1]),
      Math.log10(p_concentration[2]),
      Math.log10(p_concentration[3]),
      Math.log10(p_concentration[4]),
    ]; //eixo x

    let b_b0 = [];
    let ln_b_b0 = [];

    for (let i = 0; i < 4; i++) b_b0[i] = p_absorvance[i + 1] / p_absorvance[0];

    for (let i = 0; i < b_b0.length; i++)
      ln_b_b0[i] = Math.log10(b_b0[i] / (1 - b_b0[i]));

    const result = new SimpleLinearRegression(log_concentration, ln_b_b0);
    const { slope, intercept } = result;
    const score = result.score(log_concentration, ln_b_b0);

    resultado.parte1 = {
      intercept: intercept,
      resultado: score.r * -1,
      slope: slope,
    };

    resultado.parte2 = {
      absorbance: p_absorvance,
      concentration: p_concentration,
    };
    return resultado;
  }

  let kits = await Kit.getAllActive();

  kits.sort(dynamicSort("toxin.name"));

  let toxinas = [];

  kits.forEach((kit, index) => {
    let resultado = calcular(kit);

    if (resultado !== undefined) {
      toxinas[index] = {
        name: kit.toxin.name,
        calibradores: {},
        valores: resultado.parte1,
      };

      kit.calibrators.forEach((calibrator, calibradorIndex) => {
        toxinas[index].calibradores[calibradorIndex] = {
          concentracao: calibrator.concentration,
          absorvancia: calibrator.absorbance,
          calname: `P${calibrator.p}`,
        };
      });
    }
  });

  res.render("finalization/calibrationcurves", {
    title: "Curvas de Calibração",
    toxinas,
    ...req.session,
    layout: "layoutFinalization.hbs",
  });
});

module.exports = router;
