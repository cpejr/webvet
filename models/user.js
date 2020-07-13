const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  persontype: Boolean, // 0 = pessoa fisica, 1 = pessoa juridica
  fullname: String,
  firstname: String,
  uid: {
    type: String
  },
  register: {
    type: String // CPF ou CNPJ
    // unique: true
  },
  type: {
    type: String,
    enum: ['Admin', 'Analista', 'Produtor', 'Gerencia', 'Convenio'],
    default: 'Produtor'

  },
  email: {
    type: String,

    lowercase: true
    // unique: true

  },
  phone: String,
  cellphone: String,
  status: {
    type: String,
    enum: ['Inativo', 'Bloqueado', 'Aguardando aprovação', 'Ativo'],
    default: 'Aguardando aprovação',
    required: true

  },
  address: {
    cep: Number,
    street: String,
    number: String,
    neighborhood: String,
    complement: String,
    city: String,
    state: String
  },
  debt: {
    type: Boolean, //1 for debtor, 0 for not debtor
    default: 0
  },
  deleted: {
    type: Boolean, // 1 for deleted, 0 for not deleted
    default: 0
  },
  associatedProducers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isOnCovenant: {
    Type: Boolean,
    default: false
  }
}, { timestamps: true, static: false });

const UserModel = mongoose.model('User', userSchema);

class User {
  /**
   * Get all Users from database
   * @returns {Array} Array of Users
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      UserModel.find({}).sort({ fullname: 1 }).exec().then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get a User by it's id
   * @param {string} id - User Id
   * @returns {Object} - User Document Data
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      UserModel.findById(id).exec().then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Create a new User
   * @param {Object} user - User Document Data
   * @returns {string} - New User Id
   */
  static create(user) {
    return new Promise((resolve, reject) => {
      UserModel.create(user).then((result) => {
        resolve(result._id);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Update a User
   * @param {string} id - User Id
   * @param {Object} User - User Document Data
   * @returns {null}
   */
  static update(id, user) {
    return new Promise((resolve, reject) => {
      UserModel.findByIdAndUpdate(id, user).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
  * Delete a User
  * @param {string} id - User Id
  * @returns {null}
  */

  static delete(id) {
    return new Promise((resolve, reject) => {
      UserModel.findOneAndDelete({ _id: id }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get a User by it's uid
   * @param {string} id - User Uid
   * @returns {Object} - User Document Data
   */
  static getByUid(id) {
    return new Promise((resolve, reject) => {
      UserModel.findOne({ uid: id }).exec().then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  static getAllActiveProducers() {
    return new Promise((resolve, reject) => {
      UserModel.find({ type: "Produtor", status: "Ativo", deleted: false }).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  static getAllActiveManagers() {
    return new Promise((resolve, reject) => {
      UserModel.find({ type: "Gerencia", status: "Ativo", deleted: false }).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  static getAllActiveUnaffiliatedManagers() {
    return new Promise((resolve, reject) => {
      UserModel.find({ type: "Gerencia", status: "Ativo", deleted: false, isOnCovenant: false}).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  static getByQuery(query) {
    return new Promise((resolve, reject) => {
      UserModel.find(query).exec().then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
  * Add Producer to associatedProducers
  * @param {string} id - User Id
  * @param {string} user_id - User Id
  * @returns {null}
  */
  static addProducer(id, user_id) {
    return new Promise((resolve, reject) => {
      UserModel.findByIdAndUpdate(id, { $push: { associatedProducers: user_id } }).then(result =>{
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Remove Producer from associatedProducers
   * @param {string} id - User Id
   * @param {string} user_id - User Id
   * @returns {null}
   */
  static removeProducer(id, user_id) {
    return new Promise((resolve, reject) => {
      UserModel.findByIdAndUpdate(id, { $pull: { associatedProducers: user_id } }).then(result =>{
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  static addCovenant(id_array) {
    return new Promise((resolve, reject) => {
      UserModel.updateMany({_id: {$in: id_array}}, {isOnCovenant: true}).then(result => {
        console.log("Marcados como isOnCovenant");
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  static removeCovenant(id_array) {
    return new Promise((resolve, reject) => {
      UserModel.updateMany({_id: {$in: id_array}}, {isOnCovenant: false}).then(result => {
        console.log("Desmarcados do isOnCovenant");
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get all producers from a object by its id
   * @param {string} id - User uid
   * @returns {Array} - Array of users
   */
  static getAssociatedProducersById(id) {
    return new Promise((resolve, reject) => {
      UserModel.findById(id).populate({ path: 'associatedProducers' }).exec().then((result) => {
        resolve(result.associatedProducers);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Sum all Clients from DB
   * @returns {null}
   */
  static count() {
    return new Promise((resolve, reject) => {
      UserModel.countDocuments({ $or: [{ type: 'Convenio' }, { type: 'Produtor' }, { type: 'Gerencia' }] }).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
 * Get all Users that match the desired query
 * @param {Object} query - Object that defines the filter
 * @param {Object} sort - Object that defines the sort method
 * @returns {Object} User Document Data
 */
  static getByQuerySorted(query, sort) {
    return new Promise((resolve, reject) => {
      UserModel.find(query).sort(sort).populate().exec().then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get all Users from database
   * @returns {Array} Array of Users
   */
  static getAdmin() {
    return new Promise((resolve, reject) => {
      UserModel.findOne({ type: "Admin" }).exec().then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get a User name that match the desired query
   * @param {Object} query - Object that defines the filter
   * @returns {Object} User Document Data
   */
  static getOneByQuery(query) {
    return new Promise((resolve, reject) => {
      UserModel.findOne(query).exec().then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  static getPendingAndInactive() {
    return new Promise((resolve, reject) => {
      UserModel.aggregate([
        { $match: { $or: [{ status: "Inativo" }, { status: "Aguardando aprovação" }] } },
        {
          $group: {
            _id: "$status",
            users: { $push: "$$ROOT" }
          }
        }
      ]).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = User;
