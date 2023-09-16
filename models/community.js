const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const communitySchema = new Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      minLength: [2, "Name should contain at least two characters!"],
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    owner: [
      {
        type: Schema.Types.ObjectId,
        ref: "user_model",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("community_model", communitySchema);
