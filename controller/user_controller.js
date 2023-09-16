const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { signUpValidate, signInValidate } = require("../middleware/validate");

exports.signUp = async (req, res) => {
  try {
    //sanitize the request body using joi validation
    const result = await signUpValidate.validateAsync(req.body);

    //if email is already exists
    const doesExist = await User.findOne({ email: result.email });

    if (doesExist) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "email",
            message: "User with this email address already exists.",
            code: "RESOURCE_EXISTS",
          },
        ],
      });
    }

    //creating the valid user
    const user = new User({
      name: result.name,
      email: result.email,
      password: result.password,
    });

    //save the user
    const savedUser = await user.save();

    //exclude unneccessary before populating the data
    const { password, email, ...responseUser } = savedUser._doc;

    //generating the token
    const token = jwt.sign(responseUser, process.env.jwtSecretKey);

    //if all goes well then
    res.status(200).json({
      status: true,
      content: {
        data: responseUser,
      },
      meta: {
        access_token: token,
      },
    });
  } catch (error) {
    console.log(error);

    //if joi throws any input validation errors
    if (!error.errors) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: error.details[0].path[0],
            message: error.details[0].message,
            code: "INVALID_INPUT",
          },
        ],
      });
    }

    //if the error is not related to user
    return res.status(500).json({
      status: false,
      errors: error.errors,
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    //sanitize the request body using joi validation
    const result = await signInValidate.validateAsync(req.body);

    const doesExist = await User.findOne({ email: result.email });

    //if email is doesn't exists
    if (!doesExist) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "email",
            message: "Please provide a valid email address.",
            code: "INVALID_INPUT",
          },
        ],
      });
    }

    //comparing the password if its correct or not
    const validatePassword = await bcrypt.compare(
      result.password,
      doesExist.password
    );

    //if password is invalid
    if (!validatePassword) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "password",
            message: "The credentials you provided are invalid.",
            code: "INVALID_CREDENTIALS",
          },
        ],
      });
    }

    //exclude unneccessary before populating the data
    const { password, ...responseUser } = doesExist._doc;

    //generating the token
    const token = jwt.sign(responseUser, process.env.jwtSecretKey);

    res.status(200).json({
      status: true,
      content: {
        data: responseUser,
      },
      meta: {
        access_token: token,
      },
    });
  } catch (error) {
    console.error(error);
    //if joi throws any input validation errors
    if (!error.errors) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: error.details[0].path[0],
            message: error.details[0].message,
            code: "INVALID_INPUT",
          },
        ],
      });
    }

    //if the error is not related to user
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
