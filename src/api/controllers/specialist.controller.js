const httpStatus = require('http-status');
const { omit } = require('lodash');
const Specialist = require('../models/specialist.model');
const User = require('../models/user.model');

/**
 * Load specialist and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const specialist= await Specialist.get(id);
    req.locals = { specialist };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get specialist
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in specialist info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new specialist
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    // User fields  
    const { name, email, password, confirmpassword } = req.body;
    // specialist fields
    const { crp, approach, phone } = req.body;
    // User body
    const userBody = {name, email, password, "usertype": "specialist", "role": "admin" };
    // Save new User
    const user = new User(userBody);
    const savedUser = await user.save();
    // Specialist body
    const specialistBody = {crp, approach, phone, "userId": savedUser._id };
    const specialist = new Specialist(specialistBody);
    let savedSpecialist = await specialist.save();
    res.status(httpStatus.CREATED);
    res.json(savedSpecialist.transform());
  } catch (error) {
    if (!(Object.keys(error).length === 0)) {
        if (!(Object.keys(error.keyPattern).some(obj => obj == "email"))) {
            const { name, email } = req.body;
            const user = (await User.findOne({ name, email }));
            user.remove();
        }
    }
    next(Specialist.checkDuplicate(error));
  }
};

/**
 * Replace existing specialist
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { specialist } = req.locals;
    const newSpecialist = new Specialist(req.body);
    const ommitRole = specialist.role !== 'admin' ? 'role' : '';
    const newSpecialistObject = omit(newSpecialist.toObject(), '_id', ommitRole);

    await specialist.updateOne(newSpecialistObject, { override: true, upsert: true });
    const savedSpecialist = await Specialist.findById(specialist._id);

    res.json(savedSpecialist.transform());
  } catch (error) {
    next(Specialist.checkDuplicateCpf(error));
  }
};

/**
 * Update existing specialist
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.specialist.role !== 'admin' ? 'role' : '';
  const updatedSpecialist = omit(req.body, ommitRole);
  const user = Object.assign(req.locals.specialist, updatedSpecialist);

  specialist.save()
    .then((savedSpecialist) => res.json(savedSpecialist.transform()))
    .catch((e) => next(Specialist.checkDuplicateCpf(e)));
};

/**
 * Get specialist list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const specialists = await Specialist.list(req.query);
    const transformedSpecialists = specialists.map((specialist) => specialist.transform());
    res.json(transformedSpecialists);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete specialist
 * @public
 */
exports.remove = (req, res, next) => {
  const { specialist } = req.locals;

  specialist.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};
