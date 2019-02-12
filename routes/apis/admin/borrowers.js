const express = require('express');
const router = express.Router();

const borrowerController = require('../../../controllers/apis/admin/borrowersController');


router.get('/list/', borrowerController.listBorrowersGet);
router.get('/detail/:id/', borrowerController.detailBorrowerGet);
router.post('/create/', borrowerController.createBorrowerPost);
router.put('/update/:id/', borrowerController.updateBorrowerPut);
router.delete('/destroy/:id/', borrowerController.loanBorrowerDelete);


module.exports = router;
