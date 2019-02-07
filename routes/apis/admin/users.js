const express = require('express');
const router = express.Router();

const userController = require('../../../controllers/apis/admin/usersController');


router.get('/list', userController.userListGet);

router.get('/:id/detail/', userController.userDetail);

router.post('/create/', userController.userCreatePost);

router.put('/:id/update/', userController.user_update_put);

router.delete('/:id/create/', userController.user_delete);

module.exports = router;
