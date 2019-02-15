const express = require('express');
const router = express.Router();

const controller = require('../../../controllers/apis/admin/usersController');


router.get('/list', controller.userListGet);

router.get('/:id/detail/', controller.userDetail);

router.post('/create/', controller.userCreatePost);

router.put('/:id/update/', controller.user_update_put);

router.delete('/:id/create/', controller.user_delete);

module.exports = router;
