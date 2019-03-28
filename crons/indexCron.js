var CronJob = require('cron').CronJob;
const statsCron = require('./statsCron');
const moment = require('moment');

const { investorQueue } = require('./backendQueue');

// let printHelloWorld = function () {
// 	console.log('You will see this message every second', moment().format('YYYY-MM-DD HH:MM:ss'));
// }
// new CronJob('* * * * * *', printHelloWorld, null, true, 'America/Los_Angeles');
// new CronJob('0 */1 * * * *', statsCron.calculateAndSaveStats, null, true, 'America/Los_Angeles');

const successHandler = function (data) {
	console.log('Background Process run successfully.', data);
}
const errorHandler = function (error) {
	console.warn('Background Process fail.', error);
}

// investorQueue.add('distributeShare', { recoveryAmount: 100 }).then(successHandler, errorHandler);
investorQueue.add('calculateAcuredInterestUpdatePercentage', { investmentAmount: 100 }).then(successHandler, errorHandler);
