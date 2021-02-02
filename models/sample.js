const mongoose = require("mongoose");
const Counter = require("../models/counter");
const Workmap = require("./Workmap");
const SimpleLinearRegression = require("ml-regression-simple-linear");

var data = new Date();
var yyyy = data.getFullYear();

const sampleSchema = new mongoose.Schema(
  {
    samplenumber: Number,
    name: String,
    sampletype: String,
    receivedquantity: Number, //Quantidade recebida
    packingtype: String, //Tipo de embalagem
    approved: {
      //A aprovacao da requisicao associada
      type: Boolean,
      default: false,
    },
    report: {
      type: Boolean, //1 for available, 0 for not available
      default: 0,
    },
    requisitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Requisition",
    },
    responsible: String,
    creationYear: {
      type: Number,
      default: yyyy,
    },
    comment: String,
    aflatoxina: {
      status: {
        type: String,
        enum: [
          "Nova",
          "Sem amostra",
          "Em análise",
          "A corrigir",
          "Aguardando pagamento",
          "Aguardando amostra",
          " Mapa de Trabalho",
        ],
        default: "Nova",
      },
      date: String,
      absorbance: Number,
      absorbance2: Number,
      result: String,
      resultText: String,
      resultChart: Number,
      active: {
        type: Boolean,
        default: false,
      },
      contador: Number,
      mapReference: {
        type: String,
        default: "Sem mapa",
      },
      concentration: String,
      kitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kit",
      },
      workmapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workmap",
      },
      checked: {
        type: Boolean,
        default: false,
      },
    },
    deoxinivalenol: {
      status: {
        type: String,
        enum: [
          "Nova",
          "Sem amostra",
          "Em análise",
          "A corrigir",
          "Aguardando pagamento",
          "Aguardando amostra",
          " Mapa de Trabalho",
        ],
        default: "Nova",
      },
      date: String,
      absorbance: Number,
      absorbance2: Number,
      result: String,
      resultText: String,
      resultChart: Number,
      active: {
        type: Boolean,
        default: false,
      },
      contador: Number,
      mapReference: {
        type: String,
        default: "Sem mapa",
      },
      workmapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workmap",
      },
      concentration: String,
      kitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kit",
      },
      checked: {
        type: Boolean,
        default: false,
      },
    },
    fumonisina: {
      status: {
        type: String,
        enum: [
          "Nova",
          "Sem amostra",
          "Em análise",
          "A corrigir",
          "Aguardando pagamento",
          "Aguardando amostra",
          " Mapa de Trabalho",
        ],
        default: "Nova",
      },
      date: String,
      absorbance: Number,
      absorbance2: Number,
      result: String,
      resultText: String,
      resultChart: Number,
      active: {
        type: Boolean,
        default: false,
      },
      contador: Number,
      mapReference: {
        type: String,
        default: "Sem mapa",
      },
      concentration: String,
      kitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kit",
      },
      workmapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kit",
      },
      checked: {
        type: Boolean,
        default: false,
      },
    },
    ocratoxina: {
      status: {
        type: String,
        enum: [
          "Nova",
          "Sem amostra",
          "Em análise",
          "A corrigir",
          "Aguardando pagamento",
          "Aguardando amostra",
          " Mapa de Trabalho",
        ],
        default: "Nova",
      },
      date: String,
      absorbance: Number,
      absorbance2: Number,
      result: String,
      resultText: String,
      resultChart: Number,
      active: {
        type: Boolean,
        default: false,
      },
      contador: Number,
      mapReference: {
        type: String,
        default: "Sem mapa",
      },
      workmapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workmap",
      },
      concentration: String,
      kitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kit",
      },
      checked: {
        type: Boolean,
        default: false,
      },
    },
    t2toxina: {
      status: {
        type: String,
        enum: [
          "Nova",
          "Sem amostra",
          "Em análise",
          "A corrigir",
          "Aguardando pagamento",
          "Aguardando amostra",
          " Mapa de Trabalho",
        ],
        default: "Nova",
      },
      date: String,
      absorbance: Number,
      absorbance2: Number,
      result: String,
      resultText: String,
      resultChart: Number,
      active: {
        type: Boolean,
        default: false,
      },
      contador: Number,
      mapReference: {
        type: String,
        default: "Sem mapa",
      },
      concentration: String,
      kitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kit",
      },
      workmapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workmap",
      },
      checked: {
        type: Boolean,
        default: false,
      },
    },
    zearalenona: {
      status: {
        type: String,
        enum: [
          "Nova",
          "Sem amostra",
          "Em análise",
          "A corrigir",
          "Aguardando pagamento",
          "Aguardando amostra",
          " Mapa de Trabalho",
        ],
        default: "Nova",
      },
      date: String,
      absorbance: Number,
      absorbance2: Number,
      result: String,
      resultText: String,
      resultChart: Number,
      active: {
        type: Boolean,
        default: false,
      },
      contador: Number,
      mapReference: {
        type: String,
        default: "Sem mapa",
      },
      concentration: String,
      kitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kit",
      },
      workmapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workmap",
      },
      checked: {
        type: Boolean,
        default: false,
      },
    },
    parecer: String,
    finalized: {
      //Disponivel para o produtor ou nao.
      type: String,
      enum: ["Não finalizada", "Analisada", "Disponivel"],
      default: "Não finalizada",
    },
    isCitrus: {
      type: Boolean,
      default: false,
    },
    isSpecial: { 
      type: Boolean,
      default: false,
    }, //Marca a amostra como criada pelo painel especial.
    specialFinalized: {
      type: Boolean,
      default: false,
    }, //Marca a amostra como finalizada pelo painel especial.
    specialNumber: {
      type: String
    } //Ano da amostra especial, so aparece se for finalizada pelo painel especial.
  },
  { timestamps: true, strict: false }
);

const SampleModel = mongoose.model("Sample", sampleSchema);

class Sample {
  /**
   * Get a Sample by it's id
   * @param {string} id - Sample Id
   * @returns {Object} Sample Document Data
   */
  static async getById(id) {
    const result = await SampleModel.findOne({ _id: id });
    return result;
  }

  static async getByIdAndPopulate(id) {
    const result = await SampleModel.findById(id)
      .populate(
        "aflatoxina.kitId deoxinivalenol.kitId fumonisina.kitId ocratoxina.kitId t2toxina.kitId zearalenona.kitId"
      )
      .populate({
        path: "requisitionId",
      });
    return result;
  }

  /**
   * Get a Sample by it's numsample
   * @param {string} destination - Sample's Number
   * @returns {Object} Sample Document Data
   */
  static getBySampleNumber(samplenumber) {
    return new Promise((resolve, reject) => {
      SampleModel.findOne({ samplenumber: samplenumber })
        .populate("sample")
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
   * Get a Sample by it's requisition id
   * @param {string} requisition id - Sample's Requisition Id
   * @returns {Object} Sample Document Data
   */
  static getByIdRequisition(idrequisition) {
    return new Promise((resolve, reject) => {
      SampleModel.findById(idrequisition)
        .populate("sample")
        .exec()
        .then((result) => {
          resolve(result.toObject());
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getMaxSampleNumber() {
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
  }

  /**
   * Update a Sample
   * @param {string} id - Sample Id
   * @param {Object} Sample - Sample Document Data
   * @returns {null}
   */
  static update(id, sample) {
    return new Promise((resolve, reject) => {
      SampleModel.findByIdAndUpdate(id, sample)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static updateCustom(id, params) {
    return new Promise((resolve, reject) => {
      SampleModel.updateOne({ _id: id }, { $set: params })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.warn(err);
          reject(err);
        });
    });
  }

  static updateBySampleNumber(samplenumber, sample) {
    return new Promise((resolve, reject) => {
      SampleModel.findOneAndUpdate({ samplenumber: samplenumber }, sample)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  /**
   * Delete a Sample
   * @param {string} id - Sample Id
   * @returns {null}
   */
  /* Função desabilidata por Arthur, ela não faz update nos workmaps
  static delete(id) {
    return new Promise((resolve, reject) => {
      SampleModel.findByIdAndDelete(id).catch((err) => {
        reject(err);
      });
    });
  }*/

  static deleteMany(id_array) {
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
  }

  /**
   * Deletes all Samples from DB
   * @returns {null}
   */
  static clear() {
    return new Promise((resolve, reject) => {
      SampleModel.deleteMany({})
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Sum all Samples from DB
   * @returns {null}
   */
  static count() {
    return new Promise((resolve, reject) => {
      SampleModel.countDocuments({})
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static updateReport(id, report) {
    return new Promise((resolve, reject) => {
      SampleModel.update({ _id: id }, { $set: { report: report } })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static async updateReportSpecific(id, fieldsToUpdate) {
    const result = await SampleModel.updateOne(
      { _id: id },
      { $set: fieldsToUpdate }
    );
    return result;
  }

  static async updateAbsorbancesAndFinalize(
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
  }

  static calcularResult(abs, abs2, calibrators) {
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

    var finalResult =
      (compara(log_b_b0, intercept, slope) +
        compara(log_b_b0_2, intercept, slope)) /
      2;

    return finalResult;
  }

  static finalizeSample(id, toxina, kit_id) {
    return new Promise((resolve, reject) => {
      var parameter = toxina + ".active";
      var parameter2 = toxina + ".kitId";
      var parameter3 = "report";
      var updateVal = {};

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
  }

  static getByIdArray(id_array) {
    return new Promise((resolve, reject) => {
      SampleModel.find({ _id: { $in: id_array } })
        .then((map) => {
          resolve(map);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static async getFinalizedByIdArrayWithUser(id_array) {
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
  }

  static getByIdArrayWithQuery(id_array, query) {
    querry["_id"] = { $in: id_array };
    return new Promise((resolve, reject) => {
      SampleModel.find(query)
        .then((map) => {
          resolve(map);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getActiveByIdArray(id_array, toxinafull) {
    return new Promise((resolve, reject) => {
      var querry = {};
      querry["_id"] = { $in: id_array };
      querry[toxinafull + ".active"] = true;

      SampleModel.find(querry)
        .then((map) => {
          resolve(map);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static async updateResult(id, toxina_full, result) {
    return new Promise((resolve, reject) => {
      var parameter = toxina_full + ".result";

      var updateVal = {};

      updateVal[parameter] = result;

      SampleModel.update({ _id: id }, { $set: updateVal })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getAllActiveWithWorkmap() {
    return new Promise((resolve, reject) => {
      var querry = { $or: [] };

      for (let index = 0; index < ToxinasFull.length; index++) {
        const toxina = ToxinasFull[index];
        var expression = {};

        expression[toxina + ".status"] = { $eq: "Mapa de Trabalho" };
        expression[toxina + ".active"] = true;

        querry.$or.push(expression);
      }

      SampleModel.find(querry)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getAllActive() {
    return new Promise((resolve, reject) => {
      var query = { $or: [] };

      for (let index = 0; index < ToxinasFull.length; index++) {
        const toxina = ToxinasFull[index];
        var expression = {};

        expression[toxina + ".active"] = true;

        query.$or.push(expression);
      }

      SampleModel.find(query)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getAllActiveWithUser() {
    return new Promise((resolve, reject) => {
      var querry = { $or: [] };

      for (let index = 0; index < ToxinasFull.length; index++) {
        const toxina = ToxinasFull[index];
        var expression = {};

        expression[toxina + ".active"] = true;

        querry.$or.push(expression);
      }

      SampleModel.aggregate([
        { $match: querry },
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
  }

  static async getAllReport() {
    let querry = { report: true };
    const result = await SampleModel.find(querry).populate({
      path: "requisitionId",
      select: "requisitionnumber user createdAt _id",
    });
    return result;
  }

  static async getRelatedEmails(id) {
    const result = await SampleModel.findById(
      id,
      "requisitionId samplenumber createdAt"
    ).populate({
      path: "requisitionId",
      select: "user _id",
      populate: { path: "user", select: "email fullname _id" },
    });

    return result;
  }

  /**
   * Create a new Sample
   * @param {Object} project - Sample Document Data
   * @returns {string} New Sample Id
   */
  static async create(sample) {
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
  }

  static async createMany(samples) {
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
  }

  static async createManySpecial(samples) {
    let manySamples = [];
    try {
      let samplenumber = 0;
      samples.forEach((sample) => {
        sample.samplenumber = samplenumber;
        manySamples.push(sample);
      });
      const result = await SampleModel.create(manySamples);
      return result;
    } catch (error) {
      console.warn(error);
      return error;
    }
  }

  static updateAflaWorkmap(id, cont) {
    return new Promise((resolve, reject) => {
      SampleModel.update({ _id: id }, { $set: { "aflatoxina.contador": cont } })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static updateOcraWorkmap(id, cont) {
    return new Promise((resolve, reject) => {
      SampleModel.update({ _id: id }, { $set: { "ocratoxina.contador": cont } })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static updateDeoxWorkmap(id, cont) {
    return new Promise((resolve, reject) => {
      SampleModel.update(
        { _id: id },
        { $set: { "deoxinivalenol.contador": cont } }
      )
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static updateT2Workmap(id, cont) {
    return new Promise((resolve, reject) => {
      SampleModel.update({ _id: id }, { $set: { "t2toxina.contador": cont } })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static updatefumWorkmap(id, cont) {
    return new Promise((resolve, reject) => {
      SampleModel.update({ _id: id }, { $set: { "fumonisina.contador": cont } })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static updateZeaWorkmap(id, cont) {
    return new Promise((resolve, reject) => {
      SampleModel.update(
        { _id: id },
        { $set: { "zearalenona.contador": cont } }
      )
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  static async getSampleData(filters) {
    const extraOperations = [];

    if (filters) {
      const { startDate, endDate, state, type, destination, user } = filters;
      console.log(type);
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
      console.log(match);
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
  }

  static async getFinalizationData(filters) {
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
      console.log(match);
      extraOperations.push({ $match: match });
    }

    const result = await SampleModel.aggregate([
      { $match: { finalized: "Disponivel", report: true } },
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
  }

  static async getResultData(filters) {
    const extraOperations = [];

    if (filters) {
      const { startDate, endDate, state, type, destination, user } = filters;
      console.log(type);
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
      console.log(match);
      extraOperations.push({ $match: match });
    }

    const result = await SampleModel.aggregate([
      { $match: { finalized: "Disponivel", report: true } },
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
  }

  static async getStatisticTableData() {
    const result = await SampleModel.aggregate([
      { $match: { finalized: "Disponivel", report: true } },
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
  }
}

module.exports = Sample;
