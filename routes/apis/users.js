var express = require('express');
var router = express.Router();

var userController = require('../../controllers/apis/usersController');


router.get('/list', userController.userListGet);

router.get('/:id/detail/', userController.userDetail);

router.post('/create/', userController.userCreatePost);

router.put('/:id/update/', userController.user_update_put);

router.delete('/:id/create/', userController.user_delete);

module.exports = router;
