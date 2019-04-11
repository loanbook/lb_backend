const express = require('express');
const router = express.Router();

const controller = require('../../../controllers/apis/admin/transactionsController');


// router.get('/list/', controller.transactionsGet);
router.get('/', controller.transactionsGet);

module.exports = router;
