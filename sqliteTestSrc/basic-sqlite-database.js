var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-databse.sqlite'
});

/*
Define model (means schema)
 define('modelName', {attributes});
*/
var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING
	},
	completed: {
		type:Sequelize.BOOLEAN
	} 
});

sequelize.sync().then(function() {
	console.log('Everything is synced');
	
	//Add row in table created above
	Todo.create({
		description: "First Row Added",
		completed: false
	}).then(function (todo){
		console.log('Data Added successfully');
		console.log(todo);
	});
});
