var middleware = {
	requireAuthentication: function(req, res, next) {
		console.log('reqAuth function hit');
		next();
	},
	logger: function(req,res, next) {
		console.log('Request method:' + req.method + ' on ' + req.originalUrl);
		next();
	}
};

module.exports = middleware;
