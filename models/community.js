const mongoose = require("mongoose");
const { Snowflake } = require("@theinternetfolks/snowflake");
const Schema = mongoose.Schema;

const communitySchema = new Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
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

communitySchema.pre("save", async function (next) {
  //getting the current user object with the help of this
  const community = this;

  let randomNumber = await Snowflake.generate();

  //then add the new unique id
  community.id = randomNumber;
  next();
});

module.exports = mongoose.model("community_model", communitySchema);
