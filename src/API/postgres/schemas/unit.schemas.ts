import Joi from "joi";

export const unitIdSchema = Joi.number().integer().required();

export const unitSchema = Joi.object({
    name: Joi.string().required(),
    association_id: Joi.number().integer().required()
});