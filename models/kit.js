const mongoose = require('mongoose');

const kitSchema = new mongoose.Schema({
  kitId: String,
  lot: String,
  moveDate: Date,
  expirationDate: Date,
  stdLevel: Number,
  Lod: Number,
  LoQ: Number,
  amount: Number,
  provider: String,
  stockMin: Number,
  unit: Number,
  price: Number,
  r2: Number,
  status: {
    type: String,
    enum: ['Suficiente', 'Próximo ao Vencimento', 'Kit Vencido']
  },
  deleted: {
    type: Boolean, //1 for deleted, 0 for not deleted
    default: 0
  },
  mycotoxin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mycotoxin'
  }
});

const KitModel = mongoose.model('Kit', kitSchema);

class Kit {
  /**
   * Get all Kits from database
   * @returns {Array} Array of Kits
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      KitModel.find({}).exec().then((results) => {
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
      KitModel.findById(id).exec().then((result) => {
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
  static create(kit) {
    return new Promise((resolve, reject) => {
      KitModel.create(kit).then((result) => {
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
  static update(id, kit) {
    return new Promise((resolve, reject) => {
      KitModel.findByIdAndUpdate(id, kit).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Add a mycotoxin
   * @param {string} id - Kit Id
   * @param {string} mycotoxin - Mycotoxin Id
   * @returns {null}
   */
  static addMycotoxin(id, mycotoxin) {
   return new Promise((resolve, reject) => {
     KitModel.findByIdAndUpdate(id, { $push: { mycotoxins: mycotoxin } }).catch((err) => {
       reject(err);
     });
   });
 }
 /**
  * Set a vector of mycotoxins
  * @param {string} id - Kit Id
  * @param {string} mycotoxins - Mycotoxins Id
  * @returns {null}
  */
 static setMycotoxin(id, mycotoxins) {
  return new Promise((resolve, reject) => {
    KitModel.findByIdAndUpdate(id, { $set: { mycotoxins: mycotoxins } }).catch((err) => {
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
     KitModel.findByIdAndUpdate(id, { deleted: 1 }).then(() => {
       resolve();
     }).catch((err) => {
       reject(err);
     });
   });
  }
}

module.exports = Kit;
