import Joi from "joi";

export const bookingSchema = Joi.object({
    date: Joi.date().required(),
    timeStart: Joi.string().required(),
    timeEnd: Joi.string().required()
});