const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
require("dotenv").config();

const userAuthenticate = async (req, res, next) => {
  let token;
  //* The best HTTP header for your client to send an access token
  //* (JWT or any other token) is the Authorization header with the Bearer authentication scheme.

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //* get the token from authorization header
      // req.headers.authorization header should looks like "Bearer ssdlfsdfklnvsoiweijlclxkjljasflldfjldjlfj"
      // we need to seperate them and take the token part only.
      token = req.headers.authorization.split(" ")[1];

      //if there is no token we need to handle this out.
      if (!token) {
        res.status(401).json({ message: "No token found!" });
      }

      //verifying the token
      jwt.verify(token, process.env.jwtSecretKey, async (err, decode) => {
        if (err) {
          //what if token is Invalid
          return res.status(401).json({
            message: "Invalid token !,please enter the correct one.",
          });
        }
        //save the current user as authenticated in response body
        req.user = await userModel.findOne({
          email: decode.email,
        });
        //all work done just proceed with next one.
        next();
      });
    } catch (error) {
      //incase any error generated
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    //if there is no token we need to handle this out.
    if (!token) {
      return res.status(401).json({
        status: false,
        errors: [
          {
            message: "You need to sign in to proceed.",
            code: "NOT_SIGNEDIN",
          },
        ],
      });
    }
  }
};

module.exports = userAuthenticate;
