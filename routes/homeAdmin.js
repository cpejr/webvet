const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Sample = require("../models/sample");
const Requisition = require("../models/requisition");
const User = require("../models/user");
const Kit = require("../models/kit");
const Counter = require("../models/counter");

/* GET home page. */
router.get(
  "/",
  auth.isAuthenticated,
  auth.isFromLab,
  async function (req, res) {
    const promises = [
      User.count(),
      Sample.count(),
      Kit.getAllInStock(),
      Kit.countAvailableWorkmaps(),
      Counter.getEntireKitStocks(),
      Requisition.countNew(),
      Requisition.countAll(),
    ];

    const [
      countClients,
      countSamples,
      kits,
      currentKitCount,
      kitStocks,
      newRequisitions,
      countRequisitions,
    ] = await Promise.all(promises);

    let today = new Date();
    let vencidos = [];
    kits.forEach((kit) => {
      if (kit.expirationDate < today) vencidos.push(kit);
    });

    var gt0 = false;
    var gt1 = false;
    var et1 = false;

    if (newRequisitions > 0) gt0 = true;
    if (newRequisitions === 1) et1 = true;
    if (newRequisitions > 1) gt1 = true;

    //Kitstock notification object
    let totalKitCounter = currentKitCount.map(obj => {return {name: obj._id, count: obj.count}});
    
    totalKitCounter.forEach((counter, index) =>{
      let stockIndex = kitStocks.findIndex(
        (element) => element.sigle === counter.name
      );
      totalKitCounter[index].isLessThan = counter.count < kitStocks[stockIndex].minStock;
      totalKitCounter[index].minStock = kitStocks[stockIndex].minStock;
    })

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
  }
);

module.exports = router;
