const Joi = require('joi');

const currentYear = new Date().getFullYear();
const SongsSchemaPayload = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().min(1900).max(currentYear).required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

module.exports = { SongsSchemaPayload };
