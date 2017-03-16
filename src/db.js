var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname .substr(0, __dirname.length-4)+ '/data/data-todo-API.sqlite'
});

//creating empty object
var db = {};

//load sequelize model from other file and store in todo property
db.todo = sequelize.import(__dirname.substr(0, __dirname.length-4) + '/models/todo.js');
//load sequelize instance
db.sequelize = sequelize;
//refer to lib instance by require
db.Sequelize = Sequelize;

module.exports = db;
