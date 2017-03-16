
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('todo', {
  	description: {
  		type: DataTypes.STRING,
  		allowNull: false, //cannot contain null as a string
  		validate: {
  			len: [1, 100]
  		}
  	},
  	completed: {
  		type:DataTypes.BOOLEAN,
  		defaultValue: true
  	}
  });
};
