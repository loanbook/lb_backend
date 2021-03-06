var Queue = require('bull');
const {
    investorInitialDeposit,
    investorAddDeposit,
    investorWithdraw,
    distributeShare,
    calculateAcuredInterestUpdatePercentage } = require('./investorProcessor');

var investorQueue = new Queue('Investor Related Tasks', 'redis://localhost:6379');
var borrowerQueue = new Queue('Borrower Related Tasks', 'redis://localhost:6379');

investorQueue.on('global:failed', function (job, err) {
    console.log("[eventController] JobName: ", job, "Failed with error: ", err);
});

investorQueue.on('global:completed', function (job, result) {
    console.log("[eventController] Job Id: ", job, " Completed", result);
});


investorQueue.process('investorAddDeposit', investorAddDeposit);
investorQueue.process('investorWithdraw', investorWithdraw);
investorQueue.process('distributeShare', distributeShare);
investorQueue.process('investorInitialDeposit', investorInitialDeposit);
investorQueue.process('calculateAcuredInterestUpdatePercentage', calculateAcuredInterestUpdatePercentage);


module.exports = {
    investorQueue: investorQueue,
    borrowerQueue: borrowerQueue
};