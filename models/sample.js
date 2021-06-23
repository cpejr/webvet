const mongoose = require("mongoose");
const Counter = require("../models/counter");
const SimpleLinearRegression = require("ml-regression-simple-linear");

const data = new Date();
const yyyy = data.getFullYear();

const reportSchema = new mongoose.Schema(
  {
    // Laudo disponível
    status: {
      type: String,
      enum: [
        "Disponível para o produtor",
        "Revisada por Analista",
        "Não finalizado",
      ],
      default: "Não finalizado",
    },

    // Parecer no laudo
    feedback: { type: String },

    // Comentario no laudo
    comment: { type: String },
  },
  { timestamps: false, versionKey: false }
);

const analysisSchema = new mongoose.Schema(
  {
    toxinId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Toxin",
    },

    status: {
      type: String,
      enum: [
        "Nova",
        "Em análise",
        "Aguardando pagamento",
        "Aguardando amostra",
        "Mapa de Trabalho",
        "Finalizado",
      ],
      default: "Nova",
    },

    absorbance1: Number,
    absorbance2: Number,

    resultNumber: String, // Gerado na finalizacao
    resultText: String, // Gerado no laudo
    resultChart: Number, // Gerado no laudo

    finalizationNumber: Number, // Gerado na finalizacao

    wasDetected: Boolean, // Gerado no laudo

    workmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workmap",
    },

    kitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kit",
    },
  },
  { timestamps: false, versionKey: false }
);

const sampleSchema = new mongoose.Schema(
  {
    // Identificador
    name: String,
    //Contém Polpa cítrica
    isCitrus: {
      type: Boolean,
      default: false,
    },
    creationYear: {
      type: Number,
      default: yyyy,
    },
    sampleNumber: Number,

    requisitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Requisition",
    },

    sampleType: String,

    //Quantidade recebida
    receivedQuantity: Number,

    //Tipo de embalagem
    packingType: String,

    //Aprovado pelo ADM
    approved: {
      //A aprovacao da requisicao associada
      type: Boolean,
      default: false,
    },

    report: reportSchema,

    analysis: [analysisSchema],

    // Texto para colocar data limite
    limitDate: {
      type: String,
    },

    //Marca a amostra como criada pelo painel especial.
    isSpecial: {
      type: Boolean,
      default: false,
    },

    //Marca a amostra como finalizada pelo painel especial.
    specialFinalized: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: false,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true },
  }
);

sampleSchema.virtual("analysis.toxin", {
  ref: "Toxin", // The model to use
  localField: "analysis.toxinId", // Find people where `localField`
  foreignField: "_id", // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true,
});

sampleSchema.virtual("analysis.kit", {
  ref: "Kit", // The model to use
  localField: "analysis.workmapId", // Find people where `localField`
  foreignField: "workmaps._id", // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true,
});

sampleSchema.virtual("requisition", {
  ref: "Requisition", // The model to use
  localField: "requisitionId", // Find people where `localField`
  foreignField: "_id", // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true,
});

const SampleModel = mongoose.model("Sample", sampleSchema);

const Sample = {
  /**
   * Get a Sample by it's id
   * @param {string} id - Sample Id
   * @returns {Object} Sample Document Data
   */
  async getById(id) {
    const result = await SampleModel.findOne({ _id: id });
    return result;
  },

  async count() {
    return await SampleModel.countDocuments();
  },

  async getByIdAndPopulate(id) {
    const result = await SampleModel.findById(id)
      .populate("analysis.toxin")
      .populate("analysis.kit")
      .populate({
        path: "requisition",
        populate: {
          path: "selectedToxins charge.user",
        },
      });
    return result;
  },

  getAndPopulate(query) {
    return SampleModel.find(query)
      .populate("analysis.toxin")
      .populate("analysis.kit")
      .populate({
        path: "requisition",
        populate: {
          path: "selectedToxins charge.user",
        },
      });
  },

  getMaxsampleNumber() {
    return new Promise((resolve, reject) => {
      SampleModel.find({}, { sampleNumber: 1, _id: 0 })
        .sort({ sampleNumber: -1 })
        .limit(1)
        .populate("sample")
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  update(id, sample) {
    return new Promise((resolve, reject) => {
      SampleModel.findByIdAndUpdate(id, sample)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getByFields(fields) {
    return SampleModel.find(fields);
  },

  async updateCustom(id, params) {
    const response = await SampleModel.findByIdAndUpdate(id, { $set: params });
    return response;
  },

  updateBysampleNumber(sampleNumber, sample) {
    return new Promise((resolve, reject) => {
      SampleModel.findOneAndUpdate({ sampleNumber: sampleNumber }, sample)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  async removeAnalysis(samplesIds, toxinsIds) {
    return SampleModel.update(
      { _id: { $in: samplesIds } },
      {
        $pull: {
          analysis: {
            toxinId: { $in: toxinsIds },
          },
        },
      },
      { multi: true }
    );
  },

  async addAnalysis(samplesIds, toxinsIds) {
    const objs = toxinsIds.map((id) => ({ toxinId: id, status: "nova" }));

    return SampleModel.update(
      { _id: { $in: samplesIds } },
      {
        $push: {
          analysis: {
            $each: objs,
          },
        },
      },
      { multi: true }
    );
  },

  updateReport(id, report) {
    return new Promise((resolve, reject) => {
      SampleModel.update({ _id: id }, { $set: { report: report } })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  async finalize(
    sampleId,
    analysisId,
    abs1,
    abs2,
    calibrators,
    finalizationNumber
  ) {
    const result = await SampleModel.updateOne(
      { _id: sampleId, "analysis._id": analysisId },
      {
        $set: {
          "report.status": "Não finalizado",
          "analysis.$.absorbance1": abs1,
          "analysis.$.absorbance2": abs2,
          "analysis.$.resultNumber": this.calcularResult(
            abs1,
            abs2,
            calibrators
          ),
          "analysis.$.status": "Finalizado",
          "analysis.$.finalizationNumber": finalizationNumber,
        },
      }
    );
    return result;
  },

  calcularResult(abs1, abs2, calibrators) {
    let p_concentration = [];
    let p_absorvance = [];

    function compara(logb_bo_amostra, intercept, slope) {
      return Math.pow(10, (logb_bo_amostra - intercept) / slope);
    }

    calibrators.forEach((calibrator, i) => {
      p_concentration[i] = calibrator.concentration;
      p_absorvance[i] = calibrator.absorbance;
    });

    let log_concentracao = []; //Eixo x

    //Calcular log das concentracoes dos P's de 1 a 4
    for (let i = 1; i < 5; i++) {
      log_concentracao.push(Math.log10(p_concentration[i]));
    }

    let b_b0 = [];
    let ln_b_b0 = [];

    for (let m = 0; m < 4; m++) {
      b_b0[m] = p_absorvance[m + 1] / p_absorvance[0];
      ln_b_b0[m] = Math.log10(b_b0[m] / (1 - b_b0[m]));
    }

    const result = new SimpleLinearRegression(log_concentracao, ln_b_b0);
    const { slope, intercept } = result;

    let log_b_b0 = Math.log10(
      abs1 / p_absorvance[0] / (1 - abs1 / p_absorvance[0])
    );
    let log_b_b0_2 = Math.log10(
      abs2 / p_absorvance[0] / (1 - abs2 / p_absorvance[0])
    );

    const finalResult =
      (compara(log_b_b0, intercept, slope) +
        compara(log_b_b0_2, intercept, slope)) /
      2;

    return finalResult;
  },

  getByIdArray(id_array) {
    return new Promise((resolve, reject) => {
      SampleModel.find({ _id: { $in: id_array } })
        .then((map) => {
          resolve(map);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  async getFinalizedByIdArrayWithUser(id_array) {
    return await SampleModel.find({
      _id: { $in: id_array },
      finalized: "Disponivel",
    }).populate({
      path: "requisitionId",
      select: "user",
      populate: {
        path: "user",
        select: "fullname",
      },
    });
  },

  getByIdArrayWithQuery(id_array, query) {
    query["_id"] = { $in: id_array };
    return new Promise((resolve, reject) => {
      SampleModel.find(query)
        .then((map) => {
          resolve(map);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getActiveByIdArray(id_array, toxinafull) {
    return new Promise((resolve, reject) => {
      let query = { _id: { $in: id_array }, isSpecial: { $ne: true } };
      query[toxinafull + ".active"] = true;

      SampleModel.find(query)
        .then((map) => {
          resolve(map);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  async updateResult(id, toxina_full, result) {
    return new Promise((resolve, reject) => {
      let parameter = toxina_full + ".result";

      let updateVal = {};

      updateVal[parameter] = result;

      SampleModel.update({ _id: id }, { $set: updateVal })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  async getAllSpecialActive() {
    let query = {
      isSpecial: true,
      specialFinalized: { $ne: true },
      "analysis.wasDetected": null,
    };
    const sample = await SampleModel
      .find(query)
      .populate("analysis.toxin");
    return sample;
  },

  async getAllSpecialFinalized() {
    let query = { isSpecial: true, specialFinalized: true };
    const sample = await SampleModel.find(query);

    return sample;
  },

  // Samples com a toxina para analise x
  // Sem Workmap
  // Sem ser especiais
  // Agrupar por toxina
  async getAllWithoutFinalization() {
    return await SampleModel.aggregate([
      {
        $match: {
          "analysis.wasDetected": null,
        },
      },
      {
        $lookup: {
          from: "requisitions",
          localField: "requisitionId",
          foreignField: "_id",
          as: "requisition",
        },
      },
      {
        $unwind: {
          path: "$requisition",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "requisition.charge.user",
          foreignField: "_id",
          as: "requisition.charge.user",
        },
      },
      {
        $unwind: {
          path: "$requisition.charge.user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$analysis",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$analysis.toxinId",
          samples: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $lookup: {
          from: "toxins",
          localField: "_id",
          foreignField: "_id",
          as: "toxin",
        },
      },
      {
        $unwind: {
          path: "$toxin",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
  },

  async getAllReport() {
    let query = { "report.isAvailable": true, isSpecial: { $ne: true } };
    const result = await SampleModel.find(query).populate({
      path: "requisitionId",
      select: "requisitionNumber user createdAt _id",
    });
    return result;
  },

  async getRegularFinalized(page = 1) {
    let query = { "analysis.status": "Finalizado", isSpecial: { $ne: true } };
    const result = await SampleModel.find(query)
      .populate("requisition")
      .skip((page - 1) * REPORTS_PER_PAGE)
      .limit(REPORTS_PER_PAGE)
      .sort({ createdAt: -1 });
    return result;
  },

  async getRegularCountPages() {
    let query = { "analysis.status": "Finalizado", isSpecial: { $ne: true } };
    const result = await SampleModel.find(query).countDocuments();
    return Math.ceil(result / REPORTS_PER_PAGE);
  },

  async getSpecialFinalized(page = 1) {
    let query = { "analysis.status": "Finalizado", isSpecial: true };
    const sample = await SampleModel.find(query)
      .skip((page - 1) * REPORTS_PER_PAGE)
      .limit(REPORTS_PER_PAGE)
      .sort({ createdAt: -1 });

    return sample;
  },

  async getSpecialCountPages() {
    let query = { "analysis.status": "Finalizado", isSpecial: true };
    const sample = await SampleModel.find(query).countDocuments();

    return Math.ceil(sample / REPORTS_PER_PAGE);
  },

  async create(sample) {
    try {
      let sampleNumber = await Counter.getSampleCount();
      sample.sampleNumber = sampleNumber;
      const result = await SampleModel.create(sample);
      sampleNumber++;
      await Counter.setSampleCount(sampleNumber);
      return result;
    } catch (error) {
      console.warn(error);
      return error;
    }
  },

  async createMany(samples) {
    let manySamples = [];
    try {
      let sampleNumber = await Counter.getSampleCount();
      samples.forEach((sample) => {
        sample.sampleNumber = sampleNumber;
        manySamples.push(sample);
        sampleNumber++;
      });
      const result = await SampleModel.create(manySamples);
      await Counter.setSampleCount(sampleNumber);
      return result;
    } catch (error) {
      console.warn(error);
      return error;
    }
  },

  async createManySpecial(specialSamples) {
    try {
      const result = await SampleModel.create(specialSamples);
      return result;
    } catch (error) {
      console.warn(error);
      return error;
    }
  },

  async getSampleData(filters) {
    const extraOperations = [];

    if (filters) {
      const { startDate, endDate, state, type, destination, user } = filters;
      extraOperations.push({
        $lookup: {
          from: "requisitions",
          localField: "requisitionId",
          foreignField: "_id",
          as: "requisitionData",
        },
      });

      extraOperations.push({ $unwind: "$requisitionData" });

      if (startDate || endDate) {
        extraOperations.push({
          $addFields: {
            date: {
              $dateFromString: {
                dateString: "$requisitionData.analysis.receiptDate",
                format: "%Y-%m-%d",
              },
            },
          },
        });
      }

      const match = {};

      if (user)
        match["requisitionData.charge.user"] = mongoose.Types.ObjectId(user);
      if (destination)
        match["requisitionData.analysis.destination"] = destination;
      if (state) match["requisitionData.analysis.state"] = state;
      if (type)
        match["sampleType"] = {
          $regex: new RegExp("^" + type.toLowerCase(), "i"),
        };
      if (startDate || endDate) {
        const filter = {};

        if (startDate) filter["$gte"] = new Date(startDate);
        if (endDate) filter["$lte"] = new Date(endDate);

        match["date"] = filter;
      }
      extraOperations.push({ $match: match });
    }

    let result = await SampleModel.aggregate([
      { $match: { "report.status": "Disponível para o produtor" } },
      ...extraOperations,
      { $project: { sampleType: 1 } },
      {
        $group: {
          _id: "$sampleType",
          samples: { $push: "$_id" },
        },
      },
    ]);
    let total = 0;

    for (let i = 0; i < result.length; i++) total += result[i].samples.length;

    for (let j = 0; j < result.length; j++)
      result[j].frequency = result[j].samples.length / total;

    return result;
  },

  async getFinalizationData(filters) {
    //Desafio: descobrir como fazer isso aqui só com requisição do mongo.
    const extraOperations = [];

    if (filters) {
      const { startDate, endDate, state, type, destination, user } = filters;

      extraOperations.push({
        $lookup: {
          from: "requisitions",
          localField: "requisitionId",
          foreignField: "_id",
          as: "requisitionData",
        },
      });

      extraOperations.push({ $unwind: "$requisitionData" });

      if (startDate || endDate) {
        extraOperations.push({
          $addFields: {
            date: {
              $dateFromString: {
                dateString: "$requisitionData.analysis.receiptDate",
                format: "%Y-%m-%d",
              },
            },
          },
        });
      }

      const match = {};

      if (user)
        match["requisitionData.charge.user"] = mongoose.Types.ObjectId(user);
      if (destination)
        match["requisitionData.analysis.destination"] = destination;
      if (state) match["requisitionData.analysis.state"] = state;
      if (type)
        match["sampleType"] = {
          $regex: new RegExp("^" + type.toLowerCase(), "i"),
        };
      if (startDate || endDate) {
        const filter = {};

        if (startDate) filter["$gte"] = new Date(startDate);
        if (endDate) filter["$lte"] = new Date(endDate);

        match["date"] = filter;
      }
      extraOperations.push({ $match: match });
    }

    const result = await SampleModel.aggregate([
      { $match: { "report.status": "Disponível para o produtor" } },
      ...extraOperations,
      {
        $project: {
          analysis: 1,
        },
      },
    ]);

    let chartData = {};

    Toxins.forEach((toxin) => {
      chartData[toxin._id] = {
        name: toxin.name,
        totalNumber: 0,
        trueCounter: 0,
        falseCounter: 0,
      };
    });

    result.forEach((sample) => {
      sample.analysis.forEach((analysis) => {
        const { wasDetected, toxinId } = analysis;
        chartData[toxinId].totalNumber++;

        if (wasDetected) chartData[toxinId].trueCounter++;
        else chartData[toxinId].falseCounter++;
      });
    });

    const finalVector = Object.keys(chartData).map((_id) => chartData[_id]);

    return finalVector;
  },

  async getResultData(filters) {
    const extraOperations = [];

    if (filters) {
      const { startDate, endDate, state, type, destination, user } = filters;
      extraOperations.push({
        $lookup: {
          from: "requisitions",
          localField: "requisitionId",
          foreignField: "_id",
          as: "requisitionData",
        },
      });

      extraOperations.push({ $unwind: "$requisitionData" });

      if (startDate || endDate) {
        extraOperations.push({
          $addFields: {
            date: {
              $dateFromString: {
                dateString: "$requisitionData.analysis.receiptDate",
                format: "%Y-%m-%d",
              },
            },
          },
        });
      }

      const match = {};

      if (user)
        match["requisitionData.charge.user"] = mongoose.Types.ObjectId(user);
      if (destination)
        match["requisitionData.analysis.destination"] = destination;
      if (state) match["requisitionData.analysis.state"] = state;
      if (type)
        match["sampleType"] = {
          $regex: new RegExp("^" + type.toLowerCase(), "i"),
        };
      if (startDate || endDate) {
        const filter = {};

        if (startDate) filter["$gte"] = new Date(startDate);
        if (endDate) filter["$lte"] = new Date(endDate);

        match["date"] = filter;
      }
      extraOperations.push({ $match: match });
    }

    const result = await SampleModel.aggregate([
      { $match: { "report.status": "Disponível para o produtor" } },
      ...extraOperations,
      { $unwind: "$analysis" },
      {
        $group: {
          _id: "$analysis.toxinId",
          analysis: { $push: "$analysis" },
        },
      },
      {
        $lookup: {
          from: "toxins",
          localField: "_id",
          foreignField: "_id",
          as: "toxin",
        },
      },
      { $unwind: "$toxin" },
      { $sort: { createdAt: 1 } },
    ]);

    return result;
  },

  async getStatisticTableData() {
    const result = await SampleModel.aggregate([
      {
        $match: {
          "report.status": "Disponível para o produtor",
        },
      },
      {
        $project: {
          analysis: 1,
        },
      },
      { $sort: { createdAt: 1 } },
    ]);
    return result;
  },
  SampleModel,
};

module.exports = Sample;
