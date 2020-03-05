const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Counter = require('../models/counter');
const Workmap = require('./Workmap');
var data = new Date();
var yyyy = data.getFullYear();
const ToxinasFull = ['aflatoxina', 'deoxinivalenol', 'fumonisina', 'ocratoxina', 't2toxina', 'zearalenona'];

const sampleSchema = new mongoose.Schema({
  samplenumber: Number,
  name: String,
  sampletype: String,
  report: {
    type: Boolean, //1 for available, 0 for not available
    default: 0
  },
  requisitionId: {
    type: mongoose.Schema.Types.ObjectId
  },
  responsible: String,
  creationYear: {
    type: Number,
    default: yyyy,
  },
  description: String,
  ocratoxina: {
    status: {
      type: String,
      enum: ['Nova', 'Sem amostra', 'Em análise', 'A corrigir', 'Aguardando pagamento', 'Aguardando amostra', ' Mapa de Trabalho'],
      default: 'Nova'
    },
    date: String,
    absorbance: Number,
    absorbance2: Number,
    result: String,
    active: {
      type: Boolean,
      default: false
    },
    contador: Number,
    mapReference: {
      type: String,
      default: 'Sem mapa'
    },
    workmapId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    concentration: String,
    kitId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  deoxinivalenol: {
    status: {
      type: String,
      enum: ['Nova', 'Sem amostra', 'Em análise', 'A corrigir', 'Aguardando pagamento', 'Aguardando amostra', ' Mapa de Trabalho'],
      default: 'Nova'
    },
    date: String,
    absorbance: Number,
    absorbance2: Number,
    result: String,
    active: {
      type: Boolean,
      default: false
    },
    contador: Number,
    mapReference: {
      type: String,
      default: 'Sem mapa'
    },
    workmapId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    concentration: String,
    kitId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  t2toxina: {
    status: {
      type: String,
      enum: ['Nova', 'Sem amostra', 'Em análise', 'A corrigir', 'Aguardando pagamento', 'Aguardando amostra', ' Mapa de Trabalho'],
      default: 'Nova'
    },
    date: String,
    absorbance: Number,
    absorbance2: Number,
    result: String,
    active: {
      type: Boolean,
      default: false
    },
    contador: Number,
    mapReference: {
      type: String,
      default: 'Sem mapa'
    },
    concentration: String,
    kitId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    workmapId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  fumonisina: {
    status: {
      type: String,
      enum: ['Nova', 'Sem amostra', 'Em análise', 'A corrigir', 'Aguardando pagamento', 'Aguardando amostra', ' Mapa de Trabalho'],
      default: 'Nova'
    },
    date: String,
    absorbance: Number,
    absorbance2: Number,
    result: String,
    active: {
      type: Boolean,
      default: false
    },
    contador: Number,
    mapReference: {
      type: String,
      default: 'Sem mapa'
    },
    concentration: String,
    kitId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    workmapId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  zearalenona: {
    status: {
      type: String,
      enum: ['Nova', 'Sem amostra', 'Em análise', 'A corrigir', 'Aguardando pagamento', 'Aguardando amostra', ' Mapa de Trabalho'],
      default: 'Nova'
    },
    date: String,
    absorbance: Number,
    absorbance2: Number,
    result: String,
    active: {
      type: Boolean,
      default: false
    },
    contador: Number,
    mapReference: {
      type: String,
      default: 'Sem mapa'
    },
    concentration: String,
    kitId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    workmapId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  aflatoxina: {
    status: {
      type: String,
      enum: ['Nova', 'Sem amostra', 'Em análise', 'A corrigir', 'Aguardando pagamento', 'Aguardando amostra', ' Mapa de Trabalho'],
      default: 'Nova'
    },
    date: String,
    absorbance: Number,
    absorbance2: Number,
    result: String,
    active: {
      type: Boolean,
      default: false
    },
    contador: Number,
    mapReference: {
      type: String,
      default: 'Sem mapa'
    },
    concentration: String,
    kitId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    workmapId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  isCalibrator: {
    type: Boolean,
    default: false
  },
  description: String,
  parecer: String,
  finalized: {
    type: Boolean,
    default: false
  },
}, { timestamps: true, strict: false });

const SampleModel = mongoose.model('Sample', sampleSchema);

class Sample {
  /**
   * Get all Samples from database
   * @returns {Array} Array of Samples
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      SampleModel.find({}).populate('sample').exec().then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  }


  /**
   * Get a Sample by it's id
   * @param {string} id - Sample Id
   * @returns {Object} Sample Document Data
   */
  static getById(id) {
    return new Promise((resolve, reject) => {
      SampleModel.findOne({ _id: id }).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * Get a Sample by it's numsample
   * @param {string} destination - Sample's Number
   * @returns {Object} Sample Document Data
   */
  static getBySampleNumber(samplenumber) {
    return new Promise((resolve, reject) => {
      SampleModel.findOne({ samplenumber: samplenumber }).populate('sample').exec().then((result) => {
        resolve(result);
      }).catch((err) => {
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
      SampleModel.findById(idrequisition).populate('sample').exec().then((result) => {
        resolve(result.toObject());
      }).catch((err) => {
        reject(err);
      });
    });
  }

  static getMaxSampleNumber() {
    return new Promise((resolve, reject) => {
      SampleModel.find({}, { samplenumber: 1, _id: 0 }).sort({ samplenumber: -1 }).limit(1).populate('sample').exec().then((result) => {

        resolve(result);
      }).catch((err) => {
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
      SampleModel.findByIdAndUpdate(id, sample).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  static updateCustom(id, params) {
    return new Promise((resolve, reject) => {
      SampleModel.updateOne({ _id: id }, { $set: params }).then((result) => {
        resolve(result);
      }).catch(err => {
        console.log(err);
        reject(err);
      });
    });
  }

  static updateBySampleNumber(sampleNumber, sample) {
    return new Promise((resolve, reject) => {
      SampleModel.findOneAndUpdate({samplenumber: sampleNumber}, sample).then((res) => {
        resolve(res);
      }).catch((err) => {
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
      SampleModel.find({ _id: { $in: id_array } }).then(samples => {
        let samplesToRemove = {};

        for (let j = 0; j < samples.length; j++) {
          const sample = samples[j]

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
          Workmap.removeSamples(workmapsId[i], samplesToRemove[workmapsId[i]]);



      }).then(() => {
        SampleModel.deleteMany({ _id: { $in: id_array } }).then(
          obj => resolve(obj)
        ).catch((err) => {
          reject(err);
        });
      })
    });
  }

  /**
   * Deletes all Samples from DB
   * @returns {null}
   */
  static clear() {
    return new Promise((resolve, reject) => {
      SampleModel.deleteMany({}).then(() => {
        resolve();
      }).catch((err) => {
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
      SampleModel.countDocuments({ isCalibrator: false }).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  static updateReport(id, report) {
    return new Promise((resolve, reject) => {
      SampleModel.update({ _id: id }, { $set: { report: report } }).then((result) => {
        resolve(result);
      }).catch(err => {
        reject(err);
      });
    });
  }

  static async updateReportSpecific(id, info) {
    return new Promise((resolve, reject) =>{
      SampleModel.updateOne({ _id: id },{$set: info}).then((result) => {
        resolve(result);
      }).catch(err => {
        reject(err);
      });
    });
  }

  static updateAbsorbances(toxina, id, abs, abs2) {

    return new Promise((resolve, reject) => {
      var parameter = toxina + '.absorbance';
      var parameter2 = toxina + '.absorbance2';

      var updateVal = {};
      updateVal[parameter] = abs;
      updateVal[parameter2] = abs2;

      SampleModel.update(
        { _id: id },
        { $set: updateVal }).then((result) => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });

    });
  }

  static finalizeSample(id, toxina, kit_id) {

    return new Promise((resolve, reject) => {
      var parameter = toxina + '.active';
      var parameter2 = toxina + '.kitId';
      var parameter3 = 'report';
      var updateVal = {};

      updateVal[parameter] = false;
      updateVal[parameter2] = kit_id;
      updateVal[parameter3] = true;

      SampleModel.update(
        { _id: id },
        { $set: updateVal }).then((result) => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });

    });
  }

  static finalizeReportById(id, command){
    return new Promise((resolve, reject) =>{
      SampleModel.update({ _id: id }, {$set: {finalized: command}}).then((result) =>{
        resolve(result);
      }).catch(err => {
        reject(err);
      });
    });
  }

  static getByIdArray(id_array) {
    return new Promise((resolve, reject) => {
      SampleModel.find({ _id: { $in: id_array } }).then((map) => {
        resolve(map);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  static getFinalizedByIdArray(id_array) {
    return new Promise((resolve, reject) => {
      SampleModel.find({ _id: { $in: id_array }, finalized: true}).then((map) => {
        resolve(map);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  static getByIdArrayWithQuery(id_array, query) {
    querry['_id'] = { $in: id_array }
    return new Promise((resolve, reject) => {
      SampleModel.find(query).then((map) => {
        resolve(map);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  static getActiveByIdArray(id_array, toxinafull) {
    return new Promise((resolve, reject) => {

      var querry = {};
      querry['_id'] = { $in: id_array };
      querry[toxinafull + '.active'] = true;

      SampleModel.find(querry).then((map) => {
        resolve(map);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  static async updateResult(id, toxina_full, result) {

    return new Promise((resolve, reject) => {
      var parameter = toxina_full + '.result';

      var updateVal = {};

      updateVal[parameter] = result;

      SampleModel.update(
        { _id: id },
        { $set: updateVal }).then((result) => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });

    });
  }

  static getAllActiveWithWorkmap() {
    return new Promise((resolve, reject) => {

      const ToxinasFull = ['aflatoxina', 'deoxinivalenol', 'fumonisina', 'ocratoxina', 't2toxina', 'zearalenona'];

      var querry = { $or: [] };

      for (let index = 0; index < ToxinasFull.length; index++) {
        const toxina = ToxinasFull[index];
        var expression = {}

        expression[toxina + '.status'] = { $eq: 'Mapa de Trabalho'  };
        expression[toxina + '.active'] = true;

        querry.$or.push(expression);
      }

      SampleModel.find(querry).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }
  
  static getAllActive() {
    return new Promise((resolve, reject) => {

      const ToxinasFull = ['aflatoxina', 'deoxinivalenol', 'fumonisina', 'ocratoxina', 't2toxina', 'zearalenona'];

      var querry = { $or: [] };

      for (let index = 0; index < ToxinasFull.length; index++) {
        const toxina = ToxinasFull[index];
        var expression = {}

        expression[toxina + '.active'] = true;

        querry.$or.push(expression);
      }

      SampleModel.find(querry).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  static getAllReport() {
    return new Promise((resolve, reject) => {

      var querry = { report: true };

      SampleModel.find(querry).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
  * Create a new Sample
  * @param {Object} project - Sample Document Data
  * @returns {string} New Sample Id
  */
  static create(sample) {
    return new Promise((resolve, reject) => {
      Counter.getSampleCount().then(async sampleNumber => {
        let count = sampleNumber;
        sample.samplenumber = count;

        var value = await SampleModel.create(sample);
        count++;
        Counter.setSampleCount(count);
        resolve(value);
      });
    });
  }

  static createMany(samples) {
    return new Promise((resolve, reject) => {
      let result = [];
      Counter.getSampleCount().then(async sampleNumber => {
        let count = sampleNumber;
        for (let index = 0; index < samples.length; index++) {
          const element = samples[index];
          element.samplenumber = count;

          var value = await SampleModel.create(element);

          result.push(value);
          count++;
        }
        Counter.setSampleCount(count);
        resolve(result);
      });
    });
  }

  static updateAflaWorkmap(id, cont) {
    return new Promise((resolve, reject) => {
      SampleModel.update(
        { _id: id },
        { $set: { 'aflatoxina.contador': cont } }).then((result) => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });

    });
  }

  static updateOcraWorkmap(id, cont) {
    return new Promise((resolve, reject) => {
      SampleModel.update(
        { _id: id },
        { $set: { 'ocratoxina.contador': cont } }).then((result) => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });

    });
  }

  static updateDeoxWorkmap(id, cont) {
    return new Promise((resolve, reject) => {
      SampleModel.update(
        { _id: id },
        { $set: { 'deoxinivalenol.contador': cont } }).then((result) => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });

    });
  }

  static updateT2Workmap(id, cont) {
    return new Promise((resolve, reject) => {
      SampleModel.update(
        { _id: id },
        { $set: { 't2toxina.contador': cont } }).then((result) => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });

    });
  }

  static updatefumWorkmap(id, cont) {
    return new Promise((resolve, reject) => {
      SampleModel.update(
        { _id: id },
        { $set: { 'fumonisina.contador': cont } }).then((result) => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });

    });
  }

  static updateZeaWorkmap(id, cont) {
    return new Promise((resolve, reject) => {
      SampleModel.update(
        { _id: id },
        { $set: { 'zearalenona.contador': cont } }).then((result) => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });

    });
  }
  static getSampleData() {
    return new Promise((resolve, reject) => {
      SampleModel.aggregate([
        { $match: { finalized: true } },
        { $project: { sampletype: 1 } },
        {
          $group: {
            _id: "$sampletype",
            samples: { $push: "$_id" },
          }
        },
      ]).then((result) => {
        console.log(result);
        let total = 0;

        for (let i = 0; i < result.length; i++)
          total += result[i].samples.length;

        for (let j = 0; j < result.length; j++)
          result[j].frequency = result[j].samples.length / total;


        resolve(result);
      }).catch(err => {
        console.log(err);
        reject(err);
      });
    });
  }
}




module.exports = Sample;
