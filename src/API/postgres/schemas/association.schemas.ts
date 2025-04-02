import Joi from "joi";

export const associationIdSchema = Joi.number().integer().required();

export const associationSchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required()
});

export const updateAssociationSchema = Joi.object({
    name: Joi.string(),
    address: Joi.string()
});