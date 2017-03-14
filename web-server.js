var express = require('express');
var middleware = require('./src/middleware.js');
var app = express();
var PORT = process.env.PORT || 3000;

app.use(middleware.logger);

app.get('/about', middleware.requireAuthentication, function(req, res) {
	res.send('About Us');
});

app.use(express.static(__dirname + '/public'));

app.listen(PORT, function(req,res){
	console.log('Server Running on port:' + PORT);
});
