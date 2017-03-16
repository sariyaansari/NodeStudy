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
		type: Sequelize.STRING,
		allowNull: false, //cannot contain null as a string
		validate: {
			len: [1, 100]
		}
	},
	completed: {
		type:Sequelize.BOOLEAN,
		defaultValue: true
	}
});

sequelize.sync().then(function() {
	console.log('Everything is synced');

  //finding specific id and printing the row
	Todo.findById(3).then(function(todo){
		if (todo){
			console.log(todo.toJSON());
		} else {
			console.log('Item not exists in table');
		}
	});

	//Add row in table created above
	Todo.create({
		description: "I am with new row",
		completed: true
	}).then(function (todo){
		return Todo.create({
			//Adding another row using promise
			 description: "Clean my personal cabin"
		});
	}).then(function() {
		//Then findAll records where completed is true & description contains 'new'
		return Todo.findAll({
			where: { 
				completed: true,
				description:{
					$like: '%new%'
				}
			}
		});
	}).then(function (todos){
		//now finally print all records that matches the above criteria
		if (todos) {
			todos.forEach(function(todo){
				console.log(todo.toJSON());
			});
		}
	}).catch(function(e) {
		//Catch and exit gracefully if schema defination violated
		console.log(e);
	});

});
