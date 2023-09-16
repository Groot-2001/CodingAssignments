const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const communitySchema = new Schema(
  {
    id: String,
    name: String,
    slug: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user_model",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("community_model", communitySchema);
