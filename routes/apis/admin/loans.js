const express = require('express');
const router = express.Router();

const loansController = require('../../../controllers/apis/admin/loansController');

router.get('/list/', loansController.listLoansGet);
router.get('/detail/:id/', loansController.detailLoanGet);
router.post('/create/', loansController.createLoanPost);
router.post('/update/:id/', loansController.updateLoanPut);
router.post('/destroy/:id/', loansController.loanDelete);


module.exports = router;
