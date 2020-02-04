const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

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
            CounterModel.find({}).populate('counter').exec().then((results) => {
                resolve(results);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static testAndResolveCounter(currentYear) {
        var Contador = Counter.getCounter();
        if (Contador == null) {
            Counter.create();
            Counter.testAndResolveCounter(currentYear);
        } else if (Contador.lastYear < currentYear) {
            Counter.resetCounter(Contador._id, currentYear);
            return Contador.sampleCount;
        } else {
            Counter.updateCounter(Contador);
            return Contador.sampleCount;
        }
    }

    static resetCounter(id, currentYear) {
        return new Promise((resolve, reject) => {
            CounterModel.update(
                { _id: id },
                {
                    $set: { 'lastYear': currentYear, 'sampleCount': 1}
                }).then((result) => {
                    resolve(result);
                }).catch(err => {
                    reject(err);
                });
        });
    }

    static create(){
        return new Promise((resolve, reject) => {
            CounterModel.create().then((result) => {
                resolve(result._id);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static updateCounter(counter){
        var num = counter.sampleCount + 1;
        CounterModel.update(
            { _id: counter._id },
            {
                $set: { 'sampleCount': num },
            });
    }
}

module.exports = Counter;