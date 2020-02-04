const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var data = new Date();
var yyyy = data.getFullYear();

const counterSchema = new mongoose.Schema({
    lastYear: Number,
    sampleCount: Number,
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

    static testAndResolveCounter(currentYear) {
        return new Promise((resolve, reject) => {
            Counter.getCounter().then((Contador) => {

                if (Contador == null)
                    Counter.create().then((valor) => CounterUpdate(valor));
                else
                    CounterUpdate(Contador);

                function CounterUpdate(params) {
                    if (params.lastYear < currentYear) {
                        Counter.resetCounter(params._id, currentYear);
                        resolve(params.sampleCount);
                    } else {
                        Counter.updateCounter(params);
                        resolve(params.sampleCount);
                    }
                }
            });
        });
    }



    static resetCounter(id, currentYear) {
        return new Promise((resolve, reject) => {
            CounterModel.update(
                { _id: id },
                {
                    $set: { 'lastYear': currentYear, 'sampleCount': 1 }
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
        CounterModel.update(
            { _id: counter._id },
            {
                $set: { 'sampleCount': num },
            });
    }
}

module.exports = Counter;