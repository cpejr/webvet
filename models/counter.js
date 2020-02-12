const mongoose = require('mongoose');
var data = new Date();
var yyyy = data.getFullYear();

const counterSchema = new mongoose.Schema({
    lastYear: Number,
    sampleCount: Number,
    requisitionCount: Number,
    counterName: {
        type: String,
        default: 'Contador padrão'
    },
}, { timestamps: true, strict: false });

const CounterModel = mongoose.model('Counter', counterSchema);

class Counter {
    /* Gets the current counter from database as a singular {object} of counter*/
    static getCounter() {
        return new Promise((resolve, reject) => {
            CounterModel.findOne({}).populate('counter').exec().then((results) => {
                resolve(results);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static resetCounter(id, currentYear) {
        return new Promise((resolve, reject) => {
            CounterModel.update({ _id: id },
                {
                    $set: { 'lastYear': currentYear, 'sampleCount': 1, 'requisitionCount': 1 } // Reiniciar sampleCount e requisitionCount
                }).then((result) => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                });
        });
    }

    static create() {
        const Contador = {
            lastYear: yyyy,
            sampleCount: 1,
            requisitionCount: 1,
            counterName: 'Contador padrão'
        }

        return new Promise((resolve, reject) => {
            CounterModel.create(Contador).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static updateCounter(counter) {
        var num = counter.sampleCount + 1;
        CounterModel.update({ _id: counter._id }, { $set: { 'sampleCount': num } });
    }

    static setSampleCount(num) {
        CounterModel.findOneAndUpdate({}, { $set: { 'sampleCount': num } }).exec().catch(err => console.log(err));
    }

    static setRequisitionCount(num) {
        CounterModel.findOneAndUpdate({}, { $set: { 'requisitionCount': num } }).exec().catch(err => console.log(err));
    }

    static getSampleCount() {
        return new Promise((resolve, reject) => {
            CounterModel.findOne({}).then((result) => {

                if (result != null)
                    sendValue(result, this)
                else
                    this.create().then((result) => sendValue(result, this));

                function sendValue(counter, reference) {
                    //Verificar se o ano mudou
                    if (counter.lastYear < yyyy) {
                        counter.sampleCount = 1;
                        reference.resetCounter(counter._id, yyyy);
                    }

                    //Previnir de erros
                    if (Number.isNaN(counter.sampleCount) || typeof counter.sampleCount === "undefined")
                        counter.sampleCount = 1;

                    resolve(counter.sampleCount);
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static getRequisitionCount() {
        return new Promise((resolve, reject) => {
            CounterModel.findOne({}).then((result) => {

                if (result != null)
                    sendValue(result, this)
                else
                    this.create().then((result) => sendValue(result, this));

                function sendValue(counter, reference) {
                    //Verificar se o ano mudou
                    if (counter.lastYear < yyyy) {
                        counter.requisitionCount = 1;
                        reference.resetCounter(counter._id, yyyy);
                    }

                    //Previnir de erros
                    if (Number.isNaN(counter.requisitionCount) || typeof counter.requisitionCount === "undefined")
                        counter.requisitionCount = 1;

                    resolve(counter.requisitionCount);
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }
}

module.exports = Counter;