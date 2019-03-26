var CronJob = require('cron').CronJob;
const statsCron = require('./statsCron');
const moment = require('moment');

// let printHelloWorld = function () {
// 	console.log('You will see this message every second', moment().format('YYYY-MM-DD HH:MM:ss'));
// }
// new CronJob('* * * * * *', printHelloWorld, null, true, 'America/Los_Angeles');
new CronJob('0 */1 * * * *', statsCron.calculateAndSaveStats, null, true, 'America/Los_Angeles');
