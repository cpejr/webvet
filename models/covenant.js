const mongoose = require('mongoose');

const covenantSchema = new mongoose.Schema({
    name: String,
    managers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

const CovenantModel = mongoose.model('Covenant', covenantSchema);

class Covenant {
    static getAll() {
        return new Promise((resolve, reject) => {
            CovenantModel.find({}).populate('User').then((results) => {
                resolve(results);
            })
        }).catch((err) => {
            reject(err);
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) =>{
            CovenantModel.findById(id).populate('User').then((result) =>{
                console.log(result);
                resolve(result);
            })
        }).catch((err) =>{
            reject(err);
        })
    }

    static create(covenant) {
        return new Promise((resolve, reject) =>{
            CovenantModel.create(covenant).then((result) =>{
                resolve(result);
            })
        }).catch((err) =>{
            reject(err);
        })
    }

    static addManagers(id, managers) {
        return new Promise((resolve, reject) =>{
            CovenantModel.findByIdAndUpdate(id, {$push: {managers: managers}})
        }).catch((err) =>{
            reject(err);
        })
    }
}

module.exports = Covenant;