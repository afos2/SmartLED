var express = require('express')
var router = express.Router();
var passport = require('passport');
var login = require('../passport-config');

passport.use(login.strategy);

router.post('/',  function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (info) { return res.json(info); };
    if (err) { return res.json(err); }
    if (!user) { return res.json({status: "unauthorized"}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({status: "authenticated", user: req.user});
    });
  })(req, res, next);
});

module.exports = router;
