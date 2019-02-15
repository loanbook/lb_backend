const express = require('express');
const router = express.Router();

const controller = require('../../../controllers/apis/admin/borrowersController');


router.get('/list/', controller.listBorrowersGet);
router.get('/detail/:id/', controller.detailBorrowerGet);
router.post('/create/', controller.createBorrowerPost);
router.put('/update/:id/', controller.updateBorrowerPut);
router.delete('/destroy/:id/', controller.loanBorrowerDelete);


module.exports = router;
