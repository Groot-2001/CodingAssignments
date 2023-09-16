const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memberSchema = new Schema(
  {
    id: {
      type: String,
    },
    community: [
      {
        type: Schema.Types.ObjectId,
        ref: "community_model",
        required: true,
      },
    ],
    user: [
      {
        type: Schema.Types.ObjectId,
        ref: "user_model",
        required: true,
      },
    ],
    role: [
      {
        type: Schema.Types.ObjectId,
        ref: "role_model",
        required: true,
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at" },
    versionKey: false,
  }
);

module.exports = mongoose.model("member_model", memberSchema);
