import Joi from "joi";

export const userIdSchema = Joi.number().integer().required();

export const userEmailSchema = Joi.string().email().required();

export const createUserSchema = Joi.object({
    names: Joi.string().required(),
    lastNames: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
    names: Joi.string().optional(),
    lastNames: Joi.string().optional(),
    email: Joi.string().email().optional(),
});

export const userRoleSchema = Joi.string().valid('owner', 'resident').required();