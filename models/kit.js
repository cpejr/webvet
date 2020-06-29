const mongoose = require("mongoose");

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

const kitSchema = new mongoose.Schema({
  kitId: String,
  productCode: {
    type: String,
    required: true,
  },
  productDescription: String,
  lot: String,
  moveDate: String,
  dayexpirationDate: Number,
  monthexpirationDate: Number,
  expirationDate: String,
  yearexpirationDate: Number,
  stdLevel: Number,
  Lod: {
    type: Number,
    default: 0,
  },
  Loq: {
    type: Number,
    default: 0,
  },
  calibrators: {
    P1: {
      absorbance: {
        type: Number,
        default: 0,
      },
      concentration: {
        type: Number,
        default: 0,
      },
    },
    P2: {
      absorbance: {
        type: Number,
        default: 0,
      },
      concentration: {
        type: Number,
        default: 0,
      },
    },
    P3: {
      absorbance: {
        type: Number,
        default: 0,
      },
      concentration: {
        type: Number,
        default: 0,
      },
    },
    P4: {
      absorbance: {
        type: Number,
        default: 0,
      },
      concentration: {
        type: Number,
        default: 0,
      },
    },
    P5: {
      absorbance: {
        type: Number,
        default: 0,
      },
      concentration: {
        type: Number,
        default: 0,
      },
    },
  },
  amount: Number,
  provider: String,
  stockMin: Number,
  // unit: Number,
  // price: Number,
  r2: Number,
  status: {
    type: String,
    enum: ["Suficiente", "Próximo ao Vencimento", "Kit Vencido"],
  },
  active: {
    type: Boolean, // 1 for active, 0 for not
    default: 0,
  },
  deleted: {
    type: Boolean, // 1 for deleted, 0 for not deleted
    default: 0,
  },
  semStock: {
    type: Boolean, // 1 for out of stock
    default: 0,
  },
  mycotoxin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mycotoxin",
  },
  kitType: {
    type: String,
    enum: ["A", "B", "C", "D", "E", "F", "-"],
    required: true,
  },
  stripLength: Number,
  toxinaStart: {
    type: Number,
    default: 0,
  },
  mapArray: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workmap",
    },
  ],
});

const KitModel = mongoose.model("Kit", kitSchema);

class Kit {
  /**
   * Get all Kits from database
   * @returns {Array} Array of Kits
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      KitModel.find({})
        .exec()
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static async getAllInStock() {
    const results = await KitModel.find({
      kitType: { $nin: ["-"] },
      deleted: false,
    });
    return results;
  }

  /**
   * Get a Kit by it's id
   * @param {string} id - Kit Id
   * @returns {Object} - Kit Document Data
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      KitModel.findById(id)
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
   * Get all kits with same productCode
   * @param {string} code - product code
   * @returns {array} - Kit array
   */
  static getByProductCode(code) {
    return new Promise((resolve, reject) => {
      KitModel.find({ productCode: code })
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getByCustomQuery(query) {
    return new Promise((resolve, reject) => {
      KitModel.find(query)
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
   * Create a new Kit
   * @param {Object} kit - Kit Document Data
   * @returns {string} - New Kit Id
   */
  static create(kit) {
    return new Promise((resolve, reject) => {
      KitModel.create(kit)
        .then((result) => {
          resolve(result._id);
        })
        .catch((err) => {
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
      if (kit.mapArray.length === kit.toxinaStart) {
        kit.kitType = "-";
      }
      KitModel.findByIdAndUpdate(id, kit)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
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
      KitModel.findByIdAndUpdate(id, {
        $push: { mycotoxins: mycotoxin },
      }).catch((err) => {
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
      KitModel.findByIdAndUpdate(id, { $set: { active: status } })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
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
      KitModel.findByIdAndUpdate(id, { $set: { amount: newAmount } }).catch(
        (err) => {
          reject(err);
        }
      );
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
      KitModel.findByIdAndUpdate(id, { deleted: 1 })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static addMap(id, mapwork) {
    return new Promise((resolve, reject) => {
      KitModel.findByIdAndUpdate(id, { $push: { mapArray: mapwork } }).catch(
        (err) => {
          reject(err);
        }
      );
    });
  }

  static addMaps(id, mapArray) {
    return new Promise((resolve, reject) => {
      KitModel.findByIdAndUpdate(id, { $push: { mapArray: mapArray } })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  static getWorkmapsById(id) {
    return new Promise((resolve, reject) => {
      KitModel.findById(id)
        .then((result) => {
          resolve(result.mapArray);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getActiveID(siglaToxina) {
    //Correção provisória do problema com a sigla
    if (siglaToxina === "FBS") siglaToxina = "FUMO";

    return new Promise((resolve, reject) => {
      //{ active: 1 } é somente para retornar o _id, economizar internet
      KitModel.findOne(
        { active: true, productCode: siglaToxina + " Romer" },
        { active: 1 }
      )
        .exec()
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getActive(siglaToxina) {
    //Correção provisória do problema com a sigla
    if (siglaToxina === "FBS") siglaToxina = "FUMO";

    return new Promise((resolve, reject) => {
      KitModel.findOne({ active: true, productCode: siglaToxina + " Romer" })
        .exec()
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getAllLastActiveWithSamples() {
    return new Promise((resolve, reject) => {
      KitModel.aggregate([
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
      ])
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getAllActive() {
    return new Promise((resolve, reject) => {
      KitModel.find({ active: true })
        .exec()
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getByIdArray(id_array) {
    return new Promise((resolve, reject) => {
      KitModel.find({ _id: { $in: id_array } })
        .then((kit) => {
          resolve(kit);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getValuesFromMany(listIds, validIds) {
    let valueObject = [];
    let result;
    return new Promise((resolve) => {
      for (i = 0; i < listIds.length; i++) {
        if (validIds[i]) {
          try {
            result = new Promise((resolve, reject) => {
              KitModel.findById(listIds[i]);
            });
          } catch (err) {
            console.log("Erro de sincronizacao");
          } finally {
            valueObject.push({ loq: result.Loq, lod: result.Lod });
          }
        } else {
          valueObject.push({
            loq: "Numero nao declarado",
            log: "Numero nao declarado",
          });
        }
      }
      Promise.all(valueObject).then(function finalizar() {
        resolve(valueObject);
      });
    });
  }

  static getLowestAvailableKitType(productCode) {
    return new Promise((resolve) => {
      KitModel.find({ productCode: productCode })
        .then((results) => {
          let controlVector = ["A", "B", "C", "D", "E", "F"];
          results.forEach((kit) => {
            if (kit.kitType !== "-") {
              controlVector = controlVector.filter((e) => e !== kit.kitType);
            }
          });
          if (controlVector.length > 0) {
            resolve(controlVector[0]);
          } else {
            resolve("-");
          }
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  static findByIdAndEdit(id, kit) {
    return new Promise((resolve) => {
      KitModel.findByIdAndUpdate(id, kit)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getAllForStock() {
    return new Promise((resolve, reject) => {
      KitModel.aggregate([
        {
          $match: {
            kitType: { $not: { $eq: "-" } },
          },
        },
      ])
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

  static countAvailableWorkmaps() {
    return new Promise((resolve, reject) => {
      KitModel.aggregate([
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
      ])
        .then((count) => {
          count = count.sort(dynamicSort("_id"));
          resolve(count);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getAllArchived(page, itens_per_page) {
    return new Promise((resolve, reject) => {
      KitModel.aggregate([
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
      ])
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }
}

module.exports = Kit;
