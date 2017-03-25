module.exports = function(db) {
  return {
    requireAuthentication: function (req, res, next) {
      var token = req.get('Auth'); //extract header 'Auth'
      db.user.findByToken(token).then(function(user){
        req.user = user;
        next();
      }, function() {
        res.status(401).send();
      });
    }
  };
};

// module.export = authmiddleware;
