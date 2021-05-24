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

  isActive: {
    type: Boolean, //1 for active, 0 for not active
    default: false,
  },

  finalizationNumber: {
    type: Number, //Contagem de finalização do workmap para puxar antigos
    default: -1,
  },
});

const kitSchema = new mongoose.Schema({
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

  workmaps: [workmapSchema],
});

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
    //Vai dar erro no calibration e no absorbances, tem que mudar.
    try {
      const result = await KitModel.findByIdAndUpdate(id, kit);
      return result;
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 176 ~ update ~ err", err);
      return err;
    }
  },

  async addMycotoxin(id, mycotoxin) {
    //Vai dar erro no report, tem que mudar.
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
      const result = await KitModel.findByIdAndUpdate(id, { deleted: false });
      return result;
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 198 ~ delete ~ err", err);
      return err;
    }
  },

  async getActive(toxinId) {
    try {
      const result = await KitModel.findOne({
        active: true,
        toxinId,
        deleted: { $ne: true },
        kitType: { $ne: "-" },
      });
      return result;
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 238 ~ getActive ~ err", err);
      return err;
    }
  },

  async getAllLastActiveWithSamples() {
    //Passei o olho mas náo testei. Pode ser que tenha que mudar algo.
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
            kitType: true,
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
            kitType: true,
            finalizationCount: { $arrayElemAt: ["$counter", 0] },
          },
        },
        {
          $project: {
            calibrators: true,
            kitType: true,
            finalizationCount: "$finalizationCount.finalizationCount",
          },
        },
        {
          $lookup: {
            from: "workmaps",
            let: {
              kitType: "$kitType",
              finalizationCount: "$finalizationCount",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$finalizationNumber", "$$finalizationCount"] },
                      { $eq: ["$kitType", "$$kitType"] },
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
            kitType: true,
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
      const result = await KitModel.find({
        active: true,
        deleted: { $ne: true },
        kitType: { $ne: "-" },
      });
      return result;
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 342 ~ getAllActive ~ err", err);
      return err;
    }
  },

  getAllForStock() {
    try {
      const result = KitModel.find({
        kitType: { $ne: "-" },
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
            deleted: false,
          },
        },
        {
          $project: {
            Lod: 1,
            Loq: 1,
            provider: 1,
            productCode: 1,
            productDescription: 1,
          },
        },
      ]);
      const obj = new Array();
      ToxinasAll.forEach((toxin) => {
        const filteredKits = result.filter(
          (aux) =>
            aux.productCode ===
            (toxin.Sigla === "FBS" ? "FUMO Romer" : toxin.Sigla + " Romer")
        );
        let aux = { name: toxin.Full };
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
          $match: { kitType: { $eq: "-" } },
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
        deleted: { $ne: true },
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
};

module.exports = KitActions;
