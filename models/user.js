var bcryptjs = require('bcryptjs');
var _ = require('underscore');

/**
SCHEMA Structure for easy understanding of curly braces :
module.export = function(sequelize, DataTypes) {
sequelize.define('tableName', {
                                fieldnames: {properties}, 
                                {
                                  hooks: {properties},
                                  instanceMethods {properties}
                                }
                              }
                );
};
*/
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    email:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    salt: {
      type: DataTypes.STRING
    },
    password_hash: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        len: [7, 30]
      },
      set: function(value) {
        var salt = bcryptjs.genSaltSync(10);
        var hashedPassword = bcryptjs.hashSync(value, salt);

        this.setDataValue('password', value);
        this.setDataValue('salt', salt);
        this.setDataValue('password_hash', hashedPassword);
      }
    },
  }, {
     hooks: {
      beforeValidate: function(user, options) {
        if (typeof user.email === 'string') {
          user.email = user.email.toLowerCase();
        }
      }
    },
    instanceMethods: {
      toPublicJSON: function() {
        var json = this.toJSON();
        return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
      }
    }
  });
};
