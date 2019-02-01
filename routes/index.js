var express = require('express');
var router = express.Router();

var indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexController.index_page_get);

module.exports = router;
