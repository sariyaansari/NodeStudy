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

app.get('/todos/:id', function(req, res) {
	var todoId = req.params.id;
	var todoMatched;
	todos.forEach(function(todo){
		if (todo.id === todoId)
		   todoMatched = todo;
	});

	if (todoMatched) {
	   res.json(todoMatched);
	} else {
	   res.status(404).send();
	}
});

app.use(express.static(__dirname + '/../public'));

app.listen(PORT, function(req,res){
	console.log('Server Running on port:' + PORT);
});
