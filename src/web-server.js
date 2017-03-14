var express = require('express');
var middleware = require('./middleware.js');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
		id:1,
		description: 'Need to learn Node.js first',
		completed: false
	    },
	    {
		id:2,
		description: 'Develop Application after that',
		completed: false
	    },
            {
		id:3,
		description: 'Publish the application',
		completed: false
	    }];
app.use(middleware.logger);

app.get('/about', middleware.requireAuthentication, function(req, res) {
	res.send('About Us');
});

app.get('/todos', function(req, res) {
	res.json(todos);
});

app.use(express.static(__dirname + '/../public'));

app.listen(PORT, function(req,res){
	console.log('Server Running on port:' + PORT);
});
