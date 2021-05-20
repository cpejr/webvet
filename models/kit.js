const mongoose = require("mongoose");
const Counter = require("../models/counter");

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

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

  isDeleted: {
    type: Boolean, //1 for deleted, 0 for not deleted
    default: 0,
  },

  isActive: {
    type: Boolean, //1 for active, 0 for not active
    default: 0,
  },

  finalizationNumber: {
    type: Number, //Contagem de finalização do workmap para puxar antigos
    default: -1,
  },
});

const kitSchema = new mongoose.Schema({
  calibrators: [calibratorSchema],

  //Código do kit
  productCode: {
    type: String,
    required: true,
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
  //Quantidade em estoque
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
    default: 0,
  },

  //Marca o kit como deletado
  deleted: {
    type: Boolean, // 1 for deleted, 0 for not deleted
    default: 0,
  },

  kitType: {
    type: String,
    enum: ["A", "B", "C", "D", "E", "F", "-"],
    required: true,
  },

  toxinIndex: {
    type: Number,
    default: 0,
  },

  workmaps: [workmapSchema],
});

const KitModel = mongoose.model("Kit", kitSchema);

const KitActions = {
  async getAll() {
    try {
      return await KitModel.find();
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 112 ~ getAll ~ err", err);
      return err;
    }
  },

  async getAllInStock() {
    try {
      return await KitModel.find({
        kitType: { $nin: ["-"] },
        deleted: false,
      });
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 121 ~ getAllInStock ~ err", err);
      return err;
    }
  },

  async getById(id) {
    try {
      return await KitModel.findById(id);
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 121 ~ getById ~ err", err);
      return err;
    }
  },

  async create(kit) {
    try {
      return await KitModel.create(kit);
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 142 ~ create ~ err", err);
      return err;
    }
  },

  async update(id, kit) {
    try {
      if (kit.workmaps.length <= kit.toxinIndex) {
        kit.kitType = "-";
      }
      return await KitModel.findByIdAndUpdate(id, kit);
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 154 ~ update ~ err", err);
      return err;
    }
  },

  async addMycotoxin(id, mycotoxin) {
    try {
      return await KitModel.findByIdAndUpdate(id, {
        $push: { mycotoxins: mycotoxin },
      });
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 163 ~ addMycotoxin ~ err", err);
      return err;
    }
  },

  async delete(id) {
    try {
      return await KitModel.findByIdAndUpdate(id, { deleted: 1 });
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 191 ~ delete ~ err", err);
      return err;
    }
  },

  async addWorkmap(id, workmap) {
    try {
      return await KitModel.findByIdAndUpdate(id, {
        $push: { mapArray: workmap },
      });
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 183 ~ addWorkmap ~ err", err);
      return err;
    }
  },

  async getActiveID(sigla) {
    try {
      if (sigla === "FBS") sigla = "FUMO";
      return await KitModel.findOne(
        { active: true, productCode: sigla + " Romer" },
        { active: 1 }
      );
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 192 ~ getActiveID ~ err", err);
      return err;
    }
  },

  async getActive(sigla) {
    try {
      if (sigla === "FBS") sigla = "FUMO";
      return await KitModel.findOne({
        active: true,
        productCode: sigla + " Romer",
      });
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 211 ~ getActive ~ err", err);
      return err;
    }
  },

  async getAllLastActiveWithSamples() {
    try {
      return await KitModel.aggregate([
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
    } catch (err) {
      console.warn(
        "🚀 ~ file: kit.js ~ line 211 ~ getAllLastActiveWithSamples ~ err",
        err
      );
      return err;
    }
  },

  async getAllActive() {
    try {
      return await KitModel.find({ active: true });
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 211 ~ getAllActive ~ err", err);
      return err;
    }
  },

  async getAllForStock() {
    try {
      return await KitModel.aggregate([
        {
          $match: {
            kitType: { $not: { $eq: "-" } },
          },
        },
      ]);
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 322 ~ getAllForStock ~ err", err);
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
      return await KitModel.aggregate([
        {
          $match: {
            deleted: false,
          },
        },
        {
          $project: {
            productCode: 1,
            amount: 1,
          },
        },
        {
          $group: {
            _id: "$productCode",
            currentSum: { $sum: "$amount" },
          },
        },
      ]);
    } catch (err) {
      console.warn(
        "🚀 ~ file: kit.js ~ line 370 ~ countAvailableWorkmaps ~ err",
        err
      );
      return err;
    }
  },

  async getAllArchived(page, itens_per_page) {
    try {
      return await KitModel.aggregate([
        {
          $match: {
            kitType: { $eq: "-" },
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
    } catch (err) {
      console.warn("🚀 ~ file: kit.js ~ line 435 ~ getAllArchived ~ err", err);
      return err;
    }
  },

  async getCurrentWorkmapsSamples() {
    try {
      return await KitModel.aggregate([
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
    } catch (err) {
      console.warn(
        "🚀 ~ file: kit.js ~ line 370 ~ getCurrentWorkmapsSamples ~ err",
        err
      );
      return err;
    }
  },
};

module.exports = KitActions;
