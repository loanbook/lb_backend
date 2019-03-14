const express = require('express');
const router = express.Router();

const controller = require('../../../controllers/apis/admin/installmentsController');


router.get('/list', controller.installmentsListGet);
router.get('/detail/:id/', controller.installmentDetailGet);
router.post('/pay/:loanId/:installmentId/', controller.payInstallmentPost);

module.exports = router;

