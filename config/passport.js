const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;


const bcrypt = require('bcryptjs');
const models = require('../models');


passport.use(
	new LocalStrategy({usernameField: 'email', passwordField: 'password'},(email, password, done) => {

		// Match user
		let user = models.User.findOne({where: {email: email}, raw: true}).then(user => {
			if(!user){
				return done(null, false, {message: 'Email is not register.'});
			}

			// Match password
			bcrypt.compare(password, user.password, (error, isMatch) => {
				if(error) throw error;

				if(isMatch){
					return done(null, user)
				}else{
					return done(null, false, {message: 'Invalid email and password.'})
				}

			});
		})
			.catch(error => {console.log(error)})
	})
);

passport.use(new JWTStrategy({
		jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('token'),
		secretOrKey   : 'your_jwt_secret'
	},
	function (jwtPayload, cb) {

		//find the user in db if needed
		return models.User.findById(jwtPayload.id)
			.then(user => {
				return cb(null, user);
			})
			.catch(err => {
				return cb(err);
			});
	}
));