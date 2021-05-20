const mongoose = require("mongoose");
const Counter = require("../models/counter");
const Workmap = require("./Workmap");
const SimpleLinearRegression = require("ml-regression-simple-linear");

const data = new Date();
const yyyy = data.getFullYear();

const reportSchema = new mongoose.Schema(
  {
    // Laudo disponível
    isAvailable: { type: Boolean, default: false },

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

    absorbance: Number,
    absorbance2: Number,

    resultNumber: Number,
    resultText: String,
    resultChart: Number,

    wasDetected: Boolean,

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
    samplenumber: Number,
    
    requisitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Requisition",
    },
    
    sampletype: String,
    
    //Quantidade recebida
    receivedquantity: Number,
    
    //Tipo de embalagem
    packingtype: String,
    
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
  { timestamps: true, strict: false }
);

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
      .populate(
        "aflatoxina.kitId deoxinivalenol.kitId fumonisina.kitId ocratoxina.kitId t2toxina.kitId zearalenona.kitId"
      )
      .populate({
        path: "requisitionId",
      });
    return result;
  },

  getMaxSampleNumber() {
    return new Promise((resolve, reject) => {
      SampleModel.find({}, { samplenumber: 1, _id: 0 })
        .sort({ samplenumber: -1 })
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

  async updateCustom(id, params) {
    const response = await SampleModel.findByIdAndUpdate(id, { $set: params });
    return response;
  },

  updateBySampleNumber(samplenumber, sample) {
    return new Promise((resolve, reject) => {
      SampleModel.findOneAndUpdate({ samplenumber: samplenumber }, sample)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  deleteMany(id_array) {
    return new Promise((resolve, reject) => {
      SampleModel.find({ _id: { $in: id_array } })
        .then((samples) => {
          let samplesToRemove = {};

          for (let j = 0; j < samples.length; j++) {
            const sample = samples[j];

            //Find samples in workmaps
            for (let i = 0; i < ToxinasFull.length; i++) {
              const toxina = ToxinasFull[i];
              if (sample[toxina].status === "Mapa de Trabalho") {
                let workmapIdStr = sample[toxina].workmapId.toString();

                //Initialize
                if (samplesToRemove[workmapIdStr] == undefined)
                  samplesToRemove[workmapIdStr] = [];

                samplesToRemove[workmapIdStr].push(sample._id);
              }
            }
          }

          //Atualizar os workmaps
          let workmapsId = Object.keys(samplesToRemove);
          for (let i = 0; i < workmapsId.length; i++)
            Workmap.removeSamples(
              workmapsId[i],
              samplesToRemove[workmapsId[i]]
            );
        })
        .then(() => {
          SampleModel.deleteMany({ _id: { $in: id_array } })
            .then((obj) => resolve(obj))
            .catch((err) => {
              reject(err);
            });
        });
    });
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

  async updateReportSpecific(id, fieldsToUpdate) {
    const result = await SampleModel.updateOne(
      { _id: id },
      { $set: fieldsToUpdate }
    );
    return result;
  },

  async updateAbsorbancesAndFinalize(
    id,
    toxinaFull,
    abs,
    abs2,
    calibrators,
    kitId
  ) {
    let updateVal = {
      [`${toxinaFull}.absorbance`]: abs,
      [`${toxinaFull}.absorbance2`]: abs2,
      [`${toxinaFull}.result`]: this.calcularResult(abs, abs2, calibrators),
      [`${toxinaFull}.active`]: false,
      [`${toxinaFull}.kitId`]: kitId,
      [`report`]: true,
    };

    const result = await SampleModel.updateOne(
      { _id: id },
      { $set: updateVal }
    );
    return result;
  },

  calcularResult(abs, abs2, calibrators) {
    let p_concentration = [];
    let p_absorvance = [];

    function compara(logb_bo_amostra, intercept, slope) {
      return Math.pow(10, (logb_bo_amostra - intercept) / slope);
    }

    for (let i = 0; i < 5; i++) {
      let currentCalibrator = "P" + (i + 1);
      p_concentration[i] = calibrators[currentCalibrator].concentration;
      p_absorvance[i] = calibrators[currentCalibrator].absorbance;
    }

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
      abs / p_absorvance[0] / (1 - abs / p_absorvance[0])
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

  finalizeSample(id, toxina, kit_id) {
    return new Promise((resolve, reject) => {
      let parameter = toxina + ".active";
      let parameter2 = toxina + ".kitId";
      let parameter3 = "report";
      let updateVal = {};

      updateVal[parameter] = false;
      updateVal[parameter2] = kit_id;
      updateVal[parameter3] = true;

      SampleModel.update({ _id: id }, { $set: updateVal })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
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

  async getAllActiveWithWorkmap() {
    let query = { $or: [], isSpecial: { $ne: true } };

    ToxinasFull.forEach((toxina) => {
      let expression = {};

      expression[toxina + ".status"] = { $eq: "Mapa de Trabalho" };
      expression[toxina + ".active"] = true;

      query.$or.push(expression);
    });

    let build = SampleModel.find(query);

    ToxinasFull.forEach((toxina) => {
      build = build.populate(`${toxina}.workmapId`);
    });

    const result = await build.exec();
    console.log(
      "🚀 ~ file: sample.js ~ line 683 ~ Sample ~ getAllActiveWithWorkmap ~ result",
      result
    );

    return result;
  },

  getAllActive() {
    return new Promise((resolve, reject) => {
      let query = { $or: [], isSpecial: { $ne: true } };

      ToxinasFull.forEach((toxina) => {
        let expression = {};

        expression[toxina + ".active"] = true;

        query.$or.push(expression);
      });

      SampleModel.find(query)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  async getAllSpecialActive() {
    let query = { isSpecial: true, $or: [] };
    ToxinasFull.forEach((toxina) => {
      let expression = {};

      expression[toxina + ".active"] = true;

      query.$or.push(expression);
    });

    const sample = await SampleModel.find(query);

    return sample;
  },

  async getAllSpecialFinalized() {
    let query = { isSpecial: true, specialFinalized: true };
    const sample = await SampleModel.find(query);

    return sample;
  },

  async getSpecialFinalized(page = 1) {
    let query = { isSpecial: true, specialFinalized: true };
    const sample = await SampleModel.find(query)
      .skip((page - 1) * REPORTS_PER_PAGE)
      .limit(REPORTS_PER_PAGE)
      .sort({ createdAt: -1 });

    return sample;
  },

  async getSpecialCountPages() {
    let query = { isSpecial: true, specialFinalized: true };
    const sample = await SampleModel.find(query).countDocuments();

    return Math.ceil(sample / REPORTS_PER_PAGE);
  },

  getAllActiveWithUser() {
    return new Promise((resolve, reject) => {
      let query = { $or: [], isSpecial: { $ne: true } };

      for (let index = 0; index < ToxinasFull.length; index++) {
        const toxina = ToxinasFull[index];
        let expression = {};

        expression[toxina + ".active"] = true;

        query.$or.push(expression);
      }

      SampleModel.aggregate([
        { $match: query },
        {
          $group: {
            _id: "$requisitionId",
            samples: { $push: "$$ROOT" },
          },
        },
        {
          $lookup: {
            from: "requisitions",
            localField: "_id",
            foreignField: "_id",
            as: "requisition",
          },
        },
        {
          $project: {
            _id: 1,
            samples: 1,
            userId: { $arrayElemAt: ["$requisition.user", 0] },
          },
        },
        {
          $group: {
            _id: "$userId",
            samples: { $push: "$samples" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $project: {
            _id: 1,
            samples: 1,
            debt: { $arrayElemAt: ["$user.debt", 0] },
          },
        },
        {
          $sort: {
            samplenumber: 1,
          },
        },
      ])
        .then((result) => {
          function flat(input, depth = 1, stack = []) {
            for (let item of input) {
              if (item instanceof Array && depth > 0) {
                flat(item, depth - 1, stack);
              } else {
                stack.push(item);
              }
            }

            return stack;
          }

          for (let i = 0; i < result.length; i++) {
            result[i].samples = flat(result[i].samples);
          }

          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  async getAllReport() {
    let query = { "report.isAvailable": true, isSpecial: { $ne: true } };
    const result = await SampleModel.find(query).populate({
      path: "requisitionId",
      select: "requisitionnumber user createdAt _id",
    });
    return result;
  },

  async getRegular(page = 1) {
    let query = { "report.isAvailable": true, isSpecial: { $ne: true } };
    const result = await SampleModel.find(query)
      .populate({
        path: "requisitionId",
        select: "requisitionnumber user createdAt _id",
      })
      .skip((page - 1) * REPORTS_PER_PAGE)
      .limit(REPORTS_PER_PAGE)
      .sort({ createdAt: -1 });
    return result;
  },

  async getRegularCountPages() {
    let query = { "report.isAvailable": true, isSpecial: { $ne: true } };
    const result = await SampleModel.find(query).countDocuments();
    return Math.ceil(result / REPORTS_PER_PAGE);
  },

  async getRelatedEmails(id) {
    const result = await SampleModel.findById(
      id,
      "requisitionId samplenumber createdAt"
    ).populate({
      path: "requisitionId",
      select: "user _id",
      populate: { path: "user", select: "email fullname _id" },
    });

    return result;
  },

  async create(sample) {
    try {
      let samplenumber = await Counter.getSampleCount();
      sample.samplenumber = samplenumber;
      const result = await SampleModel.create(sample);
      samplenumber++;
      await Counter.setSampleCount(samplenumber);
      return result;
    } catch (error) {
      console.warn(error);
      return error;
    }
  },

  async createMany(samples) {
    let manySamples = [];
    try {
      let samplenumber = await Counter.getSampleCount();
      samples.forEach((sample) => {
        sample.samplenumber = samplenumber;
        manySamples.push(sample);
        samplenumber++;
      });
      const result = await SampleModel.create(manySamples);
      await Counter.setSampleCount(samplenumber);
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

  updateAflaWorkmap(id, cont) {
    return new Promise((resolve, reject) => {
      SampleModel.update({ _id: id }, { $set: { "aflatoxina.contador": cont } })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  updateOcraWorkmap(id, cont) {
    return new Promise((resolve, reject) => {
      SampleModel.update({ _id: id }, { $set: { "ocratoxina.contador": cont } })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
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
                dateString: "$requisitionData.datereceipt",
                format: "%d/%m/%Y",
              },
            },
          },
        });
      }

      const match = {};

      if (user) match["requisitionData.user"] = mongoose.Types.ObjectId(user);
      if (destination) match["requisitionData.destination"] = destination;
      if (state) match["requisitionData.state"] = state;
      if (type)
        match["sampletype"] = {
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
      { $match: { finalized: "Disponivel" } },
      ...extraOperations,
      { $project: { sampletype: 1 } },
      {
        $group: {
          _id: "$sampletype",
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
                dateString: "$requisitionData.datereceipt",
                format: "%d/%m/%Y",
              },
            },
          },
        });
      }

      const match = {};

      if (user) match["requisitionData.user"] = mongoose.Types.ObjectId(user);
      if (destination) match["requisitionData.destination"] = destination;
      if (state) match["requisitionData.state"] = state;
      if (type)
        match["sampletype"] = {
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
      { $match: { finalized: "Disponivel", "report.isAvailable": true } },
      ...extraOperations,
      {
        $project: {
          aflatoxina: 1,
          deoxinivalenol: 1,
          fumonisina: 1,
          ocratoxina: 1,
          t2toxina: 1,
          zearalenona: 1,
        },
      },
    ]);

    let allToxin = {};
    for (let i = 0; i < ToxinasFull.length; i++) {
      let oneToxinArray = [];
      let currentToxin = ToxinasFull[i];
      for (let j = 0; j < result.length; j++) {
        let sample = result[j];
        if (sample[currentToxin].checked && sample[currentToxin].result) {
          oneToxinArray.push(sample[currentToxin].checked);
        } else if (sample[currentToxin].result) {
          oneToxinArray.push(false);
        }
      }
      allToxin[currentToxin] = oneToxinArray;
    }
    let counterVector = [];
    for (let i = 0; i < ToxinasFull.length; i++) {
      let currentToxin = ToxinasFull[i];
      let oneToxin = allToxin[currentToxin];
      let totalNumber = oneToxin.length;
      let trueCounter = 0;
      for (let j = 0; j < oneToxin.length; j++) {
        if (oneToxin[j]) {
          trueCounter++;
        }
      }
      let falseCounter = totalNumber - trueCounter;
      counterVector.push({
        name: currentToxin,
        totalNumber,
        trueCounter,
        falseCounter,
      });
    }
    return counterVector;
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
                dateString: "$requisitionData.datereceipt",
                format: "%d/%m/%Y",
              },
            },
          },
        });
      }

      const match = {};

      if (user) match["requisitionData.user"] = mongoose.Types.ObjectId(user);
      if (destination) match["requisitionData.destination"] = destination;
      if (state) match["requisitionData.state"] = state;
      if (type)
        match["sampletype"] = {
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
      { $match: { finalized: "Disponivel", "report.isAvailable": true } },
      ...extraOperations,
      {
        $project: {
          aflatoxina: 1,
          deoxinivalenol: 1,
          fumonisina: 1,
          ocratoxina: 1,
          t2toxina: 1,
          zearalenona: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: 1 } },
    ]);

    return result;
  },

  async getStatisticTableData() {
    const result = await SampleModel.aggregate([
      { $match: { finalized: "Disponivel", "report.isAvailable": true } },
      {
        $project: {
          "aflatoxina.checked": 1,
          "aflatoxina.resultChart": 1,
          "deoxinivalenol.checked": 1,
          "deoxinivalenol.resultChart": 1,
          "fumonisina.checked": 1,
          "fumonisina.resultChart": 1,
          "ocratoxina.checked": 1,
          "ocratoxina.resultChart": 1,
          "t2toxina.checked": 1,
          "t2toxina.resultChart": 1,
          "zearalenona.checked": 1,
          "zearalenona.resultChart": 1,
        },
      },
      { $sort: { createdAt: 1 } },
    ]);
    return result;
  },
};

module.exports = Sample;
