var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var middleware = require('./middleware.js');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [
/*							{
								id:1,
								description: 'Need to learn Node.js first',
								completed: true
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
					    }
*/
		];

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

/** Get all todos using HTTP GET /todos*/
/** Get todos based on query e.g. /todos?completed=true */
/** Get todos based on query e.g. /todos?completed=false&q=work*/
app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {completed: false});
	}

	if (queryParams.hasOwnProperty('q') &&
			_.isString(queryParams.q) &&
			queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function(todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q) > -1;
		});
	}
	res.json(filteredTodos);
});

/** Get specific todo using 'id' by HTTP GET */
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var todoMatched = _.findWhere(todos, {id: todoId});

	if (todoMatched) {
	   res.json(todoMatched);
	} else {
	   res.status(404).send();
	}
});

/** Add todo item using HTTP Post */
app.post('/todos', function(req, res) {
	// If request body is having unnecessary key-value pair
	// apart from description and completed then it will ignore and return the
	// correct key-value pair
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function(todo){
		res.json(todo.toJSON());
	}, function(err){
		res.status(400).send();
	});


// 	if (!_.isBoolean(body.completed) ||
// 	    !_.isString(body.description) ||
// 	    body.description.trim().length === 0) {
// 		return res.status(400).send();
// 	}
//
// 	body.description = body.description.trim(); //trim leading and trailing blanks in description value
// 	body.id = ++todoCurrId;
// 	todos.push(body);
//
// 	console.log('description ' + body.description);
// 	res.json(todos[todoCurrId-1]);
// });
//
// /** delete todos item using HTTP delete */
// app.delete('/todos/:id', function(req, res){
// 	var todoId = parseInt(req.params.id, 10);
// 	var matchedTodo = _.findWhere(todos, {id: todoId});
//
// 	if (!matchedTodo) {
// 		 res.status(404).json({"info": "Item not found"});
// 	} else {
// 		todos = _.without(todos, matchedTodo);
// 		res.json(matchedTodo);
//  }
});

/** Update specific 'id' data using HTTP Put */
app.put('/todos/:id', function(req,res) {
	var todoId = parseInt(req.params.id, 10);
	var foundToDo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
  var validAttributes = {};

	if (!foundToDo) {
		return res.status(404).json({"info":"item not found"});
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).json({"error": "Invalid completed data"});
	}

	if (body.hasOwnProperty('description') && _.isString(body.description)) {
		validAttributes.description = body.description;
	} else if(body.hasOwnProperty('description')) {
		return res.status(400).json({"error": "Invalid descrition data"});
	}

  _.extend(foundToDo, validAttributes);
	res.json(foundToDo);
});

app.use(express.static(__dirname + '/../public'));


db.sequelize.sync().then(function(){
	//TODO : why to listen here
	app.listen(PORT, function(req,res){
		console.log('Server Running on port:' + PORT);
	});
});
