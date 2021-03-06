const passport = require('passport'),
  localStrategy = require('passport-local').Strategy;
const bCrypt = require('bcrypt-nodejs');
const db = require('../db/schema.js');
const jwt = require('jsonwebtoken');

const isValidPassword = (user, password) => {
  return bCrypt.compareSync(password, user.password);
};

module.exports = function(passport) {
  passport.use(
    'login',
    new localStrategy(
      {
        passReqToCallback: true
      },
      async (req, username, password, done) => {
        try {
          const user = await db.User.findOne({ where: { username: username } });
          if (!user) {
            return done(null, false);
          }
          if (user) {
            if (!isValidPassword(user, password)) {
              return done(null, false);
            }
            if (isValidPassword(user, password)) {
              const payload = {
                userId: user.id,
                username: user.username,
                exp: 7200000
              };
              const token = await jwt.sign(payload, 'secret');
              return done(null, {
                username: username,
                token: token,
                id: user.id,
                type: user.type,
                profile_pic_url: user.bio,
                profile_pic_url: user.profile_pic_url
              });
            }
          }
        } catch (error) {
          console.log('Error with logging in', error);
        }
      }
    )
  );
};
