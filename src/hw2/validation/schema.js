import Joi from '@hapi/joi';

const regLettersAndNumbers = new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])');

export const schema = Joi.object({
    age: Joi.number()
        .integer()
        .min(4)
        .max(130)
        .required(),

    login: Joi.string().required(),

    password: Joi.string()
        .pattern(regLettersAndNumbers)
        .required()
});
