const express = require('express');
const firebase = require('firebase');
const router = express.Router();
const mongoose = require('mongodb');
const auth = require('./middleware/auth');
const Requisition = require('../models/requisition');
const User = require('../models/user');
const Samples = require('../models/sample');
const Covenant = require('../models/covenant');
const { getFinalizedByIdArray } = require('../models/sample');
const { isAuthenticated } = require('./middleware/auth');
const ObjectId = require('mongodb').ObjectID

router.get('/', auth.isAuthenticated, async function (req, res) {
  try {

    const firebaseId = await firebase.auth().currentUser.uid;

    const user = await User.getByFirebaseId(firebaseId);
    let userIds = [user._id];
    if (user.type !== "Produtor") { //Produtor só pode ver os proprios laudos
      userIds = [user._id, ...user.associatedProducers];
    };
    //POR ALGUM MOTIVO ESSA COMPARACAO NAO FUNCIONA SE NAO FIZER ZOADO ASSIM
    if (user.isOnCovenant == "true") { //Se pertencente ao convenio vai puxar os ids relacionados.
      console.log("Está em um convênio");
      userIds = await Covenant.getRelatedIds(user._id, user.associatedProducers);
      console.log("Puxou os associados do convenio");
    }
    console.log("Ids associados: ", userIds);
    const requisitions = await Requisition.getAllByUserId(userIds); //É só passar os Ids certos pra esse cara.

    let data = new Array;
    let samplesId = new Array;
    let reports = new Array;
    for (const requi of requisitions) {
      data.push({
        number: requi.requisitionnumber,
        year: requi.createdAt.getFullYear(),
        _id: requi._id,
      });
      for (const sampleId of requi.samples) {
        samplesId.push(ObjectId(sampleId));
      }
    }

    const samples = await getFinalizedByIdArray(samplesId);

    for (const sample of samples) {
      if (sample.report === true) {
        reports.push(sample);
      }
    }
    let repEmpty = true;
    if (reports.length > 0) {
      repEmpty = false;
    }

    res.render('user', { title: 'Cliente', layout: 'layoutDashboard.hbs', data, reports, repEmpty, ...req.session });

  } catch (err) {
    console.log(err);
    res.redirect('/error');
  }
});

router.post('/removeFromCovenant/:id', auth.isAuthenticated, auth.isAdmin, async function (req, res) {
  console.log('Entrou na rota delete');
  console.log("req.params.id = " + req.params.id);
  const { id } = req.params;
  console.log("req.body.covenant = " + req.body.covenant);
  const cId = req.body.covenant.id;
  console.log(cId);
  await Covenant.removeManager(cId, id);
  await User.removeCovenant([id]);
  console.log("Convenio deletado!");
  res.redirect(`/covenant/edit/${cId}`)
});

router.post('/associateProducers/:id', isAuthenticated, auth.isFromLab, async function (req, res) {
  const { id } = req.params;
  let { producers } = req.body;

  producers = producers.map((producer) =>{
    producer = mongoose.ObjectId(producer);
    return producer;
  })

  console.log("produtores: ", producers);
  
  await User.addProducers(id, producers);
  console.log("Produtores associados!");

  res.redirect(`/users/show/${id}/%20`);
})

router.post('/removeProducer/:id', isAuthenticated, auth.isFromLab, async function (req, res) {
  const { id } = req.params;
  let { producer } = req.body;

  producer = producer.map((selected) =>{
    selected = mongoose.ObjectId(selected);
    return selected;
  })
  
  await User.removeProducer(id, producer);
  console.log("Produtor removido!");

  res.redirect(`/users/show/${id}/%20`);
})

module.exports = router;
