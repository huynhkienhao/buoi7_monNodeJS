var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler')
let {check_authentication,check_authorization} = require('../utils/check_auth')
let constants = require('../utils/constants')

/* GET all users - Chỉ MOD hoặc ADMIN */
router.get('/', check_authentication, check_authorization(constants.MOD_PERMISSION), async function (req, res, next) {
  try {
    let users = await userController.GetAllUser();
    CreateSuccessRes(res, 200, users);
  } catch (error) {
    next(error);
  }
});

/* GET user by ID - User chỉ xem được thông tin của chính mình, MOD/ADMIN xem được tất cả */
router.get('/:id', check_authentication, async function (req, res, next) {
  try {
    let userId = req.params.id;
    let currentUser = req.user; // Lấy thông tin user từ middleware

    if (currentUser.role !== constants.ADMIN_PERMISSION && currentUser.role !== constants.MOD_PERMISSION && currentUser.id !== userId) {
      return CreateErrorRes(res, 403, "Bạn không có quyền truy cập thông tin người khác.");
    }

    let user = await userController.GetUserById(userId);
    CreateSuccessRes(res, 200, user);
  } catch (error) {
    CreateErrorRes(res, 404, error);
  }
});

/* POST create user - Chỉ ADMIN */
router.post('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let { username, password, email, role } = req.body;
    let newUser = await userController.CreateAnUser(username, password, email, role);
    CreateSuccessRes(res, 200, newUser);
  } catch (error) {
    next(error);
  }
});

/* PUT update user - Chỉ ADMIN */
router.put('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let updateUser = await userController.UpdateUser(req.params.id, req.body);
    CreateSuccessRes(res, 200, updateUser);
  } catch (error) {
    next(error);
  }
});

/* DELETE user - Chỉ ADMIN */
router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let deletedUser = await userController.DeleteUser(req.params.id);
    CreateSuccessRes(res, 200, { message: "Người dùng đã bị xóa", deletedUser });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
