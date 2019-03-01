const moment = require('moment');
const momentTZ = require('moment-timezone');


exports.noAmortSchedule = (duration, initialDate, interest, capital) => {
	interest = (interest / 100) * capital;
	let principal = capital / duration;
	let payment = interest + principal;

	let due_date = moment(initialDate, 'YYYY-MM-DD');
	if (!due_date.isValid())
		throw new Error('initialDate: Invalid date is provided.');

	schedule = [{
		number: 0,
		payment: 0,
		interest: 0,
		principal: 0,
		balance: capital,
		status: "DISBURSEMENT",
		due_date: due_date
	}];

	for (i = 1; i <= duration; i++) {
		amortization_pmt = {
			number: i,
			payment: payment,
			interest: interest,
			principal: principal,
			balance: capital - (i*principal),
			tracking: "PAYMENT_DUE",
			due_date: due_date.add(1, 'months').calendar()
		};
		schedule.push(amortization_pmt)
	}
	return schedule
};

exports.finalAmortSchedule = (duration, initialDate, interest, capital) => {

	interest = (interest / 100) * capital;
	let payment = interest;

	let due_date = moment(initialDate, 'YYYY-MM-DD');
	if (!due_date.isValid())
		throw new Error('initialDate: Invalid date is provided.');

	schedule = [{
		number: 0,
		payment: 0,
		interest: 0,
		principal: 0,
		balance: capital,
		tracking: "DISBURSEMENT",
		due_date: due_date
	}];

	for (i = 1; i <= duration; i++) {
		if (i < duration) {
			amortization_pmt = {
				number: i,
				payment: payment,
				interest: interest,
				principal: 0,
				balance: capital,
				tracking: "PAYMENT_DUE",
				due_date: due_date.add(1, 'months').calendar()
			};
			schedule.push(amortization_pmt)
		} else {
			amortization_pmt = {
				number: i,
				payment: parseFloat(payment) + parseFloat(capital),
				interest: interest,
				principal: capital,
				balance: 0,
				tracking: "PAYMENT_DUE",
				due_date: due_date.add(1, 'months').calendar()
			};
			schedule.push(amortization_pmt)
		}
	}
	return schedule
};