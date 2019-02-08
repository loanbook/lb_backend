const express = require('express');
const router = express.Router();

const investorController = require('../../../controllers/apis/admin/investorsController');

router.get('/list/', investorController.listInvestorsGet);
router.get('/detail/:id/', investorController.detialInvestorGet);
router.post('/create/', investorController.createInvestorPost);
router.put('/update/:id', investorController.updateInvestorPut);
router.delete('/destroy/:id', investorController.investorDelete);

module.exports = router;

