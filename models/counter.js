const mongoose = require("mongoose");
var data = new Date();
var yyyy = data.getFullYear();

const kitStock = new mongoose.Schema({
  name: String,
  minStock: Number,
});

const counterSchema = new mongoose.Schema(
  {
    lastYear: Number,
    sampleCount: Number, //This number reset when change the year
    requisitionCount: Number, //This number reset when change the year
    finalizationCount: Number, //This number DOESN'T reset when change the year
    kitStocks: [kitStock],
    counterName: {
      type: String,
      default: "Contador padrão",
    },
  },
  { timestamps: true, strict: false }
);

const CounterModel = mongoose.model("Counter", counterSchema);

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

  static create() {
    let kitStockVector = [];
    for (let i = 0; i < ToxinasFull.length; i++) {
      kitStockVector.push({ name: ToxinasFull[i], minStock: 0 });
    }

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
    if (result != null) sendValue(result);
    else {
      let newCounter = await create();
      sendValue(newCounter);
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

  static setKitStocks(newKitStocks) {
    function clearStocks(kitstocks, counter) {
      for (let i = 0; i < kitstocks.length; i++) {
        let actualMinStock = kitstocks[i].minStock;
        let actualName = kitstocks[i].name;
        let curresIndex = counter.kitStocks.findIndex(
          (element) => element.name === actualName
        );
        if (actualMinStock === "") {
          let currentKit = counter.kitStocks[curresIndex];
          kitstocks[i].minStock = currentKit.minStock;
        }
      }
      return kitstocks;
    }

    return new Promise(async (resolve, reject) => {
      CounterModel.findOne({})
        .then((counter) => {
          if (counter === null) {
            //Counter doesn't exist in DB.
            this.create().then((newCounter) => {
              let updatedKitStocks = clearStocks(newKitStocks, newCounter);
              newCounter.kitStocks = updatedKitStocks;
              newCounter.save();

              resolve(newCounter);
            });
          } else if (counter.kitStocks === undefined) {
            //Counter exists in DB but doesn't have kitStock array.
            let nullKits = [];
            for (let j = 0; j < ToxinasFull; j++) {
              nullKits.push({ name: ToxinasFull[j], minStock: 0 });
            }
            let fakeCounter = [];
            fakeCounter[kitstocks] = nullKits;
            let fakedKitStocks = clearStocks(newKitStocks, fakeCounter);

            counter.kitStocks = fakedKitStocks;
            counter.save();
          } else {
            //Counter exists in DB and has a valid KitStock array.
            let clearedKitStocks = clearStocks(newKitStocks, counter);
            counter.kitStocks = clearedKitStocks;
            counter.save();
          }
          resolve(counter);
        })
        .catch((err) => {
          reject(err);
        });
    });
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

  static getEntireKitStocks() {
    return new Promise((resolve, reject) => {
      CounterModel.findOne({}, { kitStocks: 1 }).then((counter) => {
        if (counter === null) {
          //Counter does not exist in DB
          this.create().then((newCounter) => {
            resolve(newCounter.kitStocks);
          });
        } else {
          let notFound = [];
          for (let i = 0; i < ToxinasFull.length; i++) {
            //Check if all toxins are present in kitStocks of counter.
            let toxinName = ToxinasFull[i];
            if (
              counter.kitStocks.findIndex(
                (element) => element.name === toxinName
              ) === undefined
            ) {
              notFound.push(toxinName);
            }
          }
          if (notFound.length > 0) {
            //Essential toxins are missing in kitStocks
            console.log("Nao foram encontradas " + notFound.length);
            console.log(notFound);
            resolve(counter.kitStocks);
          } else {
            resolve(counter.kitStocks);
          }
        }
      });
    });
  }
}

module.exports = Counter;
