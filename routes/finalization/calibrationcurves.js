const express = require("express");
const SimpleLinearRegression = require("ml-regression-simple-linear");
const router = express.Router();

const auth = require("../../middlewares/auth");
const Kit = require("../../models/kit");
const Sample = require("../../models/sample");
const Workmap = require("../../models/Workmap");

router.get("/", auth.isAuthenticated, async function (req, res) {
  async function calcular(toxinafull, toxinId) {
    let kit = await Kit.getActive(toxinId); //Vai ter que mudar, passa o Id da toxina.
    if (!kit) return undefined;

    let mapas = [];
    let p_concentration = [];
    let p_absorvance = [];
    let resultado = {};

    const P = ["P1", "P2", "P3", "P4", "P5"];
    //Parte responsável por pegar a concentracao e absorvancia settadas no kit ativo
    p_concentration = P.map((p) => kit.calibrators[p].concentration);
    p_absorvance = P.map((p) => kit.calibrators[p].absorbance);

    //parte responsável por pegar as amostras do kit, logo  através do kit ativo de afla pega na variável mapArray o id dos mapas que estão sendo utilizados naqueles kits
    mapas = await Workmap.getByIdArray(kit.mapArray);
    var samples_id = [];

    //Após ter os ids dos mapas de trabalho que estão sendo utilizados roda um for para percorrer todos os mapas e um for dentro desse para acessar todas as amostras em cada mapa
    const promises = mapas.map(
      async (map) => (samples_id = samples_id.concat(map.samplesArray))
    );

    await Promise.all(promises);

    amostras = await Sample.getActiveByIdArray(samples_id, toxinafull);

    var log_concentracao = [
      Math.log10(p_concentration[1]),
      Math.log10(p_concentration[2]),
      Math.log10(p_concentration[3]),
      Math.log10(p_concentration[4]),
    ]; //eixo x

    var b_b0 = [];
    var ln_b_b0 = [];

    for (var i = 0; i < 4; i++) b_b0[i] = p_absorvance[i + 1] / p_absorvance[0];

    for (var i = 0; i < b_b0.length; i++)
      ln_b_b0[i] = Math.log10(b_b0[i] / (1 - b_b0[i]));

    const result = new SimpleLinearRegression(log_concentracao, ln_b_b0);
    const { slope, intercept } = result;
    const score = result.score(log_concentracao, ln_b_b0);

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

  var toxinas = [];
  let count = 0;

  ToxinasSigla.forEach(async (sigla, index) => {
    let resultado = await calcular(ToxinasFull[index], sigla);
    console.log(resultado, sigla, ToxinasFull[index]);

    if (resultado !== undefined) {
      toxinas[index] = {
        name: sigla,
        calibradores: {},
        valores: resultado.parte1,
      };

      for (let jcali = 0; jcali < 5; jcali++) {
        //5 calibradores
        toxinas[index].calibradores[jcali] = {
          concentracao: resultado.parte2.concentration[jcali],
          absorvancia: resultado.parte2.absorbance[jcali],
          calname: "P" + (jcali + 1),
        };
      }
    }
    //Check if is the last
    count++;
    if (count == ToxinasSigla.length)
      res.render("finalization/calibrationcurves", {
        title: "Curvas de Calibração",
        toxinas,
        ...req.session,
        layout: "layoutFinalization.hbs",
      });
  });
});

module.exports = router;
