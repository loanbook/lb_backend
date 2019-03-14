const passport = require('passport');
const adminUrl = require('./admin');
const authRouter = require('./auth');


const ROOT_BASE = "/api/v1/";


module.exports = (app) => {

	require('../../config/passport');

	// Passport Middleware
	app.use(passport.initialize());

	app.use(ROOT_BASE + 'auth', authRouter);

	// Apis admin routes.

	adminUrl(app, ROOT_BASE,  passport);

};