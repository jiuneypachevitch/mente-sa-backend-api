const Joi = require('joi');
const Specialist = require('../models/specialist.model');

module.exports = {

  // GET /v1/specialists
  listSpecialists: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100), 
      userId: Joi.string().label('specialistId'),
      email: Joi.string(),
      name: Joi.string(),
      crp: Joi.string(),
      approach: Joi.string(),
      phone: Joi.string(),
    },
  },

  // POST /v1/specialists
  createSpecialist: {
    body: {
      //specialistId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      email: Joi.string().email().required(),
      name: Joi.string().max(128).required(),
      password: Joi.string().min(6).max(128).required(),
      //confirmpassword: Joi.string().min(6).max(128).required(),
      confirmpassword: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } }),
      crp: Joi.string().max(56).required(),
      approach: Joi.string().max(256).required(),
      phone: Joi.string().max(16).required(),
    },
  },

  // PUT /v1/specialists/:specialistId
  replaceSpecialist: {
    body: { 
      email: Joi.string().email().required(),
      name: Joi.string().max(128),
      crp: Joi.string().max(56).required(),
      approach: Joi.string().max(256).required(),
      phone: Joi.string().max(128).required(),
    },
    params: {
      specialistId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/specialists/:specialistId
  updateSpecialist: {
    body: {
      email: Joi.string().email().required(),
      name: Joi.string().max(128),
      crp: Joi.string().max(56).required(),
      approach: Joi.string().max(256).required(),
      phone: Joi.string().max(128).required(),
    },
    params: {
      specialistId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
