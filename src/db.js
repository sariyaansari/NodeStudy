var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;
if (env === 'production') {
  //On heroku server this object will be used
  sequelize = new Sequelize(process.env.DATABASE_URL, {'dialect': 'postgres'});
} else {
  //on localhost this object will be used
  sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname .substr(0, __dirname.length-4)+ '/data/data-todo-API.sqlite'
  });
}

//creating empty object
var db = {};

//load sequelize model from other file and store in todo property
db.todo = sequelize.import(__dirname.substr(0, __dirname.length-4) + '/models/todo.js');
//load sequelize model from other file to refer table schema
db.user = sequelize.import(__dirname.substr(0, __dirname.length-4) + '/models/user.js');
//load sequelize model from other file that contains issued token
db.token = sequelize.import(__dirname.substr(0, __dirname.length-4) + '/models/token.js');
//load sequelize instance
db.sequelize = sequelize;
//refer to lib instance by require
db.Sequelize = Sequelize;

//make association between tables
db.todo.belongsTo(db.user);
db.user.hasMany(db.todo);

module.exports = db;
