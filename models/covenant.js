const mongoose = require('mongoose');

const covenantSchema = new mongoose.Schema({
    name: String,
    managers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const CovenantModel = mongoose.model('Covenant', covenantSchema);

class Covenant {
    static getAll() {
        return new Promise((resolve, reject) => {
            CovenantModel.find({})
                .populate({ path: 'managers', model: 'User' })
                .populate({ path: 'admin', model: 'User'})
                .then((results) => {
                    resolve(results);
                })
        }).catch((err) => {
            reject(err);
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            CovenantModel.findById(id)
                .populate({ path: 'managers', model: 'User' })
                .populate({ path: 'associatedProducers', model: 'User' })
                .then((result) => {
                    resolve(result);
                })
        }).catch((err) => {
            reject(err);
        })
    }

    static create(covenant) {
        return new Promise((resolve, reject) => {
            CovenantModel.create(covenant).then((result) => {
                resolve(result);
            })
        }).catch((err) => {
            reject(err);
        })
    }

    static addManagers(id, Managers) {
        return new Promise((resolve, reject) => {
            CovenantModel.findByIdAndUpdate(id, { $addToSet: { managers: Managers } }).then((result) => {
                resolve(result);
            })
        }).catch((err) => {
            reject(err);
        })
    }

    static removeManager(covenantId, managerId) {
        return new Promise((resolve, reject) => {
            console.log("entrou no delete");
            CovenantModel.findByIdAndUpdate(covenantId, { $pull: { managers: managerId } }).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            CovenantModel.findOneAndDelete(id).then((result) => {
                resolve(result);
            })
        })
    }
}

module.exports = Covenant;