const mongoose = require("mongoose");

const covenantSchema = new mongoose.Schema({
  name: String,
  managers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const CovenantModel = mongoose.model("Covenant", covenantSchema);

class Covenant {
  static getAll() {
    return new Promise((resolve, reject) => {
      CovenantModel.find({})
        .populate({ path: "managers", model: "User" })
        .populate({ path: "admin", model: "User" })
        .then((results) => {
          resolve(results);
        });
    }).catch((err) => {
      reject(err);
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      CovenantModel.findById(id)
        .populate({ path: "managers", model: "User" })
        .populate({ path: "admin", model: "User" })
        .then((result) => {
          resolve(result);
        });
    }).catch((err) => {
      reject(err);
    });
  }

  static create(covenant) {
    return new Promise((resolve, reject) => {
      CovenantModel.create(covenant).then((result) => {
        resolve(result);
      });
    }).catch((err) => {
      reject(err);
    });
  }

  static addManagers(id, Managers) {
    return new Promise((resolve, reject) => {
      CovenantModel.findByIdAndUpdate(id, {
        $addToSet: { managers: Managers },
      }).then((result) => {
        resolve(result);
      });
    }).catch((err) => {
      reject(err);
    });
  }

  static removeManager(covenantId, managerId) {
    return new Promise((resolve, reject) => {
      CovenantModel.findByIdAndUpdate(covenantId, {
        $pull: { managers: managerId },
      })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static async getRelatedIdsAndConvName(userId, associated) {
    try {
      const covenant = await CovenantModel.findOne({
        $or: [{ admin: userId }, { managers: { $all: [userId] } }],
      })
        .populate({ path: "managers", model: "User" })
        .populate({ path: "admin", model: "User" });

      const { admin, managers, name } = covenant;
      const { _id } = admin;
      if (_id.equals(userId)) {
        //Is Admin
        //Vai percorrer todos os gerentes e concatenar os vetores de produtores associados.
        //new Set([]) retira repetições
        let managedProducers = new Array();
        for (const manager of managers) {
          managedProducers = managedProducers.concat(
            manager.associatedProducers
          );
        }
        //Concatena com os produtores diretamente associados ao admin e retorna, somando o proprio Id.
        return { ids: [...new Set([...managedProducers, ...associated, userId])], name };
      } else {
        //Is not Admin
        //Retorna o proprio ID e seus produtores associados, gerente nao tem acesso a outros gerentes nem admin.
        return { ids: [userId, ...associated], name };
      }
    } catch (err) {
      console.warn(err);
      return null;
    }
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      CovenantModel.findByIdAndDelete(id).then((result) => {
        let users = result.managers;
        users.push(result.admin);
        resolve(users);
      });
    });
  }
}

module.exports = Covenant;
