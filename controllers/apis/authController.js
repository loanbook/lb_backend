require('dotenv').config();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');
const models = require('../../models');


exports.registerUserPost = async (req, res, next) => {
		const formData = req.body;
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(req.body.password, salt);
		try{
			let user = await models.User.create({
				email: formData.email,
				password: hash,
				firstName: formData.firstName,
				lastName: formData.lastName,
				role: formData.role
			});
			res.status(200).json(user)
		} catch (e) {
			res.status(400).json({
				'errors': 'Unable to create user. Please validate your information.',
			})
		}
};


exports.loginPost = async (req, res, next) => {

	passport.authenticate('local', {session: false}, (err, user, info) => {
		if (err || !user) {
			return res.status(400).json({
				message: info ? info.message : 'Login failed',
				user   : user
			});
		}

		req.login(user, {session: false}, (err) => {
			if (err) {
				res.send(err);
			}
			const token = jwt.sign(user, process.env.JSON_WEB_TOEKN_SECRET);
			return res.json({user, token});
		});

	})(req, res);
};
