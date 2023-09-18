const mongoose = require("mongoose");
const { Snowflake } = require("@theinternetfolks/snowflake");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    id: String,
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  //getting the current user object with the help of this
  const user = this;

  let randomNumber = await Snowflake.generate();

  //Checking whether the password field is modified or not
  if (!user.isModified("password")) {
    return next();
  }

  //hashed the password with salt of 10 Rounds
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;

  user.id = randomNumber;
  next();
});

//comparing passwords by creating instace method
/**
 *  the isValidPassword function would be called when a user attempts to log in to the application.
 */
userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(user.password, password);
  return compare;
};

module.exports = mongoose.model("user_model", userSchema);
