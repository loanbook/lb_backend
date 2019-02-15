const express = require('express');
const router = express.Router();

const controller = require('../../../controllers/apis/admin/loansController');

router.get('/list/', controller.listLoansGet);
router.get('/detail/:id/', controller.detailLoanGet);
router.post('/create/', controller.createLoanPost);
router.put('/update/:id/', controller.updateLoanPut);
router.delete('/destroy/:id/', controller.loanDelete);


module.exports = router;
