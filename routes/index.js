const apiRoutes = require('./apis');

const homeRoutes = require('./home');

module.exports = (app) => {

	apiRoutes(app);

	app.use('/', homeRoutes);

};