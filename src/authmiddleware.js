var cryptojs = require('crypto-js');
module.exports = function(db) {
  return {
    requireAuthentication: function (req, res, next) {
      var token = req.get('Auth') || ''; //extract header 'Auth'
      var where = {};
      where.token_hash = cryptojs.MD5(token).toString();
      db.token.findOne({where: where}).then (function(tokenInstance) {
        if (!tokenInstance) {
          throw new Error();
        }
        req.token = tokenInstance;
        return db.user.findByToken(token);
      }).then (function(user){
        req.user = user;
        next();
      }).catch(function(e){
        res.status(401).send();
      });
    }
  };
};
