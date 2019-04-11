const mongoose = require('mongoose');

const mycotoxinSchema = new mongoose.Schema({
  name: String,
  deleted: {
    type: Boolean, //1 for deleted, 0 for not deleted
    default: 0
  }
  });

const MycotoxinModel = mongoose.model('Mycotoxin', mycotoxinSchema);

class Mycotoxin{
/**
 * Get all Mycotoxins from database
 * @returns {Array} Array of Mycotoxin
 */
static getAll() {
  return new Promise((resolve, reject) => {
    MycotoxinModel.find({deleted: 0}).exec().then((results) => {
      resolve(results);
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
 * Get a Mycotoxin by it's id
 * @param {string} id - Mycotoxin Id
 * @returns {Object} - Mycotoxin Document Data
 */
static getById(id) {
  return new Promise((resolve, reject) => {
    MycotoxinModel.findById(id).exec().then((result) => {
      resolve(result);
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
 * Create a new Mycotoxin
 * @param {Object} mycotoxin - Mycotoxin Document Data
 * @returns {string} - New Mycotoxin Id
 */
static create(mycotoxin) {
  return new Promise((resolve, reject) => {
    MycotoxinModel.create(mycotoxin).then((result) => {
      console.log(result);
      resolve(result._id);
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
 * Update a Mycotoxin
 * @param {string} id - Mycotoxin Id
 * @param {Object} Kit - Mycotoxin Document Data
 * @returns {null}
 */
static update(id, mycotoxin) {
  return new Promise((resolve, reject) => {
    MycotoxinModel.findByIdAndUpdate(id, mycotoxin).then(() => {
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
* Delete a Mycotoxin
* @param {string} id - Mycotoxin Id
* @returns {null}
*/
static delete(id) {
 return new Promise((resolve, reject) => {
   MycotoxinModel.findByIdAndUpdate(id, { deleted: 1 }).then(() => {
     resolve();
   }).catch((err) => {
     reject(err);
    });
  });
  }
}

module.exports = Mycotoxin;
