const express = require('express');
const router = express.Router();

const controller = require('../../../controllers/apis/admin/installmentsController');


router.get('/list', controller.installmentsListGet);
router.get('/detail/:id/', controller.installmentDetailGet);

module.exports = router;

