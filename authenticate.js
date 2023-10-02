const passport = require('passport');
const LocalStratagey =  require('passport-local');
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');


const config = require('./config');

exports.local = passport.use(new LocalStratagey(User.authenticate()));

exports.getToken = user =>{
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
}

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(

    new JwtStrategy(
        opts,
        //we get this verify function directly from the passport-jwt documentation
        (jwt_payload, done) => {
            ///JWT payload is the decoded JWT payload
            //done is a callback that is written into jwt-passport
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

//jwt says we want to use the jasonwebt token stratagy (above) ,
exports.verifyUser = passport.authenticate('jwt', {session: false});