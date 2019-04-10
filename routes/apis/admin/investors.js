const express = require('express');
const router = express.Router();

const controller = require('../../../controllers/apis/admin/investorsController');

router.get('/list/', controller.listInvestorsGet);
router.get('/detail/:id/', controller.detialInvestorGet);
router.post('/create/', controller.createInvestorPost);
router.put('/update/:id', controller.updateInvestorPut);
router.delete('/destroy/:id', controller.investorDelete);


router.post('/add/deposit/', controller.investorAddDeposit);
router.post('/withdraw/', controller.investorWithdraw);



module.exports = router;

