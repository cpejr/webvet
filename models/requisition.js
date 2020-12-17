const mongoose = require("mongoose");
const Counter = require("./counter");
const Sample = require("./sample");

const requisitionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    requisitionnumber: Number,
    autorizationnumber: String, //Controle interno do solicitante
    datecollection: String,
    datereceipt: String, //Data de recebimento
    comment: String,
    IE: String,
    city: String,
    state: String,
    producer: String,
    destination: String,
    farmname: String,
    mycotoxin: [String],
    responsible: String,
    status: {
      type: String,
      enum: ["Nova", "Aprovada", "Em Progresso", "Cancelada"],
      default: "Nova",
      required: true,
    },
    address: {
      cep: Number,
      street: String,
      number: String,
      complement: String,
      city: String,
      state: String,
      neighborhood: String,
    },
    client: {
      cep: Number,
      fullname: String,
      phone: String,
      cellphone: String,
      email: String,
      register: String,
    },
    samples: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sample",
      },
    ],
  },
  { timestamps: true, strict: false }
);

const RequisitionModel = mongoose.model("Requisition", requisitionSchema);

class Requisition {
  /**
   * Get all Requisitions from database
   * @returns {Array} Array of Requisitions
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      RequisitionModel.find({})
        .populate("user")
        .exec()
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static async countNew() {
    const response = await RequisitionModel.count({ status: "Nova" });
    return response;
  }

  static async countAll() {
    const response = await RequisitionModel.count({});
    return response;
  }

  /**
   * Get a Requisitions by sample
   * @returns one Requisitions
   */
  static getBySampleID(sampleid) {
    return new Promise((resolve, reject) => {
      RequisitionModel.find({ samples: { $in: sampleid } })
        .then((req) => {
          resolve(req);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getByIdArray(reqidArray) {
    return new Promise((resolve, reject) => {
      RequisitionModel.find({ _id: { $in: reqidArray } })
        .then((req) => {
          resolve(req);
        })
        .catch((err) => {
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
      RequisitionModel.findById(id)
        .populate("user")
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
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
      RequisitionModel.findById(destination)
        .populate("user")
        .exec()
        .then((result) => {
          resolve(result.toObject());
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Create a new Requisition
   * @param {Object} project - Requisition Document Data
   * @returns {string} New Requisition Id
   */
  static async create(requisition) {
    try {
      let requisitionnumber = await Counter.getRequisitionCount();
      requisition.requisitionnumber = requisitionnumber;
      const result = await RequisitionModel.create(requisition);
      requisitionnumber++;
      Counter.setRequisitionCount(requisitionnumber);
      return result;
    } catch (error) {
      console.warn(error);
      return error;
    }
  }

  /**
   * Update a Requisition
   * @param {string} id - Requisition Id
   * @param {Object} Requisition - Requisition Document Data
   */
  static update(id, requisition) {
    return new Promise((resolve, reject) => {
      RequisitionModel.findByIdAndUpdate(id, requisition)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
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
      //projection: -> Optional. A subset of fields to return.
      RequisitionModel.findOneAndDelete(
        { _id: id },
        { projection: { samples: 1 } }
      )
        .then((obj) => {
          var samples = obj.samples;
          Sample.deleteMany(samples).then((result) => {
            resolve(result);
          });
        })
        .catch((err) => {
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
      RequisitionModel.deleteMany({})
        .then(() => {
          resolve();
        })
        .catch((err) => {
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
      RequisitionModel.countDocuments({})
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
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
  static async addSample(id, sample) {
    try {
      await RequisitionModel.findByIdAndUpdate(id, {
        $push: { samples: sample },
      });
    } catch (error) {
      console.warn(error);
      return error;
    }
  }

  static getAllInProgress() {
    return new Promise((resolve, reject) => {
      RequisitionModel.find({ status: "Em Progresso" })
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static async getAllByUserIdWithUser(userIds) {
    return await RequisitionModel.find({ user: userIds }).populate(
      "user",
      "fullname"
    );
  }

  static getStateData() {
    return new Promise((resolve, reject) => {
      RequisitionModel.aggregate([
        { $match: { status: "Aprovada" } },
        { $project: { state: 1, samples: 1 } },
        {
          $group: {
            _id: "$state",
            samples: { $sum: { $size: "$samples" } },
          },
        },
      ])
        .then((result) => {
          let total = 0;

          for (let i = 0; i < result.length; i++) total += result[i].samples;

          for (let j = 0; j < result.length; j++)
            result[j].frequency = result[j].samples / total;

          resolve(result);
        })
        .catch((err) => {
          console.warn(err);
          reject(err);
        });
    });
  }
  // -------------------------------------------------------------------------

  static getAnimalData() {
    return new Promise((resolve, reject) => {
      RequisitionModel.aggregate([
        { $match: { status: "Aprovada" } },
        { $project: { destination: 1, samples: 1 } },
        {
          $group: {
            _id: "$destination",
            samples: { $sum: { $size: "$samples" } },
          },
        },
      ])
        .then((result) => {
          let total = 0;

          for (let i = 0; i < result.length; i++) total += result[i].samples;

          for (let j = 0; j < result.length; j++)
            result[j].frequency = result[j].samples / total;

          resolve(result);
        })
        .catch((err) => {
          console.warn(err);
          reject(err);
        });
    });
  }
}

module.exports = Requisition;
