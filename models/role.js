const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    id: String,
    name: {
      type: String,
      minLength: [2, "Name should contain at least two characters!"],
      trim: true,
      required: true,
    },
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
