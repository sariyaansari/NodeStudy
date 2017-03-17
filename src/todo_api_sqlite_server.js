var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 6000;

//Request post received with data 
app.post('/todos', function(req, res) {
    //Parsing schema data from request body if could be there or not
    var body = _.pick(req.body, 'description', 'completed');
    //Creating record then sending response to sender
    //Note: Currently returning same data what is stored in sqlite
    db.todo.create(body).then(function (todo) {
	res.json(todo.toJSON());
    }, function(err){
	res.status(404).send();
    });        
});

/** syncing everything not only 'todo' table*/
db.sequelize.sync().then(function(){
    //TODO : why to listen here
    app.listen(PORT, function(req,res) {
    console.log('Server Running on port:' + PORT);
    });
});
