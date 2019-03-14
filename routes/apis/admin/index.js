const usersRouter = require('../admin/users');
const investorRouters = require('../admin/investors');
const borrowerRouters = require('../admin/borrowers');
const loansRouters = require('../admin/loans');
const installmentRouter = require('../admin/installments');
const statsRouter = require('../admin/stats');

const ADMIN_BASE_PATH = 'admin/';

module.exports = (app, basePath,  passport) => {

	app.use(basePath + ADMIN_BASE_PATH + 'stats', passport.authenticate('jwt', {session: false}), statsRouter);
	app.use(basePath + ADMIN_BASE_PATH + 'users', passport.authenticate('jwt', {session: false}), usersRouter);
	app.use(basePath + ADMIN_BASE_PATH + 'investors', passport.authenticate('jwt', {session: false}), investorRouters);
	app.use(basePath + ADMIN_BASE_PATH + 'borrowers', passport.authenticate('jwt', {session: false}), borrowerRouters);
	app.use(basePath + ADMIN_BASE_PATH + 'loans', passport.authenticate('jwt', {session: false}), loansRouters);
	app.use(basePath + ADMIN_BASE_PATH + 'installments', passport.authenticate('jwt', {session: false}), installmentRouter);

};