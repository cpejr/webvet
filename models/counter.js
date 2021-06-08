const mongoose = require("mongoose");
var data = new Date();
var yyyy = data.getFullYear();

const kitStockSchema = new mongoose.Schema({
  toxinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Toxin",
  },
  minStock: Number,
});

const counterSchema = new mongoose.Schema(
  {
    lastYear: Number,
    sampleCount: Number, //This number reset when change the year
    requisitionCount: Number, //This number reset when change the year
    finalizationCount: Number, //This number DOESN'T reset when change the year
    kitStocks: [kitStockSchema],
    counterName: {
      type: String,
      default: "Contador padrão",
    },
  },
  { timestamps: true, strict: false }
);

const CounterModel = mongoose.model("Counter", counterSchema);

kitStockSchema.virtual("toxin", {
  ref: "Toxin", // The model to use
  localField: "toxinId", // Find people where `localField`
  foreignField: "_id", // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true,
});

class Counter {
  /* Gets the current counter from database as a singular {object} of counter*/
  static getCounter() {
    return new Promise((resolve, reject) => {
      CounterModel.findOne({})
        .exec()
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static resetCounter(id, currentYear) {
    return new Promise((resolve, reject) => {
      CounterModel.update(
        { _id: id },
        {
          $set: { lastYear: currentYear, sampleCount: 1, requisitionCount: 1 }, // Reiniciar sampleCount e requisitionCount
        }
      )
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static async createDefault() {
    let kitStockVector = [];
    Toxins.forEach((toxin) =>
      kitStockVector.push({ toxinId: toxin._id, minStock: 0 })
    );

    const Contador = {
      lastYear: yyyy,
      sampleCount: 1,
      requisitionCount: 1,
      finalizationCount: 1,
      counterName: "Contador padrão",
      kitStocks: kitStockVector,
    };

    return new Promise((resolve, reject) => {
      CounterModel.create(Contador)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static setSampleCount(num) {
    return new Promise((resolve, reject) => {
      CounterModel.findOneAndUpdate({}, { $set: { sampleCount: num } })
        .exec()
        .then((res) => resolve(res))
        .catch((err) => {
          reject(err);
          console.warn(err);
        });
    });
  }

  static setRequisitionCount(num) {
    return new Promise((resolve, reject) => {
      CounterModel.findOneAndUpdate({}, { $set: { requisitionCount: num } })
        .exec()
        .then((res) => resolve(res))
        .catch((err) => {
          reject(err);
          console.warn(err);
        });
    });
  }

  static async setFinalizationCount(num) {
    const response = await CounterModel.findOneAndUpdate(
      {},
      { $set: { finalizationCount: num } }
    );

    return response;
  }

  static getSampleCount() {
    return new Promise((resolve, reject) => {
      CounterModel.findOne({})
        .then((result) => {
          //if doesn't exist a counter, will create a new one
          if (result != null) sendValue(result, this);
          else this.create().then((result) => sendValue(result, this));

          function sendValue(counter, reference) {
            //Verificar se o ano mudou
            if (counter.lastYear < yyyy) {
              counter.sampleCount = 1;
              reference.resetCounter(counter._id, yyyy);
            }

            //Previnir de erros
            if (
              Number.isNaN(counter.sampleCount) ||
              typeof counter.sampleCount === "undefined"
            )
              counter.sampleCount = 1;

            resolve(counter.sampleCount);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getRequisitionCount() {
    return new Promise((resolve, reject) => {
      CounterModel.findOne({})
        .then((result) => {
          //if a counter doesn't exist, will create a new one
          if (result != null) sendValue(result, this);
          else this.create().then((result) => sendValue(result, this));

          function sendValue(counter, reference) {
            //Verificar se o ano mudou
            if (counter.lastYear < yyyy) {
              counter.requisitionCount = 1;
              reference.resetCounter(counter._id, yyyy);
            }

            //Previnir de erros
            if (
              Number.isNaN(counter.requisitionCount) ||
              typeof counter.requisitionCount === "undefined"
            )
              counter.requisitionCount = 1;

            resolve(counter.requisitionCount);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static async getFinalizationCount() {
    const result = await CounterModel.findOne({});

    //if a counter doesn't exist, will create a new one
    if (result != null) return sendValue(result);
    else {
      let newCounter = await create();
      return sendValue(newCounter);
    }

    function sendValue(counter) {
      //Previnir de erros
      if (
        Number.isNaN(counter.finalizationCount) ||
        typeof counter.finalizationCount === "undefined"
      )
        counter.finalizationCount = 1;

      return counter.finalizationCount;
    }
  }

  static async setKitStocks(newKitStocks) {
    let promiseVector = [];
    try {
      newKitStocks.forEach((kitstock) => {
        promiseVector.push(
          new Promise((resolve, reject) => {
            CounterModel.findOneAndUpdate(
              {},
              {
                "kitStocks.$[kitStock].minStock": kitstock.minStock,
              },
              { arrayFilters: [{ "kitStock._id": kitstock._id }] }
            )
              .then((result) => {
                resolve(result);
              })
              .catch((err) => {
                console.log(
                  "🚀 ~ file: counter.js ~ line 250 ~ Counter ~ .then ~ err",
                  err
                );
                reject(err);
              });
          })
        );
      });
      const result = await Promise.all(promiseVector);
      return result;
    } catch (err) {
      console.log(
        "🚀 ~ file: counter.js ~ line 236 ~ Counter ~ setKitStocks ~ err",
        err
      );
      return err;
    }
  }

  static getSpecificKitStock(name) {
    return new Promise((resolve, reject) => {
      CounterModel.findOne({})
        .then((counter) => {
          if (counter === null) {
            this.create().then(() => {
              resolve(0);
            });
          } else {
            value = counter.kitStock.find((element) => element.name === name);
            if (value !== undefined) {
              resolve(value);
            } else {
              resolve(undefined);
            }
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static async getEntireKitStocks() {
    try {
      const pipeline = await CounterModel.aggregate([
        {
          $project: {
            kitStocks: 1,
          },
        },
        {
          $lookup: {
            from: "toxins",
            localField: "kitStocks.toxinId",
            foreignField: "_id",
            as: "toxins",
          },
        },
      ]);
      if (pipeline.length === 0) {
        await this.createDefault();
        const newResult = await this.getEntireKitStocks();
        return newResult;
      } else {
        const result = pipeline[0].kitStocks.map((element, index) => {
          return { ...pipeline[0].toxins[index], ...element };
        });
        return result;
      }
    } catch (err) {
      console.warn(
        "🚀 ~ file: counter.js ~ line 308 ~ Counter ~ getEntireKitStocks ~ err",
        err
      );
      return err;
    }
  }
}

module.exports = Counter;
