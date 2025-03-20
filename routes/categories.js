var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');
let { check_authentication, check_authorization } = require('../utils/check_auth');
let { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
let constants = require('../utils/constants');


// Lấy danh sách category (Không cần đăng nhập)
router.get('/', async function(req, res, next) {
  try {
      let categories = await categoryModel.find({});
      return CreateSuccessRes(res, 200, categories);
  } catch (error) {
      return CreateErrorRes(res, 500, error);
  }
});

// Lấy thông tin category theo ID (Không cần đăng nhập)
router.get('/:id', async function(req, res, next) {
  try {
      let category = await categoryModel.findById(req.params.id);
      if (!category) throw new Error("Không tìm thấy danh mục");
      return CreateSuccessRes(res, 200, category);
  } catch (error) {
      return CreateErrorRes(res, 404, error);
  }
});

// Tạo mới category (Chỉ dành cho "mod" trở lên)
router.post('/', check_authentication, check_authorization(constants.MOD_PERMISSION), async function(req, res, next) {
  try {
      let newCategory = new categoryModel({
          name: req.body.name,
          description: req.body.description || "",
      });
      await newCategory.save();
      return CreateSuccessRes(res, 201, newCategory);
  } catch (error) {
      return CreateErrorRes(res, 400, error);
  }
});

// Cập nhật category (Chỉ dành cho "mod" trở lên)
router.put('/:id', check_authentication, check_authorization(constants.MOD_PERMISSION), async function(req, res, next) {
  try {
      let updatedCategory = await categoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedCategory) throw new Error("Không tìm thấy danh mục");
      return CreateSuccessRes(res, 200, updatedCategory);
  } catch (error) {
      return CreateErrorRes(res, 400, error);
  }
});

// Xóa category (Chỉ dành cho "admin")
router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res, next) {
  try {
      let deletedCategory = await categoryModel.findByIdAndDelete(req.params.id);
      if (!deletedCategory) throw new Error("Không tìm thấy danh mục");
      return CreateSuccessRes(res, 200, { message: "Danh mục đã bị xóa" });
  } catch (error) {
      return CreateErrorRes(res, 400, error);
  }
});

module.exports = router;
