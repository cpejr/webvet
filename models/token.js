const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  service: {
    type: String,
    default: "google_mail",
  },
  token: {
    type: Object,
    required: true,
  },
});

const Token = mongoose.model("Token", tokenSchema);
let token;

const TokenActions = {
  async getToken(service) {
    const result = await Token.findOne({ service });
    return result;
  },

  async updateOrCreateToken(service, newTokenFields) {

    const newFieldsToUpdate = {};
    Object.keys(newTokenFields).forEach((key) => {
      newFieldsToUpdate[`token.${key}`] = newTokenFields[key];
    });

    const result = await Token.findOneAndUpdate(
      { service },
      { $set: newFieldsToUpdate }
    );
    if (!result) return await Token.create({ service, token: newTokenFields });
    else return result;
  },
};

module.exports = TokenActions;
