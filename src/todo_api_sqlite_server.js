var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcryptjs = require('bcryptjs')

var app = express();
var PORT = process.env.PORT || 9090; //replace 9090 with your choice of PORT No.

app.use(bodyParser.json());

//Request post received with data
app.post('/todos', function(req, res) {
    //Parsing schema data from request body it could be there or not
    var body = _.pick(req.body, 'description', 'completed');
    //Creating record then sending response to sender
    //Note: Currently returning same data what is stored in sqlite
    db.todo.create(body).then(function (todo) {
	       res.json(todo.toJSON());
    }, function(err){
	       res.status(404).json({"error": "could not store data"});
    });
});

//Request HTTP GET to get specific record from sqlite table
app.get('/todos/:id', function(req,res) {
  var id = parseInt(req.params.id, 10);
  db.todo.findById(id).then(function(todo){
    if (todo) {
      res.json(todo.toJSON());
    } else {
      res.status(404).json({"error": "Bad Request"});
    }
  }, function(err) {
    res.status(500).json({"error":  "Unknown error"});
  });

});

//Request HTTP GET to get records from sqlite table
/** Get all todos using HTTP GET /todos*/
/** Get todos based on query e.g. /todos?completed=true */
/** Get todos based on query e.g. /todos?completed=false&desc=work*/
/** Note: where clause is working on OR condition for multiple conditions*/
app.get('/todos', function(req, res){
  var query = req.query;
  where = {};

  if (query.hasOwnProperty('completed') && query.completed === 'true'){
    where.completed = true;
  } else if (query.hasOwnProperty('completed') && query.completed === 'false'){
    where.completed = false;
  }

  if (query.hasOwnProperty('description') && query.desc.length > 0) {
    where.description = {
      $like: '%' + query.desc + '%'
    }
  }

  db.todo.findAll({
      where: where //if where clause not having any criteria, so all records are fetched
    }).then(function(todos){
      res.json(todos);
    }, function(err){
      res.status(500).send();
    });

});

/** Delete record using HTTP delete from sqlite */
app.delete('/todos/:id', function(req, res){
  var id = parseInt(req.params.id, 10);
  where = {};
  where.id = id;
  db.todo.destroy({where: where}).then(function(todos){
    if (todos >= 1){
      res.json({"info": "item deleted successfully"});
    } else {
      res.json({"info": "no item exists with requesting ID"});
    }
  }, function(err){
    res.status(500).send();
  });
});

/** Update specific table record based on requesting 'id' using HTTP PUT */
app.put('/todos/:id', function(req, res) {
  var id   = parseInt(req.params.id, 10);
  var body = _.pick(req.body, 'description', 'completed');
  var attributes = {};

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    attributes.completed = body.completed;
  }

	if (body.hasOwnProperty('description') && _.isString(body.description)) {
		attributes.description = body.description;
	}

  db.todo.findById(id).then(function(todo){
    if (todo) {
      return todo.update(attributes).then(function(todo) {
        res.json(todo.toJSON());
      }, function(err){
        res.status(400).json(err);
      });
    } else {
      res.status(404).json({"info": "Data not found"});
    }
  }, function(err){
    res.status(500).json({"error": "Error occured!!"});
  });

});

/** Add username & email in 'users' table using HTTP Post */
app.post('/users', function(req,res){
  var body = _.pick(req.body, 'email', 'password');
  db.user.create(body).then(function(user){
    if (user) {
      res.json(user.toPublicJSON());
    }
  }, function(err){
    res.status(400).json(err);
  });
});

//Request HTTP GET to get user record where 'email' matched from table 'users'
app.get('/users/:email', function(req,res) {
  var email = req.params.email;
  var where = {};
  where.email = email;
  db.user.findAll({where: where}).then(function(records){
    if (records) {
      res.json(records);
    } else {
      res.status(404).json({"info": "Data not found"});
    }
  }, function(err){
    res.status(400).json(err);
  });
});

app.post('/users/login', function(req, res) {
  var body = _.pick(req.body, 'email', 'password');

  db.user.autheticateUserLogin(body).then(function(record){
    res.json(record.toPublicJSON());
  }, function(err){
    res.status(401).send(err);
  });
});

/** syncing everything not only 'todo' table*/
db.sequelize.sync().then(function(){
    //TODO : why to listen here
    app.listen(PORT, function(req,res) {
    console.log('Server Running on port:' + PORT);
    });
});
