const models = require('../models');


exports.user_list_get = async function(req, res, next) {
	let users = await models.User.findAll();

	res.status(200).json({
		data: users, totalPages: 1, nextPage: null, previousPage: null, page: 1
	})
};

exports.user_detail = function(req, res, next) {
	res.send('NOT IMPLEMENTED: User get by ID');
};

exports.user_create_get = function(req, res, next) {
	res.send('NOT IMPLEMENTED: User create');
};

exports.user_create_post = function(req, res, next) {
	res.send('NOT IMPLEMENTED: User create post request');
};

exports.user_update_get = function(req, res, next) {
	res.send('NOT IMPLEMENTED: User get update template by id');
};

exports.user_update_put = function(req, res, next) {
	res.send('NOT IMPLEMENTED: User ');
};

exports.user_delete_get = function(req, res, next) {
	res.send('NOT IMPLEMENTED: User get by ID');
};

exports.user_delete = function(req, res, next) {
	res.send('NOT IMPLEMENTED: User get by ID');
};

