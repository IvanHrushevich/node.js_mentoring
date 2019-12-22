import Joi from '@hapi/joi';

export const schema = Joi.object({
  age: Joi.number()
    .integer()
    .min(4)
    .max(130)
    .required(),

  login: Joi.string().required(),

  password: Joi.string()
    .alphanum()
    .required()
});
