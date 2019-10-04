const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('./user');
const Mycotoxin = require('./mycotoxin');

const requisitionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  identification: Number,
  datecollection: String,
  detectedConcetration: Number,
  origin: String,
  comment: String,
  lab: String,
  destination: String,
  farmname: String,
  sampleVector: [String],
  status: {
    type: String,
    enum: ['Aprovada', 'Em Progresso', 'Cancelada'],
    default: 'Em Progresso',
    required: true
  },
  address: {
    cep: Number,
    street: String,
    number: String,
    complement: String,
    city: String,
    state: String
  },
  client: {
    cep: Number,
    fullname: String,
    phone: String,
    cellphone: String,
    email: String

  },
  mycotoxin: [String],
  samples: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sample'
  }]
}, { timestamps: true, strict: false });

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
   * Get a Requisitions by sample
   * @returns one Requisitions
   */
  static getBySampleID(sampleid) {
    return new Promise((resolve, reject) => {
      RequisitionModel.find( { samples: {$in:sampleid } }).then((req) => {
        resolve(req[0]);
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
        console.log('entrou na funcao create');
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

  /**
   * Sum all Requisitions from DB
   * @returns {null}
   */
  static count() {
    return new Promise((resolve, reject) => {
      RequisitionModel.countDocuments({}).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
  * Add sample to samples
  * @param {string} id - requisition Id
  * @param {string} sample - Sample Id
  * @returns {null}
  */
 static addSample(id, sample) {
   return new Promise((resolve, reject) => {
     RequisitionModel.findByIdAndUpdate(id, { $push: { samples: sample } }).catch((err) => {
       reject(err);
     });
   });
 }

}

module.exports = Requisition;
