const express = require("express");
const router = express.Router();
const mongoose = require("mongodb");
const auth = require("../middlewares/auth");
const Requisition = require("../models/requisition");
const User = require("../models/user");
const Samples = require("../models/sample");
const Covenant = require("../models/covenant");
const { isAuthenticated } = require("../middlewares/auth");

router.get("/", auth.isAuthenticated, async function (req, res) {
  const user = req.session.user;

  const generalData = {
    isOnCovenant: user.isOnCovenant,
    convenant: undefined,
    hasManager: false,
    moreThanOneManager: false,
    manager: undefined,
    hasGeneralData: false,
  };

  let userIds = [user._id];
  if (user.type !== "Produtor") {
    //Produtor só pode ver os proprios laudos
    userIds = [user._id, ...user.associatedProducers];
  }
  //POR ALGUM MOTIVO ESSA COMPARACAO NAO FUNCIONA SE NAO FIZER ZOADO ASSIM
  if (user.isOnCovenant == true) {
    //Se pertencente ao convenio vai puxar os ids relacionados.
    const convenant = await Covenant.getRelatedIdsAndConvName(
      user._id,
      user.associatedProducers
    );
    userIds = convenant.ids;
    generalData.convenant = convenant.name;
  }
  const requisitions = await Requisition.getAndPopulate({
    "charge.user": { $in: userIds },
  }); //É só passar os Ids certos pra esse cara.

  let data = [];
  let requisitionsIds = [];

  for (const requisition of requisitions) {
    requisitionsIds.push(requisition._id);

    data.push({
      name: requisition.charge.user.fullname,
      number: requisition.requisitionNumber,
      year: requisition.createdAt.getFullYear(),
      _id: requisition._id,
    });
  }
  let reports = await Samples.getAndPopulate({
    requisitionId: { $in: requisitionsIds },
    "report.status": "Disponível para o produtor",
  });

  reports = reports.map((sample) => ({
    ...sample.toJSON(),
    name: sample.requisition.charge.user.fullname,
  }));

  let reportEmpty = reports.length === 0;

  const managers = await User.getManagersOfUserById(user._id);

  if (managers.length > 0) {
    generalData.moreThanOneManager = managers.length > 1;
    generalData.hasManager = true;

    const managersName = [];

    managers.forEach((element) => {
      managersName.push(element.fullname);
    });
    generalData.manager = managersName.join(", ");
  }

  generalData.hasGeneralData =
    generalData.hasManager || generalData.isOnCovenant;

  res.render("user", {
    title: "Cliente",
    layout: "layoutDashboard.hbs",
    generalData,
    data,
    reports,
    reportEmpty,
    ...req.session,
  });
});

router.post(
  "/removeFromCovenant/:id",
  auth.isAuthenticated,
  auth.isAdmin,
  async function (req, res) {
    const { id } = req.params;
    const cId = req.body.covenant.id;
    
    await Covenant.removeManager(cId, id);
    await User.removeCovenant([id]);

    res.redirect(`/covenant/edit/${cId}`);
  }
);

router.post(
  "/associateProducers/:id",
  isAuthenticated,
  auth.isFromLab,
  async function (req, res) {
    const { id } = req.params;
    let { producers } = req.body;

    if (!Array.isArray(producers)) {
      producers = [producers];
    }

    producers = producers.map((producer) => {
      producer = mongoose.ObjectId(producer);
      return producer;
    });


    await User.addProducers(id, producers);

    req.flash("success", "Produtor asassociado com sucesso.");
    res.redirect(`/users/show/${id}/%20`);
  }
);

router.post(
  "/removeProducer/:id",
  isAuthenticated,
  auth.isFromLab,
  async function (req, res) {
    const { id } = req.params;
    let { producer } = req.body;

    producer = mongoose.ObjectId(producer);

    await User.removeProducer(id, producer);

    req.flash("success", "Produtor desassociado com sucesso.");
    res.redirect(`/users/show/${id}/%20`);
  }
);

module.exports = router;
