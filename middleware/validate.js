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

const makeCommunity = Joi.object({
  name: Joi.string().min(3).required(),
});

const makeRole = Joi.object({
  name: Joi.string().min(2).required(),
});

const makeMember = Joi.object({
  community: Joi.string().empty().required(),
  user: Joi.string().empty().required(),
  role: Joi.string().empty().required(),
});

const removeMemeber = Joi.object({
  params: Joi.object({
    id: Joi.string().empty().required(),
  }),
});

module.exports = {
  signUpValidate,
  signInValidate,
  makeCommunity,
  makeRole,
  makeMember,
  removeMemeber,
};
