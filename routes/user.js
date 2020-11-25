const express = require("express");
const router = express.Router();
const mongoose = require("mongodb");
const auth = require("../middlewares/auth");
const Requisition = require("../models/requisition");
const User = require("../models/user");
const Samples = require("../models/sample");
const Covenant = require("../models/covenant");
const { isAuthenticated } = require("../middlewares/auth");
const ObjectId = require("mongodb").ObjectID;

router.get("/", auth.isAuthenticated, async function (req, res) {
  try {
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
      // console.log("Está em um convênio");
      const convenant = await Covenant.getRelatedIdsAndConvName(
        user._id,
        user.associatedProducers
      );
      userIds = convenant.ids;
      generalData.convenant = convenant.name;
      // console.log("Puxou os associados do convenio");
    }
    // console.log("Ids associados: ", userIds);
    const requisitions = await Requisition.getAllByUserIdWithUser(userIds); //É só passar os Ids certos pra esse cara.

    let data = new Array();
    let samplesId = new Array();
    let reports = new Array();
    for (const requi of requisitions) {
      data.push({
        name: requi.user.fullname,
        number: requi.requisitionnumber,
        year: requi.createdAt.getFullYear(),
        _id: requi._id,
      });
      for (const sampleId of requi.samples) {
        samplesId.push(ObjectId(sampleId));
      }
    }

    const samples = await Samples.getFinalizedByIdArrayWithUser(samplesId);

    for (const sample of samples) {
      if (sample.report === true) {
        sample.name = sample.requisitionId.user.fullname;
        reports.push(sample);
      }
    }
    let repEmpty = true;
    if (reports.length > 0) {
      repEmpty = false;
    }

    const managers = await User.getManagersOfUserById(user._id);

    if (managers.length > 0) {
      generalData.moreThanOneManager = managers.length > 1;
      generalData.hasManager = true;

      const managersName = [];

      managers.forEach(element => {
        managersName.push(element.fullname);
      });
      // console.log(managersName)
      generalData.manager = managersName.join(', ');
    }

    generalData.hasGeneralData =
      generalData.hasManager || generalData.isOnCovenant;

    res.render("user", {
      title: "Cliente",
      layout: "layoutDashboard.hbs",
      generalData,
      data,
      reports,
      repEmpty,
      ...req.session,
    });
  } catch (err) {
    console.warn(err);
    res.redirect("/error");
  }
});

router.post(
  "/removeFromCovenant/:id",
  auth.isAuthenticated,
  auth.isAdmin,
  async function (req, res) {
    // console.log("Entrou na rota delete");
    // console.log("req.params.id = " + req.params.id);
    const { id } = req.params;
    // console.log("req.body.covenant = " + req.body.covenant);
    const cId = req.body.covenant.id;
    // console.log(cId);
    await Covenant.removeManager(cId, id);
    await User.removeCovenant([id]);
    // console.log("Convenio deletado!");
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

    //console.log("produtores: ", producers);

    await User.addProducers(id, producers);
    //console.log("Produtores associados!");

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
    console.log("Produtores removidos!");

    res.redirect(`/users/show/${id}/%20`);
  }
);

module.exports = router;
