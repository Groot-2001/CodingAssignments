const mongoose = require("mongoose");
const { Snowflake } = require("@theinternetfolks/snowflake");
const Schema = mongoose.Schema;

const memberSchema = new Schema(
  {
    id: String,
    community: [
      {
        type: Schema.Types.ObjectId,
        ref: "community_model",
      },
    ],
    user: [
      {
        type: Schema.Types.ObjectId,
        ref: "user_model",
      },
    ],
    role: [
      {
        type: Schema.Types.ObjectId,
        ref: "role_model",
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

memberSchema.pre("save", async function (next) {
  //getting the current user object with the help of this
  const member = this;

  let randomNumber = await Snowflake.generate();

  //then add the new unique id
  member.id = randomNumber;
  next();
});

module.exports = mongoose.model("member_model", memberSchema);
