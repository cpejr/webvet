const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Sample = require("../models/sample");
const Requisition = require("../models/requisition");
const User = require("../models/user");
const Kit = require("../models/kit");
const Counter = require("../models/counter");

/* GET home page. */
router.get("/", auth.isAuthenticated, auth.isFromLab, async function (req, res) {
  const promises = [
    User.count(),
    Sample.count(),
    Kit.getAllInStock(),
    Counter.getEntireKitStocks(),
    Requisition.countNew(),
    Requisition.countAll(),
  ];

  const [
    countClients,
    countSamples,
    kits,
    kitstocks,
    newRequisitions,
    countRequisitions,
  ] = await Promise.all(promises);

  let today = new Date();
  let currentDay = String(today.getDate()).padStart(2, "0");
  let currentMonth = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let currentYear = today.getFullYear();

  let vencidos = [];

  for (i = 0; i < kits.length; i++) {
    const kit = kits[i];
    if (kit.yearexpirationDate < currentYear) vencidos.push(kit);
    else if (kit.yearexpirationDate === currentYear) {
      if (kit.monthexpirationDate < currentMonth) vencidos.push(kit);
      else if (kit.monthexpirationDate === currentMonth) {
        if (kit.dayexpirationDate < currentDay) vencidos.push(kit);
      }
    }
  }

  var gt0 = false;
  var gt1 = false;
  var et1 = false;

  if (newRequisitions > 0) gt0 = true;

  if (newRequisitions === 1) et1 = true;

  if (newRequisitions > 1) gt1 = true;

  //Kitstock notification object
  let totalKitCounter = [];

  for (let k = 0; k < ToxinasSigla.length; k++) {
    totalKitCounter.push({
      name: ToxinasSigla[k],
      count: 0,
    });
  }

  for (let i = 0; i < kits.length; i++) {
    //Will count all ammounts for all kits that are not deleted, and store in totalKitCounter.name vector.
    if (!kits[i].deleted) {
      productC = kits[i].productCode;
      let pointIndex = Number;
      let countAux = Number;

      for (let j = 0; j < ToxinasSigla.length; j++) {
        let currentTox = ToxinasSigla[j];
        if (productC === (ToxinasSigla[j] === 'FBS' ? 'FUMO' : ToxinasSigla[j]) + " Romer") {
          pointIndex = totalKitCounter.findIndex(
            (element) => element.name === currentTox
          );
          countAux = totalKitCounter[pointIndex].count + kits[i].amount;
          totalKitCounter[pointIndex].count = countAux;
        }
      }
    }
  }

  for (let p = 0; p < ToxinasAll.length; p++) {
    let stockIndex = kitstocks.findIndex(
      (element) => element.name === ToxinasAll[p].Full
    );
    let countIndex = totalKitCounter.findIndex(
      (element) => element.name === ToxinasAll[p].Sigla
    );
    let actualKitStock = kitstocks[stockIndex];
    let actualKitCounter = totalKitCounter[countIndex];
    if (actualKitCounter.count < actualKitStock.minStock) {
      //Counter is less than minimum ammount for a specific toxin
      totalKitCounter[countIndex].isLessThan = true;
      totalKitCounter[countIndex].minStock = actualKitStock.minStock;
    } else {
      totalKitCounter[countIndex].isLessThan = false;
      totalKitCounter[countIndex].minStock = actualKitStock.minStock;
    }
  }
  res.render("admin/homeAdmin", {
    title: "Home",
    layout: "layoutDashboard.hbs",
    countClients,
    vencidos,
    countSamples,
    novasReq: newRequisitions,
    gt0,
    gt1,
    et1,
    ...req.session,
    totalKitCounter,
    countRequisitions,
  });
});

module.exports = router;
