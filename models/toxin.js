const mongoose = require("mongoose");

const toxinSchema = new mongoose.Schema(
  {
    //Nome da toxina
    name: String,
    //Sigla da toxina
    sigle: String,
  },
  { timestamps: true, strict: false }
);

const toxinModel = mongoose.model("Toxin", toxinSchema);

const ToxinActions = {
  async createToxin({ name, sigle }) {
    return toxinModel.create({ name, sigle });
  },

  async updateToxin(id, updateData) {
    return toxinModel.findByIdAndUpdate(id, updateData);
  },
};

module.exports = ToxinActions;