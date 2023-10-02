var express = require('express');
const User = require('../models/user');
const Profile = require('../models/profile')
const passport = require('passport');
const authenticate = require('../authenticate');
var userRouter = express.Router();

userRouter.route('/signup')
  .post((req, res) => {
    User.register(
      new User({ username: req.body.username },
        req.body.password,
        (err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
          } else {
            if (req.body.firstname) {
              user.firstname = req.body.firstname;
            }
            if (req.body.lastname) {
              user.lastname = req.body.lastname;
            }
            //add async infront of the function to create an async function
            user.save(async err => {
              if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
                return;
              }
              //make sure to import Profile model at the top
              //you can use "new Profile" which will create a new instance of a Profile document which will include the save method.
              const profile = new Profile({
                user: user._id, 
                firstname: req.body.firstname,
                lastname: req.body.lastname
              })
              //add try cate incase an error is thrown.
              try {
                //add await in front of the save to wait for the promise to resolve
                profile = await profile.save();
                passport.authenticate('local')(req, res, () => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({ success: true, status: 'Registration Successful!' });
                });
              }
              catch (error) {
                return res.status(500).send(error.message);
              };
            });
          }
        })
    )
  })

  userRouter.route('/login')
  .post((req, res, next) => {
  const token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});
userRouter.route('/')
  .get((req, res, next) => {
    User.find()
      .then(users => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.json(users);
      })
      .catch(err => next(err))
  })
  .post((req, res, next) => {
    User.create(req.body)
      .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.json(user);
      })
      .catch(err => next(err))
  })

userRouter.route('/:userId')
  .get((req, res, next) => {
    User.findById(req.params.userId)
      .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.json(user);
      })
      .catch(err => next(err))
  })
module.exports = userRouter;
