const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    id: String,
    name: String,
    email: String,
    password: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("user_model", userSchema);
