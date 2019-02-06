const express = require('express');
const router = express.Router();

const authController = require('../../controllers/apis/authController');
const authValidators = require('../../middlewares/apis/authValidators');

router.post('/signup/' , authValidators.signupReqValidator, authController.registerUserPost);
router.post('/login/' , authValidators.loginReqValidator, authController.loginPost);

module.exports = router;
