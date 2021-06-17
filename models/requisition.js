const mongoose = require("mongoose");
const Counter = require("./counter");
const Sample = require("./sample");

const chargeSchema = new mongoose.Schema(
  {
    // Usuário associado a requisição
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fullname: String,
    cpfCnpj: String,
    street: String,
    // Número da residência
    number: String,
    complement: String,
    IE: String,
    neighborhood: String,
    city: String,
    state: String,
    cep: String,
  },
  { timestamps: false, strict: false }
);

const contactSchema = new mongoose.Schema(
  {
    //Nome completo do responsável
    fullname: String,
    email: String,
    phone: String,
    cellphone: String,
  },
  { timestamps: false, strict: false }
);

const analysisSchema = new mongoose.Schema(
  {
    producerName: String,

    // Controle interno do solicitante
    autorizationNumber: String,
    destination: String,
    state: String,
    city: String,
    // Data que recebeu as amostras no lab
    receiptDate: String,
    // Data de coleta pelo produtor
    collectionDate: String,

    // Quantidade recebida no lab
    receivedQuantity: String,
  },
  { timestamps: false, strict: false }
);

const requisitionSchema = new mongoose.Schema(
  {
    selectedToxins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Toxin",
      },
    ],

    requisitionNumber: Number,
    // Comentário das amostras
    comment: String,

    approved: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["Nova", "Aprovada", "Em Progresso", "Cancelada"],
      default: "Nova",
      required: true,
    },
    analysis: analysisSchema,

    // Dados de cobrança
    charge: chargeSchema,

    // Dados de contato
    contact: contactSchema,

    //Marca a requisição como criada pelo painel especial.
    special: {
      type: Boolean,
      default: false,
    },

    //Numero da requisição especial, so aparece se for finalizada pelo painel especial.
    specialYear: {
      type: String,
    },

    //Ano da requisição especial, so aparece se for finalizada pelo painel especial.
    specialNumber: {
      type: String,
    },
  },
  { timestamps: true, strict: false }
);

const RequisitionModel = mongoose.model("Requisition", requisitionSchema);

const Requisition = {
  async getSpecial(page = 1) {
    return RequisitionModel.find({ special: true })
      .populate("user")
      .sort({ createdAt: -1 })
      .skip(REQUISITIONS_PER_PAGE * (page - 1))
      .limit(REQUISITIONS_PER_PAGE);
  },

  async getSpecialCountPages() {
    const count = await RequisitionModel.find({
      special: true,
    }).countDocuments();

    return Math.ceil(count / REQUISITIONS_PER_PAGE);
  },

  async getRegular(page = 1) {
    return RequisitionModel.find({ special: { $ne: true } })
      .populate("user")
      .sort({ createdAt: -1 })
      .skip(REQUISITIONS_PER_PAGE * (page - 1))
      .limit(REQUISITIONS_PER_PAGE);
  },

  async getRegularCountPages() {
    const count = await RequisitionModel.find({
      special: { $ne: true },
    }).countDocuments();
    return Math.ceil(count / REQUISITIONS_PER_PAGE);
  },

  async countNew() {
    const response = await RequisitionModel.count({ status: "Nova" });
    return response;
  },

  async countAll() {
    const response = await RequisitionModel.count({});
    return response;
  },

  /**
   * Get a Requisitions by sample
   * @returns one Requisitions
   */
  getBySampleID(sampleid) {
    return new Promise((resolve, reject) => {
      RequisitionModel.find({ samples: { $in: sampleid } })
        .then((req) => {
          resolve(req);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getByIdArray(reqidArray) {
    return new Promise((resolve, reject) => {
      RequisitionModel.find({ _id: { $in: reqidArray } })
        .then((req) => {
          resolve(req);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  /**
   * Get a Requisition by it's id
   * @param {string} id - Requisition Id
   * @returns {Object} Requisition Document Data
   */
  getById(id) {
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
  },

  /**
   * Get a Requisition by it's destination
   * @param {string} destination - Requisition Destination
   * @returns {Object} Requisition Document Data
   */
  getByDestination(destination) {
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
  },

  /**
   * Create a new Requisition
   * @param {Object} project - Requisition Document Data
   * @returns {string} New Requisition Id
   */
  async create(requisition) {
    try {
      let requisitionNumber = await Counter.getRequisitionCount();
      requisition.requisitionNumber = requisitionNumber;
      const result = await RequisitionModel.create(requisition);
      requisitionNumber++;
      Counter.setRequisitionCount(requisitionNumber);
      return result;
    } catch (error) {
      console.warn(error);
      return error;
    }
  },

  async createSpecial(requisition) {
    try {
      requisition.requisitionNumber = 0;
      const result = await RequisitionModel.create(requisition);
      return result;
    } catch (error) {
      console.warn(error);
      return error;
    }
  },

  /**
   * Update a Requisition
   * @param {string} id - Requisition Id
   * @param {Object} Requisition - Requisition Document Data
   */
  update(id, requisition) {
    return new Promise((resolve, reject) => {
      RequisitionModel.findByIdAndUpdate(id, requisition)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  /**
   * Delete a Requisition
   * @param {string} id - Requisition Id
   * @returns {null}
   */
  async delete(id) {
    return await Promise.all([
      RequisitionModel.deleteOne({ _id: id }),
      Sample.SampleModel.deleteMany({ requisitionId: id }),
    ]);
  },

  /**
   * Sum all Requisitions from DB
   * @returns {null}
   */
  count() {
    return new Promise((resolve, reject) => {
      RequisitionModel.countDocuments({})
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  /**
   * Add sample to samples
   * @param {string} id - requisition Id
   * @param {string} sample - Sample Id
   * @returns {null}
   */
  async addSample(id, sample) {
    try {
      await RequisitionModel.findByIdAndUpdate(id, {
        $push: { samples: sample },
      });
    } catch (error) {
      console.warn(error);
      return error;
    }
  },

  async getAndPopulate(query) {
    return await RequisitionModel.find(query).populate("charge.user");
  },

  async getStateData(filters) {
    const extraOperations = [];

    if (filters) {
      const { startDate, endDate, state, type, destination, user } = filters;

      if (startDate || endDate) {
        extraOperations.push({
          $addFields: {
            date: {
              $dateFromString: {
                dateString: "$datereceipt",
                format: "%d/%m/%Y",
              },
            },
          },
        });
      }

      const match = {};

      if (user) match["user"] = mongoose.Types.ObjectId(user);
      if (destination) match["destination"] = destination;
      if (state) match["state"] = state;
      if (type) {
        extraOperations.push({
          $lookup: {
            from: "samples",
            localField: "samples",
            foreignField: "_id",
            as: "samplesObject",
          },
        });

        extraOperations.push({
          $match: {
            samplesObject: {
              $elemMatch: {
                sampletype: {
                  $regex: new RegExp("^" + type.toLowerCase(), "i"),
                },
              },
            },
          },
        });
      }

      if (startDate || endDate) {
        const filter = {};

        if (startDate) filter["$gte"] = new Date(startDate);
        if (endDate) filter["$lte"] = new Date(endDate);

        match["date"] = filter;
      }
      extraOperations.push({ $match: match });
    }

    const result = await RequisitionModel.aggregate([
      { $match: { status: "Aprovada" } },
      ...extraOperations,
      { $project: { state: 1, samples: 1 } },
      {
        $group: {
          _id: "$state",
          samples: { $sum: { $size: "$samples" } },
        },
      },
    ]);
    let total = 0;

    for (let i = 0; i < result.length; i++) total += result[i].samples;

    for (let j = 0; j < result.length; j++)
      result[j].frequency = result[j].samples / total;

    return result;
  },

  async getAnimalData(filters) {
    const extraOperations = [];

    if (filters) {
      const { startDate, endDate, state, type, destination, user } = filters;

      if (startDate || endDate) {
        extraOperations.push({
          $addFields: {
            date: {
              $dateFromString: {
                dateString: "$datereceipt",
                format: "%d/%m/%Y",
              },
            },
          },
        });
      }

      const match = {};

      if (user) match["user"] = mongoose.Types.ObjectId(user);
      if (destination) match["destination"] = destination;
      if (state) match["state"] = state;
      if (type) {
        extraOperations.push({
          $lookup: {
            from: "samples",
            localField: "samples",
            foreignField: "_id",
            as: "samplesObject",
          },
        });

        extraOperations.push({
          $match: {
            samplesObject: {
              $elemMatch: {
                sampletype: {
                  $regex: new RegExp("^" + type.toLowerCase(), "i"),
                },
              },
            },
          },
        });
      }

      if (startDate || endDate) {
        const filter = {};

        if (startDate) filter["$gte"] = new Date(startDate);
        if (endDate) filter["$lte"] = new Date(endDate);

        match["date"] = filter;
      }
      extraOperations.push({ $match: match });
    }

    const result = await RequisitionModel.aggregate([
      { $match: { status: "Aprovada" } },
      ...extraOperations,
      { $project: { destination: 1, samples: 1 } },
      {
        $group: {
          _id: "$destination",
          samples: { $sum: { $size: "$samples" } },
        },
      },
    ]);
    let total = 0;

    for (let i = 0; i < result.length; i++) total += result[i].samples;

    for (let j = 0; j < result.length; j++)
      result[j].frequency = result[j].samples / total;

    return result;
  },
};

module.exports = Requisition;
