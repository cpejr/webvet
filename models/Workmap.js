const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');



const workmapSchema = new mongoose.Schema({
  mapID: String,
  productCode: String,

  samplesArray: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sample'
  }],

  deleted: {
    type: Boolean, //1 for deleted, 0 for not deleted
    default: 0
  },

});

const WorkmapModel = mongoose.model('Workmap', workmapSchema);


class Workmap {

  static getAll() {
    return new Promise((resolve, reject) => {
      WorkmapModel.find({}).populate('workmap').exec().then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  }


  static create(workmap) {
    return new Promise((resolve, reject) => {
      WorkmapModel.create(workmap).then((result) => {
        resolve(result._id);
      }).catch((err) => {
        reject(err);
      });

    });
  }
  /**
   * add a Sample
   * @param {string} id - map  Id
   * @param {Object} Sample - id
   * @returns {null}
   */
  static addSample(id, sample,mapid) {
    return new Promise((resolve, reject) => {
    WorkmapModel.findByIdAndUpdate(id, { $push: { samplesArray: sample },$set: { mapID: mapid } }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * remove a Sample
   * @param {string} id - map  Id
   * @param {Object} Sample - id
   * @returns {null}
   */

  static removeSample(id, sample) {
    return new Promise((resolve, reject) => {
    WorkmapModel.findByIdAndUpdate(id, { $pull: { samplesArray: sample }}).then(()=>{
      resolve();
    }).catch((err) => {
        reject(err);
      });
    });
  }


  static setMapID(id, mapid) {
    return new Promise((resolve, reject) => {
    WorkmapModel.findByIdAndUpdate(id, { $set: { mapID: mapid } }).catch((err) => {
        reject(err);
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      WorkmapModel.findOneAndDelete({_id: id}).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
   });
 }


 static getOneMap(id) {
   return new Promise((resolve, reject) => {
    WorkmapModel.findById(id).exec().then((map) => {
       resolve(map);
    }).catch((err) => {
      reject(err);
    });
  });
 }



}

module.exports = Workmap;
