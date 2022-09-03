const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/patient.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listPatients,
  createPatient,
  replacePatient,
  updatePatient,
} = require('../../validations/patient.validation');

const router = express.Router();

/**
 * Load patient when API with patientId route parameter is hit
 */
router.param('patientId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/patients List Patients
   * @apiDescription Get a list of patients
   * @apiVersion 1.0.0
   * @apiName ListPatients
   * @apiGroup Patient 
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Patient's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Patients per page
   * @apiParam  {String}             [name]       Patient's name
   * @apiParam  {String}             [email]      Patients's email
   * @apiParam  {String=patient,admin}  [role]       Patients's role
   *
   * @apiSuccess {Object[]} patients List of users.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated patients can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(ADMIN), validate(listPatients), controller.list)
  /**
   * @api {post} v1/patients Create Patient
   * @apiDescription Create a new patient
   * @apiVersion 1.0.0
   * @apiName CreatePatient
   * @apiGroup Patient
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Patient's access token
   *
   * @apiParam  {String}             email     Patient's email
   * @apiParam  {String{6..128}}     password  Patient's password
   * @apiParam  {String{..128}}      [name]    Patient's name
   * @apiParam  {String=patient,admin}  [role]    Patient's role
   *
   * @apiSuccess (Created 201) {String}  id         Patient's id
   * @apiSuccess (Created 201) {String}  name       Patient's name
   * @apiSuccess (Created 201) {String}  email      Patient's email
   * @apiSuccess (Created 201) {String}  role       Patient's role
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated patients can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(createPatient), controller.create);

router
  .route('/profile')
  /**
   * @api {get} v1/patients/profile Patient Profile
   * @apiDescription Get logged in patient profile information
   * @apiVersion 1.0.0
   * @apiName PatientProfile
   * @apiGroup Patient
   * @apiPermission patient
   *
   * @apiHeader {String} Authorization   Patient's access token
   *
   * @apiSuccess {String}  id         Patient's id
   * @apiSuccess {String}  name       Patient's name
   * @apiSuccess {String}  email      Patient's email
   * @apiSuccess {String}  role       Patient's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Patients can access the data
   */
  .get(authorize(), controller.loggedIn);

router
  .route('/:patientId')
  /**
   * @api {get} v1/patients/:id Get Patient
   * @apiDescription Get patient information
   * @apiVersion 1.0.0
   * @apiName GetPatient
   * @apiGroup Patient
   * @apiPermission patient
   *
   * @apiHeader {String} Authorization   Patient's access token
   *
   * @apiSuccess {String}  id         Patient's id
   * @apiSuccess {String}  name       Patient's name
   * @apiSuccess {String}  email      Patient's email
   * @apiSuccess {String}  role       Patient's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated patients can access the data
   * @apiError (Forbidden 403)    Forbidden    Only patient with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Patient does not exist
   */
  .get(authorize(LOGGED_USER), controller.get)
  /**
   * @api {put} v1/patients/:id Replace Patient
   * @apiDescription Replace the whole patient document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplacePatient
   * @apiGroup Patient
   * @apiPermission patient
   *
   * @apiHeader {String} Authorization   Patient's access token
   *
   * @apiParam  {String}             email     Patient's email
   * @apiParam  {String{6..128}}     password  Patient's password
   * @apiParam  {String{..128}}      [name]    Patient's name
   * @apiParam  {String=patient,admin}  [role]    Patient's role
   * (You must be an admin to change the patient's role)
   *
   * @apiSuccess {String}  id         Patient's id
   * @apiSuccess {String}  name       Patient's name
   * @apiSuccess {String}  email      Patient's email
   * @apiSuccess {String}  role       Patient's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated patients can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only patient with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Patient does not exist
   */
  .put(authorize(LOGGED_USER), validate(replacePatient), controller.replace)
  /**
   * @api {patch} v1/patients/:id Update Patient
   * @apiDescription Update some fields of a patient document
   * @apiVersion 1.0.0
   * @apiName UpdatePatient
   * @apiGroup Patient
   * @apiPermission patient
   *
   * @apiHeader {String} Authorization   Patient's access token
   *
   * @apiParam  {String}             email     Patient's email
   * @apiParam  {String{6..128}}     password  Patient's password
   * @apiParam  {String{..128}}      [name]    Patient's name
   * @apiParam  {String=patient,admin}  [role]    Patient's role
   * (You must be an admin to change the patient's role)
   *
   * @apiSuccess {String}  id         Patient's id
   * @apiSuccess {String}  name       Patient's name
   * @apiSuccess {String}  email      Patient's email
   * @apiSuccess {String}  role       Patient's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated patients can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only patient with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Patient does not exist
   */
  .patch(authorize(LOGGED_USER), validate(updatePatient), controller.update)
  /**
   * @api {patch} v1/patients/:id Delete Patient
   * @apiDescription Delete a patient
   * @apiVersion 1.0.0
   * @apiName DeletePatient
   * @apiGroup Patient
   * @apiPermission patient
   *
   * @apiHeader {String} Authorization   Patient's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated patients can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only patient with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Patient does not exist
   */
  .delete(authorize(LOGGED_USER), controller.remove);

module.exports = router;
