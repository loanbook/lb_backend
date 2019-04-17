const models = require('../../../models');
const paginate = require('express-paginate');

exports.transactionsGet = async function (req, res, next) {

    // models.Transaction.findAndCountAll({ limit: req.query.limit, offset: req.skip })
    //     .then(results => {
    //         const itemCount = results.count;
    //         const pageCount = Math.ceil(results.count / req.query.limit);
    //         data = {
    //             users: results.rows,
    //             pageCount,
    //             itemCount,
    //             pages: paginate.getArrayPages(req)(1, pageCount, req.query.page),
    //         };
    //         res.status(200).json({ data: data });
    //     }).catch(err => {
    //         err.status(500).json({ message: err.message })
    //     });



    models.Transaction.findAll({}).then(data => {
        res.status(200).json({ data: data });
    }).catch(error => {
        res.status(500).json({ message: error.message });
    });
};