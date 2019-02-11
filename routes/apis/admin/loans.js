const express = require('express');
const router = express.Router();

const loansController = require('../../../controllers/apis/admin/loansController');

router.get('/list/', loansController.listLoansGet);
router.get('/detail/:id/', loansController.detailLoanGet);
router.post('/create/', loansController.createLoanPost);
router.put('/update/:id/', loansController.updateLoanPut);
router.delete('/destroy/:id/', loansController.loanDelete);


module.exports = router;
