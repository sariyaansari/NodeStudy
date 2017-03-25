var bcryptjs = require('bcryptjs');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

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
  var user = sequelize.define('user', {
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
    classMethods: {
      autheticateUserLogin: function(body) {
        return new Promise(function(resolve, reject) {
          var where = {};

          if ( !(body.hasOwnProperty('email') && _.isString(body.email)) ) {
            return reject();
          } else {
            where.email = body.email;
          }
          if ( !(body.hasOwnProperty('password') && _.isString(body.password)) ) {
              return reject();
          }
          user.findOne({where: where}).then(function(record){
            if (!record || !bcryptjs.compareSync(body.password, record.get('password_hash'))) {
              return reject();
            }
            resolve(record);
          }, function(record){
            reject();
          });
        });
      },
      findByToken: function(token) {
        return new Promise(function (resolve, reject){
          try {
            var decodedJWT =  jwt.verify(token, 'qwerty098');
            var bytes = cryptojs.AES.decrypt(decodedJWT.token, 'abc123!@#!');
            var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
            user.findById(tokenData.id).then(function(record){
              if (record) {
                resolve(record);
              } else {
                reject();
              }
            }, function(err){
              reject();
            })
          } catch(e) {
            reject();
          }

        });
      }
    },
    instanceMethods: {
      toPublicJSON: function() {
        var json = this.toJSON();
        return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
      },
      generateToken: function(type) {
        if (!_.isString(type)) {
          return undefined;
        }
        try {
          var stringData = JSON.stringify({id: this.get('id'), type:type});
          var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#!').toString();
          var token = jwt.sign({token: encryptedData}, 'qwerty098');
          return token;
        } catch (e) {
          return undefined;
        }
      }
    }
  });
  return user;
};
