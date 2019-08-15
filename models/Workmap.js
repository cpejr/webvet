const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');



const workmapSchema = new mongoose.Schema({
  mapID: String,

  samplesArray: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sample'
  }],

  deleted: {
    type: Boolean, //1 for deleted, 0 for not deleted
    default: 0
  },

});

const WorkmapModel = mongoose.model('Workmap', sworkmapSchema);


class Workmap {


}

module.exports = Workmap;
