const express = require('express');
const router = express.Router();

const controller = require('../../../controllers/apis/admin/statsController');


router.get('/', controller.statsGet);

module.exports = router;
