const mongoose = require("mongoose");

const calibratorSchema = new mongoose.Schema({
  //Número P do calibrador
  p: {
    type: Number,
    required: true,
  },
  absorbance: Number,
  concentration: Number,
});

const workmapSchema = new mongoose.Schema({
  samples: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sample",
    },
  ],

  wasUsed: {
    type: Boolean, //Marca se o workmap já foi consumido
    default: false,
  },

  finalizationNumber: {
    type: Number, //Contagem de finalização do workmap para puxar antigos
    default: -1,
  },
});

const kitSchema = new mongoose.Schema(
  {
    calibrators: [calibratorSchema],

    //Código do kit
    toxinId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Toxin",
    },

    //Data de expiração
    expirationDate: Date,

    //Limite de detecção
    Lod: {
      type: Number,
      default: 0,
    },

    //Limite de quantificação
    Loq: {
      type: Number,
      default: 0,
    },

    //Quantidade de workmaps restantes
    amount: Number,

    //Fornecedor do Kit
    provider: String,

    //Situação do estoque do kit
    status: {
      type: String,
      enum: ["Suficiente", "Próximo ao Vencimento", "Kit Vencido"],
    },

    //Kit está ativo para finalização
    active: {
      type: Boolean, // 1 for active, 0 for not
      default: false,
    },

    //Marca o kit como deletado
    deleted: {
      type: Boolean, // 1 for deleted, 0 for not deleted
      default: false,
    },

    kitDescription: String,

    kitType: {
      type: String,
      enum: ["A", "B", "C", "D", "E", "F", "-"],
      required: true,
    },

    workmapIndex: {
      type: Number,
      default: 0,
    },

    workmaps: [workmapSchema],
  },
  {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true },
  }
);

kitSchema.virtual("toxin", {
  ref: "Toxin", // The model to use
  localField: "toxinId", // Find people where `localField`
  foreignField: "_id", // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true,
});

const KitModel = mongoose.model("Kit", kitSchema);

const KitActions = {
  async getAll() {
    try {
      const result = await KitModel.find();
      return result;
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 112 ~ getAll ~ err", err);
      return err;
    }
  },

  async getAllInStock() {
    try {
      const result = await KitModel.find({
        kitType: { $ne: "-" },
        deleted: { $ne: true },
      }).populate("toxin");
      return result;
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 121 ~ getAllInStock ~ err", err);
      return err;
    }
  },

  async getById(id) {
    try {
      const result = await KitModel.findById(id).populate("toxin");
      return result;
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 121 ~ getById ~ err", err);
      return err;
    }
  },

  async create({ calibrators, amount, ...kitData }) {
    try {
      const calibratorData = calibrators.map(({ concentration }, index) => {
        return { p: index + 1, concentration };
      });
      let countWorkmaps = 0;
      let workmapData = [];
      while (countWorkmaps <= amount) {
        countWorkmaps += 1;
        workmapData.push({ samples: [] });
      }
      const newKit = {
        ...kitData,
        calibrators: calibratorData,
        workmaps: workmapData,
        amount,
      };
      const result = await KitModel.create(newKit);
      return result;
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 142 ~ create ~ err", err);
      return err;
    }
  },

  async update(id, kit) {
    try {
      const result = await KitModel.findByIdAndUpdate(id, kit);
      return result;
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 176 ~ update ~ err", err);
      return err;
    }
  },

  async addMycotoxin(id, mycotoxin) {
    try {
      const result = await KitModel.findByIdAndUpdate(id, {
        $push: { mycotoxins: mycotoxin },
      });
      return result;
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 183 ~ addMycotoxin ~ err", err);
      return err;
    }
  },

  async delete(id) {
    try {
      const result = await KitModel.findByIdAndUpdate(id, { deleted: 1 });
      return result;
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 198 ~ delete ~ err", err);
      return err;
    }
  },

  async addWorkmap(id, workmap) {
    try {
      const result = await KitModel.findByIdAndUpdate(id, {
        $push: { mapArray: workmap },
      });
      return result;
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 183 ~ addWorkmap ~ err", err);
      return err;
    }
  },

  async getActiveID(sigla) {
    try {
      if (sigla === "FBS") sigla = "FUMO";
      const result = await KitModel.findOne(
        { active: true, productCode: sigla + " Romer" },
        { active: 1 }
      );
      return result;
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 224 ~ getActiveID ~ err", err);
      return err;
    }
  },

  async getAllLastActiveWithSamples() {
    try {
      const result = await KitModel.aggregate([
        {
          $match: {
            active: true,
          },
        },
        {
          $project: {
            calibrators: true,
            productCode: true,
          },
        },
        {
          $lookup: {
            from: "counters",
            pipeline: [
              {
                $project: {
                  finalizationCount: { $add: ["$finalizationCount", -1] },
                },
              },
            ],
            as: "counter",
          },
        },
        {
          $project: {
            calibrators: true,
            productCode: true,
            finalizationCount: { $arrayElemAt: ["$counter", 0] },
          },
        },
        {
          $project: {
            calibrators: true,
            productCode: true,
            finalizationCount: "$finalizationCount.finalizationCount",
          },
        },
        {
          $lookup: {
            from: "workmaps",
            let: {
              productCode: "$productCode",
              finalizationCount: "$finalizationCount",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$finalizationNumber", "$$finalizationCount"] },
                      { $eq: ["$productCode", "$$productCode"] },
                    ],
                  },
                },
              },
              {
                $project: {
                  samplesArray: true,
                },
              },
            ],
            as: "workmaps",
          },
        },
        {
          $lookup: {
            from: "samples",
            localField: "workmaps.samplesArray",
            foreignField: "_id",
            as: "samples",
          },
        },
        {
          $project: {
            productCode: true,
            calibrators: true,
            samples: true,
          },
        },
      ]);
      return result;
    } catch (err) {
      console.warn(
        "🚀 ~ file: kit.js ~ line 330 ~ getAllLastActiveWithSamples ~ err",
        err
      );
      return err;
    }
  },

  async getAllActive() {
    try {
      const result = await KitModel.find({ active: true }).populate("toxin");
      return result;
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 342 ~ getAllActive ~ err", err);
      return err;
    }
  },

  getAllForStock() {
    try {
      const result = KitModel.find({
        kitType: { $not: { $eq: "-" } },
      }).populate("toxin");
      return result;
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 354 ~ getAllForStock ~ err", err);
      return err;
    }
  },

  async getAllForSpecialPanel() {
    try {
      const result = await KitModel.aggregate([
        {
          $match: {
            deleted: {
              $ne: true,
            },
            kitType: {
              $ne: "-",
            },
          },
        },
        {
          $lookup: {
            from: "toxins",
            localField: "toxinId",
            foreignField: "_id",
            as: "toxin",
          },
        },
        {
          $project: {
            Lod: 1,
            Loq: 1,
            provider: 1,
            productCode: 1,
            productDescription: 1,
            toxin: 1,
          },
        },
        {
          $unwind: {
            path: "$toxin",
          },
        },
      ]);

      const obj = new Array();

      Toxins.forEach((toxin) => {
        const filteredKits = result.filter(
          (aux) => aux.toxin.lower === toxin.lower
        );

        let aux = { name: toxin.sigle };
        if (filteredKits.length > 0) {
          aux.kits = filteredKits;
        } else {
          aux.kits = false;
        }
        obj.push(aux);
      });

      return obj;
    } catch (err) {
      console.warn(
        "🚀 ~ file: kit.js ~ line 370 ~ getAllForSpecialPanel ~ err",
        err
      );
      return err;
    }
  },

  async countAvailableWorkmaps() {
    try {
      const result = await KitModel.aggregate([
        {
          $match: {
            deleted: { $ne: true },
            kitType: { $ne: "-" },
          },
        },
        {
          $lookup: {
            from: "toxins",
            localField: "toxinId",
            foreignField: "_id",
            as: "toxin",
          },
        },
        {
          $unwind: {
            path: "$toxin",
          },
        },
        {
          $project: {
            toxin: 1,
            kitType: 1,
            amount: 1,
          },
        },
        {
          $group: {
            _id: "$toxin.sigle",
            count: {
              $sum: "$amount",
            },
          },
        },
      ]);
      return result;
    } catch (err) {
      console.warn(
        "🚀 ~ file: kit.js ~ line 370 ~ countAvailableWorkmaps ~ err",
        err
      );
      return err;
    }
  },

  getAllArchived(page, itens_per_page) {
    try {
      const result = KitModel.aggregate([
        {
          $match: {
            $or: [{ deleted: true }, { kitType: { $eq: "-" } }],
          },
        },
        {
          $group: {
            _id: null,
            kits: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 0,
            totalCount: { $size: "$kits" },
            kits: { $reverseArray: "$kits" },
          },
        },
        {
          $project: {
            totalCount: 1,
            kits: { $slice: ["$kits", page * itens_per_page, itens_per_page] },
          },
        },
      ]);
      return result;
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 435 ~ getAllArchived ~ err", err);
      return err;
    }
  },

  async getCurrentWorkmapsSamples() {
    try {
      const result = await KitModel.aggregate([
        {
          $match: {
            active: true,
          },
        },
        {
          $lookup: {
            from: "workmaps",
            localField: "mapArray",
            foreignField: "_id",
            as: "workmaps",
          },
        },
        { $unwind: "$workmaps" },
        {
          $addFields: {
            "workmaps.toxinIndex": "$toxinIndex",
          },
        },
        {
          $replaceRoot: {
            newRoot: "$workmaps",
          },
        },
        {
          $addFields: {
            mapNumber: { $toInt: "$mapID" },
          },
        },
        {
          $match: {
            $and: [
              { finalizationNumber: -1 },
              { $expr: { $gte: ["$mapNumber", "$toxinIndex"] } },
            ],
          },
        },
        {
          $project: {
            samplesArray: 1,
            productCode: 1,
            mapID: 1,
          },
        },
        {
          $sort: {
            productCode: 1,
            mapNumber: 1,
          },
        },
        {
          $lookup: {
            from: "samples",
            let: { array: "$samplesArray" },
            pipeline: [{ $match: { $expr: { $in: ["$_id", "$$array"] } } }],
            as: "samples",
          },
        },
        { $unwind: "$samples" },
        {
          $group: {
            _id: "$productCode",
            samples: { $push: "$samples" },
          },
        },
      ]);
      return result;
    } catch (err) {
      console.warn(
        "🚀 ~ file: kit.js ~ line 370 ~ getCurrentWorkmapsSamples ~ err",
        err
      );
      return err;
    }
  },

  async checkIfAlreadyExists(toxinId, kitType) {
    try {
      const result = await KitModel.find({
        toxinId,
        kitType,
        isDeleted: false,
      });
      return result.length > 0;
    } catch (err) {
      console.warn(
        "🚀 ~ file: kit.js ~ line 533 ~ checkIfAlreadyExists ~ err",
        err
      );
      return err;
    }
  },

  findByFields(fields) {
    return KitModel.find(fields);
  },

  setActive(toxinId, kitType) {
    return Promise.all([
      KitModel.updateMany(
        { toxinId, active: true, kitType: { $ne: kitType } },
        { $set: { active: false } }
      ),
      KitModel.updateOne(
        { toxinId, kitType, active: false, deleted: false },
        { $set: { active: true } }
      ),
    ]);
  },

  getActiveWithSamples(toxinId) {
    return KitModel.findOne({ toxinId, active: true }).populate(
      "workmaps.samples"
    );
  },

  async getAllActiveWithSamples() {
    let response = await KitModel.find({ active: true })
      .populate("toxin")
      .populate({
        path: "workmaps.samples",
        populate: {
          path: "requisition",
        },
      })
      .sort({ "toxin.name": 1 });

    response = response.map((kit) => kit.toJSON());
    response.forEach((kit, ki) =>
      kit.workmaps.forEach((workmap, wi) => {
        workmap.samples.forEach((sample, si) => {
          response[ki].workmaps[wi].samples[si].analysis = sample.analysis.find(
            (analysis) => {
              return `${analysis.workmapId}` == `${workmap._id}`;
            }
          );
        });
      })
    );

    return response;
  },

  async getAllByFinalizationNumber(finalizationNumber) {
    let response = await KitModel.find({
      "workmaps.finalizationNumber": finalizationNumber,
    })
      .populate("toxin")
      .populate({
        path: "workmaps.samples",
        populate: {
          path: "requisition",
        },
      })
      .sort({ "toxin.name": 1 });

    response = response.map((kit) => kit.toJSON());
    response.forEach((kit, ki) =>
      kit.workmaps.forEach((workmap, wi) => {
        workmap.samples.forEach((sample, si) => {
          response[ki].workmaps[wi].samples[si].analysis = sample.analysis.find(
            (analysis) => {
              return `${analysis.workmapId}` == `${workmap._id}`;
            }
          );
        });
      })
    );

    return response;
  },

  async updateSampleWorkmapId(oldWorkmapId, newWorkmapId, sapleId) {
    const promises = [];
    promises.push(
      KitModel.updateOne(
        { "workmaps._id": oldWorkmapId },
        {
          $pull: { "workmaps.$.samples": sapleId },
        }
      )
    );

    if (newWorkmapId && newWorkmapId !== null)
      promises.push(
        KitModel.updateOne(
          { "workmaps._id": newWorkmapId },
          {
            $push: { "workmaps.$.samples": sapleId },
          }
        )
      );

    return await Promise.all(promises);
  },

  updateOne(conditions, doc) {
    return KitModel.updateOne(conditions, doc);
  },

  finalizeWorkmap(kitId, workmapId, finalizationNumber, newAmount) {
    return KitModel.updateOne(
      { _id: kitId, "workmaps._id": workmapId },
      {
        "workmaps.$.finalizationNumber": finalizationNumber,
        "workmaps.$.wasUsed": true,
        amount: newAmount,
      }
    );
  },
};

module.exports = KitActions;
