import joi from "joi";

export const sendRegistersSchema = joi.object({
    description: joi.string().max(100).required(),
    value: joi.number().positive().required(),
    type: joi.string().valid("entrada", "saida").required(),
});

export const updateRegistersSchema = joi.object({
    description: joi.string().max(100).required(),
    value: joi.number().positive().required(),
    type: joi.string().valid("entrada", "saida").required(),
});
