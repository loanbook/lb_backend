var express = require('express');
var router = express.Router();

var userController = require('../controllers/usersController');


router.get('/list', userController.user_list_get);
router.get('/:id/detail/', userController.user_list_get);

router.get('/create/', userController.user_create_get);
router.post('/create/', userController.user_create_post);

router.get('/:id/update/', userController.user_update_get);
router.put('/create/', userController.user_update_put);

router.get('/:id/delete/', userController.user_delete_get);
router.delete('/:id/create/', userController.user_delete);

module.exports = router;
