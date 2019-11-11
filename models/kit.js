const mongoose = require('mongoose');

const kitSchema = new mongoose.Schema({
  kitId: String,
  productCode: {
    type: String,
    required: true
  },
  productDescription: String,
  lot: String,
  moveDate: String,
  dayexpirationDate: Number,
  monthexpirationDate: Number,
  expirationDate: String,
  yearexpirationDate: Number,
  stdLevel: Number,
  Lod: Number,
  Loq: Number,
  calibrators: {
    P1: {
      sampleID: String,
      concentration: Number
    },
    P2: {
      sampleID: String,
      concentration: Number
    },
    P3: {
      sampleID: String,
      concentration: Number
    },
    P4: {
      sampleID: String,
      concentration: Number
    },
    P5: {
      sampleID: String,
      concentration: Number
    }
  },
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
  active: {
    type: Boolean, // 1 for active, 0 for not
    default: 0
  },
  deleted: {
    type: Boolean, // 1 for deleted, 0 for not deleted
    default: 0
  },
  semStock: {
    type: Boolean, // 1 for out of stock
    default: 0
  },
  mycotoxin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mycotoxin'
  },
  kitType: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'F'],
    required: true
  },
  stripLength: Number,
  toxinaStart: Number,
  mapArray: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workmap'
  }]
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
   * Get active Kit from Aflatoxina 
   * @returns {Array} Array of Kits
   */
  static getActiveAfla() {
    return new Promise((resolve, reject) => {
      KitModel.find({active: true, $or:[{productCode:"AFLA Romer"},{productCode:"MycoSep AflaZon"}]}).exec().then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get active Kit from Deoxinivalenol 
   * @returns {Array} Array of Kits
   */
  static getActiveDeox() {
    return new Promise((resolve, reject) => {
      KitModel.find({active: true, productCode: "DON Romer"  }).exec().then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get active Kit from T2-toxin 
   * @returns {Array} Array of Kits
   */
  static getActiveT2() {
    return new Promise((resolve, reject) => {
      KitModel.find({active: true, productCode:"T2 Romer"}).exec().then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get active Kit from Zearalenona 
   * @returns {Array} Array of Kits
   */
  static getActiveZea() {
    return new Promise((resolve, reject) => {
      KitModel.find({active: true, productCode:"ZEA Romer"}).exec().then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  }

   /**
   * Get active Kit from Fumonisina 
   * @returns {Array} Array of Kits
   */
  static getActiveFum() {
    return new Promise((resolve, reject) => {
      KitModel.find({active: true, $or:[{productCode:"MycoSep Fum"},{productCode:"FUMO Romer"}]}).exec().then((results) => {
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
   * Get all kits with same productCode
   * @param {string} code - product code
   * @returns {array} - Kit array
   */
  static getByProductCode(code) {
    return new Promise((resolve, reject) => {
      KitModel.find({ productCode: code }).exec().then((result) => {
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
      KitModel.findByIdAndUpdate(id, kit).catch((err) => {
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
      KitModel.findByIdAndUpdate(id, { $set: { mycotoxins } }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Set a vector of mycotoxins
   * @param {string} id - Kit Id
   * @param {Boolean} isActive - state of the map
   * @returns {null}
   */
  static setActiveStatus(id, status) {
    return new Promise((resolve, reject) => {
      KitModel.findByIdAndUpdate(id, { $set: { active: status } }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Set a vector of mycotoxins
   * @param {string} id - Kit Id
   * @param {Number} start - number of the first workmap empty
   * @returns {null}
   */
  static setToxinaStart(id, start) {
    return new Promise((resolve, reject) => {
      KitModel.findByIdAndUpdate(id, { $set: { toxinaStart: start } }).catch((err) => {
        reject(err);
      });
    });
  }
  
  /**
    * Change the amount
    * @param {string} id - Kit Id
    * @param {Number} newAmount-new amount value
    */
  static setAmount(id, newAmount) {
    return new Promise((resolve, reject) => {
      KitModel.findByIdAndUpdate(id, { $set: { amount: newAmount } }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
     * increases  the amount in 1
     * @param {string} id - Kit Id
     */
  static increaseAmount(id, numDecrease) {
    return new Promise((resolve, reject) => {
      KitModel.findByIdAndUpdate(id, { $inc: { amount: 1 } }).catch((err) => {
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

  static addMap(id, mapwork) {
    return new Promise((resolve, reject) => {
      KitModel.findByIdAndUpdate(id, { $push: { mapArray: mapwork } }).catch((err) => {
        reject(err);
      });
    });
  }

  /**

  * @param {string} id - Kit Id
  * @param {string} p1 - sample/calibrator Id
  */

  static addP1(id, p1) {
    return new Promise((resolve, reject) => {
      KitModel.findByIdAndUpdate(id, { $set: { 'calibrators.P1.sampleID': p1 } }).catch((err) => {
        reject(err);
      });
    });
  }

  static addP2(id, p2) {
    return new Promise((resolve, reject) => {
      KitModel.findByIdAndUpdate(id, { $set: { 'calibrators.P2.sampleID': p2 } }).catch((err) => {
        reject(err);
      });
    });
  }

  static addP3(id, p3) {
    return new Promise((resolve, reject) => {
      KitModel.findByIdAndUpdate(id, { $set: { 'calibrators.P3.sampleID': p3 } }).catch((err) => {
        reject(err);
      });
    });
  }

  static addP4(id, p4) {
    return new Promise((resolve, reject) => {
      KitModel.findByIdAndUpdate(id, { $set: { 'calibrators.P4.sampleID': p4 } }).catch((err) => {
        reject(err);
      });
    });
  }

  static addP5(id, p5) {
    return new Promise((resolve, reject) => {
      KitModel.findByIdAndUpdate(id, { $set: { 'calibrators.P5.sampleID': p5 } }).catch((err) => {
        reject(err);
      });
    });
  }


  static getWorkmapsById(id) {
    return new Promise((resolve, reject) => {
      KitModel.findById(id).then((result) => {
        resolve(result.mapArray);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}


module.exports = Kit;
