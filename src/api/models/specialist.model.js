const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../errors/api-error');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

/**
 * Specialist Schema
 * @private
 */
const specialistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: false,
  },  
  crp: {
    type: String,
    //match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    maxlength: 56,
    trim: true,
    lowercase: true,
  },
  approach: {
    type: String,
    maxlength: 256,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    maxlength: 128,
    //index: true,
    trim: true,
  },
}, {
  timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
/*patientSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();

    const rounds = env === 'test' ? 1 : 10;

    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});*/

/**
 * Methods
 */
specialistSchema.method({
  transform() {
    const transformed = {};
    //const fields = ['id', 'name', 'email', 'picture', 'role', 'createdAt'];
    const fields = ['userId', 'crp', 'approach', 'phone'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  /*token() {
    const payload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return jwt.encode(payload, jwtSecret);
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },*/
});

/**
 * Statics
 */
specialistSchema.statics = {

  

  /**
   * Get specialist
   *
   * @param {ObjectId} id - The objectId of specialist.
   * @returns {Promise<Specialist, APIError>}
   */
  async get(id) {
    let specialist;

    if (mongoose.Types.ObjectId.isValid(id)) {
      patient = await this.findById(id).exec();
    }
    if (specialist) {
      return specialist;
    }

    throw new APIError({
      message: 'Specialist does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
   * Find user by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  /*async findAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });

    const user = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (password) {
      if (user && await user.passwordMatches(password)) {
        return { user, accessToken: user.token() };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  },*/

  /**
   * List specialists in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of specialists to be skipped.
   * @param {number} limit - Limit number of specialists to be returned.
   * @returns {Promise<Specialist[]>}
   */
  list({
    //page = 1, perPage = 30, name, email, role,
    page = 1, perPage = 30, crp, approach, phone,
  }) {
    const options = omitBy({ crp, approach, phone }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  checkDuplicate(error) {
    let emailError = false;
    if (!(Object.keys(error).length === 0)) {
        emailError = Object.keys(error.keyPattern).some(obj => obj == "email");
    }
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: emailError ? 'e-mail' : 'crp',
          location: 'body',
          messages: [`${ emailError ? 'e-mail' : 'CRP'} already exists`],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },

  /*async oAuthLogin({
    service, id, email, name, picture,
  }) {
    const user = await this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] });
    if (user) {
      user.services[service] = id;
      if (!user.name) user.name = name;
      if (!user.picture) user.picture = picture;
      return user.save();
    }
    const password = uuidv4();
    return this.create({
      services: { [service]: id }, email, password, name, picture,
    });
  },*/
};

/**
 * @typedef Patient
 */
module.exports = mongoose.model('Specialist', specialistSchema);
