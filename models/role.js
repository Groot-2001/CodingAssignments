const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    id: String,
    name: String,
    scopes: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("role_model", roleSchema);
