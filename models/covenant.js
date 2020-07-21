const mongoose = require('mongoose');

const UserModel = require("./user");

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
                .populate({ path: 'admin', model: 'User' })
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
                .populate({ path: 'admin', model: 'User' })
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
            CovenantModel.findByIdAndUpdate(covenantId, { $pull: { managers: managerId } }).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static async getRelatedIds(userId, associated) {
        try {
            console.log("Imprimindo Id do usuario que logou: ", userId);
            const covenant = await CovenantModel.findOne({ $or: [{ admin: userId }, {managers: {$all: [userId] }}] })
                .populate({ path: 'managers', model: 'User' })
                .populate({ path: 'admin', model: 'User' });

            let result = [userId];

            const { admin, managers } = covenant;
            const { _id } = admin;
            console.log("Imprimindo Id admin do convênio: ", _id);
            console.log("covenant: ", covenant);
            if (_id.equals(userId)) { //Is Admin
                console.log("E admin");
                let managedProducers = managers.associatedProducers;
                result = [...result, ...managedProducers, ...admin.associatedProducers];
                return result;
            } else { //Is not Admin
                console.log("Nao e admin")
                result = [...result, ...managedProducers];
                return result;
            }
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            CovenantModel.findByIdAndDelete(id).then((result) => {
                console.log("Resultado do delete: ", result);
                let users = result.managers;
                users.push(result.admin);
                resolve(users);
            })
        })
    }
}

module.exports = Covenant;