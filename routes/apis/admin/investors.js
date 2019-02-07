const express = require('express');
const router = express.Router();

const investorController = require('../../../controllers/apis/admin/investorsController');
const investorValidators = require('../../../middlewares/apis/admin/investorsValidators');

router.get('/list/', investorController.listInvestorsGet);
router.post('/create/', investorValidators.createInvestorReqValidator, investorController.createInvestorPost);

module.exports = router;
