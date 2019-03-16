require('dotenv').config();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const models = require('../../models');


exports.registerUserPost = (req, res, next) => {
	let userInstance = models.User.build({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		isActive: req.isActive,
	});
	userInstance.setPassword = req.body.password;
	userInstance.save().then(user => {
		res.status(200).json({ user: user })
	}).catch(error => res.status(500).json({ message: error }));
};


exports.loginPost = async (req, res, next) => {

	passport.authenticate('local', { session: false }, (err, user, info) => {
		if (err || !user) {
			return res.status(400).json({
				message: info ? info.message : 'Login failed',
				user: user
			});
		}

		req.login(user, { session: false }, (err) => {
			if (err) {
				res.send(err);
			}
			const access_token = jwt.sign(user, process.env.JSON_WEB_TOEKN_SECRET);
			user.role = user.isSuperuser ? 'admin' : user.isStaff ? 'staff' : 'user';
			// attributes: ['id', 'firstName', 'lastName', 'isActive', 'email']
			return res.json({ user, access_token });
		});

	})(req, res);
};
