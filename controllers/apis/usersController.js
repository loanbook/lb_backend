const models = require('../../models');


exports.userListGet = async function(req, res, next) {
	let users = await models.User.findAll();

	res.status(200).json({
		data: users, totalPages: 1, nextPage: null, previousPage: null, page: 1
	})
};

exports.userDetail = function(req, res, next) {
	res.send('NOT IMPLEMENTED: User get by ID');
};

exports.userCreatePost = function(req, res, next) {
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

