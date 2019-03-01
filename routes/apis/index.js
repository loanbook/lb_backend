const passport = require('passport');

const authRouter = require('./auth');
const usersRouter = require('./admin/users');
const investorRouters = require('./admin/investors');
const borrowerRouters = require('./admin/borrowers');
const loansRouters = require('./admin/loans');
const installmentRouter = require('./admin/installments');


const ROOT_BASE = "/api/v1/";


module.exports = (app) => {

	require('../../config/passport');

	// Passport Middleware
	app.use(passport.initialize());


	app.use(ROOT_BASE + 'auth', authRouter);
	app.use(ROOT_BASE + 'admin/users', passport.authenticate('jwt', {session: false}), usersRouter);
	app.use(ROOT_BASE + 'admin/investors', passport.authenticate('jwt', {session: false}), investorRouters);
	app.use(ROOT_BASE + 'admin/borrowers', passport.authenticate('jwt', {session: false}), borrowerRouters);
	app.use(ROOT_BASE + 'admin/loans', passport.authenticate('jwt', {session: false}), loansRouters);
	app.use(ROOT_BASE + 'admin/installments', passport.authenticate('jwt', {session: false}), installmentRouter);

};