const moment = require('moment');
const momentTZ = require('moment-timezone');


noAmortSchedule = (duration, interest, capital) => {
	interest = (interest / 100) * capital;
	let principal = capital / duration;
	let payment = interest + principal;

	schedule = [{
		number: 0,
		payment: 0,
		interest: 0,
		principal: 0,
		balance: capital,
		status: "disbursment",
		due_date: moment()
	}];

	for (i = 1; i <= duration; i++) {
		amortization_pmt = {
			number: i,
			payment: payment,
			interest: interest,
			principal: principal,
			balance: capital - (i*principal),
			tracking: "payment due",
			due_date: moment().add(i, 'months').calendar()
		};
		schedule.push(amortization_pmt)
	}
	return schedule
};

finalAmortSchedule = (duration, interest, capital) => {

	interest = (interest / 100) * capital;
	let payment = interest;

	schedule = [{
		number: 0,
		payment: 0,
		interest: 0,
		principal: 0,
		balance: capital,
		tracking: "disbursment",
		due_date: moment()
	}];

	for (i = 1; i <= duration; i++) {
		if (i < duration) {
			amortization_pmt = {
				number: i,
				payment: payment,
				interest: interest,
				principal: 0,
				balance: capital,
				tracking: "payment due",
				due_date: moment().add(i, 'months').calendar()
			};
			schedule.push(amortization_pmt)
		} else {
			amortization_pmt = {
				number: i,
				payment: payment,
				interest: interest,
				principal: capital,
				balance: 0,
				tracking: "payment due",
				due_date: moment().add(i, 'months').calendar()
			};
			schedule.push(amortization_pmt)
		}
	}
	return schedule
};


exports.module = {
	noAmortSchedule: noAmortSchedule,
	finalAmortSchedule: finalAmortSchedule
};