var express = require('express');
var app = express();
var PORT = 3000;

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

app.use(middleware.logger);

app.get('/about', middleware.requireAuthentication, function(req, res) {
	res.send('about us test');
});

app.use(express.static(__dirname + '/../public'));

app.listen(PORT, function(req,res){
	console.log('Server Running on port:' + PORT);
});
