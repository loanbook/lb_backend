const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/apis/admin/loanInvestmentsController');


router.get('/list/', controller.listLoanInvestmentsGet);
router.get('/detail/:id/', controller.detailLoanInvestmentGet);
router.post('/create/', controller.createLoanInvestment);
router.put('/update/:id/', controller.updateLoanInvestment);
router.delete('/destroy/:id/', controller.loanInvestmentDelete);

module.exports = router;