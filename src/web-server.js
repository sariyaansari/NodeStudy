var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore')
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

var todoCurrId = todos.length;

/*
  when request come we will be able to parse the request using express,
  added to parse data for post request 
*/
app.use(bodyParser.json());

app.use(middleware.logger);

app.get('/about', middleware.requireAuthentication, function(req, res) {
	res.send('About Us');
});

app.get('/todos', function(req, res) {
	res.json(todos);
});

app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var todoMatched = _.findWhere(todos, {id: todoId});

	if (todoMatched) {
	   res.json(todoMatched);
	} else {
	   res.status(404).send();
	}
});

app.post('/todos', function(req, res) {
	var body = req.body;
	
	if (!_.isBool(body.completed) || 
	    !_.isString(body.description) || 
	    body.description.trim().length === 0) {
		return res.status(400).send();
	}
	
	body.id = ++todoCurrId;
	todos.push(body);

	console.log('description ' + body.description);
	res.json(todos[todoCurrId-1]);
});

app.use(express.static(__dirname + '/../public'));

app.listen(PORT, function(req,res){
	console.log('Server Running on port:' + PORT);
});
