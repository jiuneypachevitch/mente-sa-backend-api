const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/specialist.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  listSpecialists,
  createSpecialist,
  replaceSpecialist,
  updateSpecialist,
} = require('../../validations/specialist.validation');

const router = express.Router();

/**
 * Load specialist when API with specialistId route parameter is hit
 */
router.param('specialistId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/specialists List Specialists
   * @apiDescription Get a list of specialists
   * @apiVersion 1.0.0
   * @apiName ListSpecialists
   * @apiGroup Specialist 
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Specialist's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Specialists per page
   * @apiParam  {String}             [name]       Specialist's name
   * @apiParam  {String}             [email]      Specialists's email
   * @apiParam  {String=specialist,admin}  [role]       Specialists's role
   *
   * @apiSuccess {Object[]} specialists List of users.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated specialists can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(ADMIN), validate(listSpecialists), controller.list)
  /**
   * @api {post} v1/specialists Create Specialist
   * @apiDescription Create a new specialist
   * @apiVersion 1.0.0
   * @apiName CreateSpecialist
   * @apiGroup Specialist
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Specialist's access token
   *
   * @apiParam  {String}             email     Specialist's email
   * @apiParam  {String{6..128}}     password  Specialist's password
   * @apiParam  {String{..128}}      [name]    Specialist's name
   * @apiParam  {String=specialist,admin}  [role]    Specialist's role
   *
   * @apiSuccess (Created 201) {String}  id         Specialist's id
   * @apiSuccess (Created 201) {String}  name       Specialist's name
   * @apiSuccess (Created 201) {String}  email      Specialist's email
   * @apiSuccess (Created 201) {String}  role       Specialist's role
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated specialists can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(validate(createSpecialist), controller.create);

router
  .route('/profile')
  /**
   * @api {get} v1/specialists/profile Specialist Profile
   * @apiDescription Get logged in specialist profile information
   * @apiVersion 1.0.0
   * @apiName SpecialistProfile
   * @apiGroup Specialist
   * @apiPermission specialist
   *
   * @apiHeader {String} Authorization   Specialist's access token
   *
   * @apiSuccess {String}  id         Specialist's id
   * @apiSuccess {String}  name       Specialist's name
   * @apiSuccess {String}  email      Specialist's email
   * @apiSuccess {String}  role       Specialist's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Specialists can access the data
   */
  .get(authorize(), controller.loggedIn);

router
  .route('/:specialistId')
  /**
   * @api {get} v1/specialists/:id Get Specialist
   * @apiDescription Get specialist information
   * @apiVersion 1.0.0
   * @apiName GetSpecialist
   * @apiGroup Specialist
   * @apiPermission specialist
   *
   * @apiHeader {String} Authorization   Specialist's access token
   *
   * @apiSuccess {String}  id         Specialist's id
   * @apiSuccess {String}  name       Specialist's name
   * @apiSuccess {String}  email      Specialist's email
   * @apiSuccess {String}  role       Specialist's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated specialists can access the data
   * @apiError (Forbidden 403)    Forbidden    Only specialist with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Specialist does not exist
   */
  .get(authorize(LOGGED_USER), controller.get)
  /**
   * @api {put} v1/specialists/:id Replace Specialist
   * @apiDescription Replace the whole specialist document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceSpecialist
   * @apiGroup Specialist
   * @apiPermission specialist
   *
   * @apiHeader {String} Authorization   Specialist's access token
   *
   * @apiParam  {String}             email     Specialist's email
   * @apiParam  {String{6..128}}     password  Specialist's password
   * @apiParam  {String{..128}}      [name]    Specialist's name
   * @apiParam  {String=specialist,admin}  [role]    Specialist's role
   * (You must be an admin to change the specialist's role)
   *
   * @apiSuccess {String}  id         Specialist's id
   * @apiSuccess {String}  name       Specialist's name
   * @apiSuccess {String}  email      Specialist's email
   * @apiSuccess {String}  role       Specialist's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated specialists can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only specialist with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Specialist does not exist
   */
  .put(authorize(LOGGED_USER), validate(replaceSpecialist), controller.replace)
  /**
   * @api {patch} v1/specialists/:id Update Specialist
   * @apiDescription Update some fields of a specialist document
   * @apiVersion 1.0.0
   * @apiName UpdateSpecialist
   * @apiGroup Specialist
   * @apiPermission specialist
   *
   * @apiHeader {String} Authorization   Specialist's access token
   *
   * @apiParam  {String}             email     Specialist's email
   * @apiParam  {String{6..128}}     password  Specialist's password
   * @apiParam  {String{..128}}      [name]    Specialist's name
   * @apiParam  {String=specialist,admin}  [role]    Specialist's role
   * (You must be an admin to change the specialist's role)
   *
   * @apiSuccess {String}  id         Specialist's id
   * @apiSuccess {String}  name       Specialist's name
   * @apiSuccess {String}  email      Specialist's email
   * @apiSuccess {String}  role       Specialist's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated specialists can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only specialist with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Specialist does not exist
   */
  .patch(authorize(LOGGED_USER), validate(updateSpecialist), controller.update)
  /**
   * @api {patch} v1/specialists/:id Delete Specialist
   * @apiDescription Delete a specialist
   * @apiVersion 1.0.0
   * @apiName DeleteSpecialist
   * @apiGroup Specialist
   * @apiPermission specialist
   *
   * @apiHeader {String} Authorization   Specialist's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated specialists can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only specialist with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Specialist does not exist
   */
  .delete(authorize(LOGGED_USER), controller.remove);

module.exports = router;
