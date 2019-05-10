const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const requisitionSchema = new mongoose.Schema({
  identification: Number,
  datecollection: Date,
  detectedConcetration: Number,
  numapproval: Number,
  packing: String,
  origin: String,
  comment: String,
  lab: String,
  destination: String,
  farmname: String,
  farmcity: String,
  farmstate: String,
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  mycotoxin: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mycotoxin'
  }],
  sample: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sample'
  }]
}, { timestamps: true, strict: false });

const Client  = mongoose.model('User', userSchema);
const Mycotoxin = mongoose.model('Mycotoxin', mycotoxinSchema);

const RequisitionModel = mongoose.model('Requisition', requisitionSchema);

class Requisition {
  /**
   * Get all Requisitions from database
   * @returns {Array} Array of Requisitions
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      RequisitionModel.find({}).populate('user').exec().then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get a Requisition by it's id
   * @param {string} id - Requisition Id
   * @returns {Object} Requisition Document Data
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      RequisitionModel.findById(id).populate('user').exec().then((result) => {
        resolve(result.toObject());
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get a Requisition by it's destination
   * @param {string} destination - Requisition Destination
   * @returns {Object} Requisition Document Data
   */
  static getByDestination(destination) {
    return new Promise((resolve, reject) => {
      RequisitionModel.findById(destination).populate('user').exec().then((result) => {
        resolve(result.toObject());
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Create a new Requisition
   * @param {Object} project - Requisition Document Data
   * @returns {string} New Requisition Id
   */
  static create(requisition) {
    return new Promise((resolve, reject) => {
      RequisitionModel.create(requisition).then((result) => {
        resolve(result._id);

      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Update a Requisition
   * @param {string} id - Requisition Id
   * @param {Object} Requisition - Requisition Document Data
   * @returns {null}
   */
  static update(id, requisition) {
    return new Promise((resolve, reject) => {
      RequisitionModel.findByIdAndUpdate(id, requisition).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Delete a Requisition
   * @param {string} id - Requisition Id
   * @returns {null}
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      RequisitionModel.findByIdAndDelete(id).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Deletes all Requisitions from DB
   * @returns {null}
   */
  static clear() {
    return new Promise((resolve, reject) => {
      RequisitionModel.deleteMany({}).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = Requisition;
