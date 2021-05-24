const mongoose = require("mongoose");

const toxinSchema = new mongoose.Schema(
  {
    //Nome da toxina
    name: String,
    //Sigla da toxina
    sigle: String,
    //Toxina em formula minúscula
    lower: String,
  },
  { timestamps: true, strict: false }
);

const ToxinModel = mongoose.model("Toxin", toxinSchema);

const ToxinActions = {
  async createToxin({ name, sigle }) {
    const result = await ToxinModel.create({ name, sigle });
    return result;
  },

  async updateToxin(id, updateData) {
    const result = await ToxinModel.findByIdAndUpdate(id, updateData);
    return result;
  },

  async getAll() {
    const result = await ToxinModel.find();
    return result;
  }
};

module.exports = ToxinActions;