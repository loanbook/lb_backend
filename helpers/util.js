

exports.roundAmount = (amount, afterPoint = 4) => {
	amount = parseFloat(amount);
	if (!amount)
		amount = 0;
	return parseFloat(amount.toFixed(afterPoint));
};


exports.getPercentage = (total, percent, dec = 4) => {
	total = parseFloat(total);
	percent = parseFloat(percent);

	if (total && percent) {
		return parseFloat((percent / 100 * total).toFixed(dec));
	}
	return NaN;
};

exports.generateDashbardCard = (label, value) => {

	return {
		'title': label,
		'count': this.roundAmount(value, 2),
	}
}

// exports.generateDashbardCard = (label, value, detail = 'You can show some detailed information about this widget in here.') => {

// 	return {
// 		'title': label,
// 		'data': {
// 			'label': label,
// 			'count': value,
// 			'extra': {
// 				'label': label,
// 				'count': value
// 			}
// 		},
// 		'detail': detail
// 	}
// }