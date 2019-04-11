const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const sampleSchema = new mongoose.Schema({
  samplenumber: Number,
  requisition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Requisition'
  }
}, { timestamps: true, strict: false });

const SampleModel = mongoose.model('Sample', sampleSchema);

class Sample {
  /**
   * Get all Samples from database
   * @returns {Array} Array of Samples
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      SampleModel.find({}).populate('user').exec().then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get a Sample by it's id
   * @param {string} id - Sample Id
   * @returns {Object} Sample Document Data
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      SampleModel.findById(id).populate('user').exec().then((result) => {
        resolve(result.toObject());
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get a Sample by it's numsample
   * @param {string} destination - Sample's Number
   * @returns {Object} Sample Document Data
   */
  static getBySampleNumber(samplenumber) {
    return new Promise((resolve, reject) => {
      SampleModel.findById(samplenumber).populate('user').exec().then((result) => {
        resolve(result.toObject());
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get a Sample by it's requisition id
   * @param {string} requisition id - Sample's Requisition Id
   * @returns {Object} Sample Document Data
   */
  static getByIdRequisition(idrequisition) {
    return new Promise((resolve, reject) => {
      SampleModel.findById(idrequisition).populate('user').exec().then((result) => {
        resolve(result.toObject());
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Create a new Sample
   * @param {Object} project - Sample Document Data
   * @returns {string} New Sample Id
   */
  static create(sample) {
    return new Promise((resolve, reject) => {
      SampleModel.create(sample).then((result) => {
        resolve(result._id);
      }).catch((err) => {
        reject(err);
      });
    });
  }



  /**
   * Update a Sample
   * @param {string} id - Sample Id
   * @param {Object} Sample - Sample Document Data
   * @returns {null}
   */
  static update(id, sample) {
    return new Promise((resolve, reject) => {
      SampleModel.findByIdAndUpdate(id, sample).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Delete a Sample
   * @param {string} id - Sample Id
   * @returns {null}
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      SampleModel.findByIdAndDelete(id).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Deletes all Samples from DB
   * @returns {null}
   */
  static clear() {
    return new Promise((resolve, reject) => {
      SampleModel.deleteMany({}).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = Sample;
