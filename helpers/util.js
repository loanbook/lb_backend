

exports.roundAmount = (amount, afterPoint=4) => {
	amount = parseFloat(amount);
	if(!amount)
		amount = 0;
	return Number.parseFloat(amount).toFixed(afterPoint);
};