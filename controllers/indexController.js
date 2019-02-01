
exports.index_page_get = function(req, res, next) {
  res.render('index', { title: 'Express' });
};

