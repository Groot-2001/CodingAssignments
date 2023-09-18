const mongoose = require("mongoose");
const { Snowflake } = require("@theinternetfolks/snowflake");
const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    id: String,
    name: {
      type: String,
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

roleSchema.pre("save", async function (next) {
  //getting the current user object with the help of this
  const role = this;

  let randomNumber = await Snowflake.generate();

  //then add the new unique id
  role.id = randomNumber;
  next();
});

module.exports = mongoose.model("role_model", roleSchema);
