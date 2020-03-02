const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  results: [{
    mycotoxin: String,
    detectedConcentration: String
  }],
  mycotoxins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mycotoxin'
  }],
  technicalAdvise: String,
  comments: String,
  deleted: {
    type: Boolean, //1 for deleted, 0 for not deleted
    default: 0
  }
});

const ReportModel = mongoose.model('Report', reportSchema);

class Report {
  /**
   * Get all  from database
   * @returns {Array} Array of Reports
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      ReportModel.find({}).exec().then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get a Report by it's id
   * @param {string} id - Report Id
   * @returns {Object} - Report Document Data
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      ReportModel.findById(id).exec().then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Create a new Report
   * @param {Object} report - Report Document Data
   * @returns {string} - New Report Id
   */
  static create(report) {
    return new Promise((resolve, reject) => {
      ReportModel.create(report).then((result) => {
        resolve(result._id);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Update a Report
   * @param {string} id - Report Id
   * @param {Object} Report - Report Document Data
   * @returns {null}
   */
  static update(id, report) {
    return new Promise((resolve, reject) => {
      ReportModel.findByIdAndUpdate(id, report).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
  /**
   * Add a Mycotoxin
   * @param {string} id - Report Id
   * @param {string} mycotoxin - mycotoxin id
   * @returns {null}
   */

  static addMycotoxin(id, mycotoxin){
    return new Promise((resolve, reject) => {
      ReportModel.findByIdAndUpdate(id, { $push: { mycotoxins: mycotoxin } }).populate().catch((err) => {
        reject(err);
      });
    });
  }


  /**
  * Delete a Report
  * @param {string} id -Report Id
  * @retuns {null}
  */

  static delete(id) {
    return new Promise((resolve, reject) => {
      ReportModel.findByIdAndUpdate(id, {deleted: 1}).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
