const Joi = require("joi");

const signUpValidate = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp("^[a-zA-Z0-9]{6,}$"))
    .required(),
});

const signInValidate = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp("^[a-zA-Z0-9]{6,}$"))
    .required(),
});

module.exports = {
  signUpValidate,
  signInValidate,
};
