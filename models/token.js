var cryptojs = require('crypto-js');

module.exports = function(sequelize, DataTypes) {
  var token = sequelize.define('token', {
    token_hash: DataTypes.STRING,
    token: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        len: [1]
      },
      set: function(value){
        var hash = cryptojs.MD5(value).toString();

        this.setDataValue('token', value);
        this.setDataValue('token_hash', hash);
      }
    }
  });
  return token;
}
