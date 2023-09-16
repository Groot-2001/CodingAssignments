const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memberSchema = new Schema(
  {
    id: String,
    community: {
      type: Schema.Types.ObjectId,
      ref: "community_model",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user_model",
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "role_model",
    },
  },
  {
    timestamps: { createdAt: "created_at" },
    versionKey: false,
  }
);

module.exports = mongoose.model("member_model", memberSchema);
