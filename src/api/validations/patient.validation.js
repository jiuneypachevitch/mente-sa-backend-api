const Joi = require('joi');
const Patient = require('../models/patient.model');

module.exports = {

  // GET /v1/patients
  listPatients: {
    query: {
        page: Joi.number().min(1),
        perPage: Joi.number().min(1).max(100), 
        specialistId: Joi.string(),
        email: Joi.string(),
        name: Joi.string(),
        cpf: Joi.string(),
        birthDay: Joi.string(),
        phone: Joi.string(),
        address: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        gender: Joi.string().valid(Patient.genders),
    },
  },

  // POST /v1/patients
  createPatient: {
    body: {
        specialistid: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(), 
        email: Joi.string().email().required(),
        name: Joi.string().max(128).required(),
        cpf: Joi.string().max(16).required(),
        birthday: Joi.string().min(10).max(10).required(),
        phone: Joi.string().max(16).required(),
        address: Joi.string().max(128).required(),
        city: Joi.string().max(56).required(),
        state: Joi.string().max(56).required(),
        gender: Joi.string().valid(Patient.genders),
    },
  },

  // PUT /v1/patients/:patientId
  replacePatient: {
    body: { 
        email: Joi.string().email().required(),
        name: Joi.string().max(128).required(),
        cpf: Joi.string().max(16).required(),
        birthDay: Joi.string().min(10).max(10).required(),
        phone: Joi.string().max(16).required(),
        address: Joi.string().max(128).required(),
        city: Joi.string().max(56).required(),
        state: Joi.string().max(56).required(),
        gender: Joi.string().valid(Patient.genders),
    },
    params: {
      patientId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/patients/:patientId
  updatePatient: {
    body: {
        email: Joi.string().email().required(),
        name: Joi.string().max(128).required(),
        cpf: Joi.string().max(16).required(),
        birthDay: Joi.string().min(10).max(10).required(),
        phone: Joi.string().max(16).required(),
        address: Joi.string().max(128).required(),
        city: Joi.string().max(56).required(),
        state: Joi.string().max(56).required(),
        gender: Joi.string().valid(Patient.genders),
    },
    params: {
      patientId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
