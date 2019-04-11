const models = require('../../../models');


exports.transactionsGet = async function (req, res, next) {
    models.Transaction.findAll({
        limit: 2
    }).then(trans => {
        res.status(200).json({ data: trans });
    }).catch(error => {
        res.status(500).json({ message: error.message });
    });
};