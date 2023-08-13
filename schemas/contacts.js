const Joi = require("joi");
const { Schema } = require("mongoose");

const phoneRegex =
  /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/;

const addSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": "missing field name" }),
  email: Joi.string().email({ tlds: { allow: false } }),
  phone: Joi.string()
    .regex(phoneRegex)
    .messages({ "string.pattern.base": `Phone number must have 10 digits.` })
    .required(),
  favorite: Joi.boolean(),
});

const favoriteSchema = Joi.object({
  favorite: Joi.boolean()
    .required()
    .messages({ "any.required": "missing field favorite" }),
});

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      pattern: phoneRegex,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports.joiSchema = { addSchema, favoriteSchema };
module.exports.mongooseSchema = contactSchema;
