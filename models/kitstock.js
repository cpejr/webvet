const mongoose = require('mongoose');

const kitstockSchema = new mongoose.Schema({
  stockmin: Number,
  productcode: String,
});


const KitstockModel = mongoose.model('Kitstock', kitstockSchema);

class Kitstock {
  /**
   * Get all Kits from database
   * @returns {Array} Array of Kits
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      KitstockModel.find({}).exec().then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get a Kit by it's id
   * @param {string} id - Kit Id
   * @returns {Object} - Kit Document Data
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      KitstockModel .findById(id).exec().then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Create a new Kit
   * @param {Object} kit - Kit Document Data
   * @returns {string} - New Kit Id
   */
  static create(kitstock) {
    return new Promise((resolve, reject) => {
      KitstockModel.create(kitstock).then((result) => {
        resolve(result._id);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Update a Kit
   * @param {string} id - Kit Id
   * @param {Object} Kit - Kit Document Data
   * @returns {null}
   */
  static update(id, kitstock) {
    return new Promise((resolve, reject) => {
      KitstockModel.findByIdAndUpdate(id, kitstock).catch((err) => {
        reject(err);
      });
    });
  }


  /**
  * Delete a Kit
  * @param {string} id - Kit Id
  * @returns {null}
  */
  static delete(id) {
   return new Promise((resolve, reject) => {
     KitstockModel.findByIdAndUpdate(id, { deleted: 1 }).then(() => {
       resolve();
     }).catch((err) => {
       reject(err);
     });
   });
  }



}

module.exports = Kitstock;