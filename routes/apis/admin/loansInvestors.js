const express = require('express');
const router = express.Router();

const loansInvestorsController = require('../../../controllers/apis/admin/loansInvestorsController');

router.get('/list/', loansInvestorsController.listLoansInvestorsGet);
router.get('/detail/:id/', loansInvestorsController.detailLoanInvestorGet);
router.post('/create/', loansInvestorsController.createLoanInvestorPost);
router.put('/update/:id/', loansInvestorsController.updateLoanInvestorPut);
router.delete('/destroy/:id/', loansInvestorsController.loanInvestorDelete);