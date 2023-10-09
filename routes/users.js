var express = require('express');
const User = require('../models/user');
const Profile = require('../models/profile')
const passport = require('passport');
const authenticate = require('../authenticate');
var userRouter = express.Router();
const cors = require('./cors');

userRouter.options('*', cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
});

userRouter.route('/signup')
  .post(cors.corsWithOptions, (req, res, next) => {
    User.register(
      new User({ username: req.body.username }),
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
          user.is_admin = false;// setting it again explicitly here so that no one should be able to set themselves as admin. Admin status we will always set manually from the backend
          //add async infront of the function to create an async function
          user.save()
            .then(() => {
              //make sure to import Profile model at the top
              //you can use "new Profile" which will create a new instance of a Profile document which will include the save method.
              const profile = new Profile({
                user: user._id,
                first_name: req.body.first_name,
                last_name: req.body.last_name
              })
              //add try cate incase an error is thrown.
              //add await in front of the save to wait for the promise to resolve
              profile.save()
                .then(() => {
                  passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true, status: 'Registration Successful!' });
                  });
                })
                .catch(err => next(err))
            })
            .catch(err => next(err))
        }
      }
    )
  })

//Authenticating the user, being passed as middleware
userRouter.post('/login', cors.corsWithOptions, passport.authenticate('local', { session: false }), (req, res) => {
  const token = authenticate.getToken({ _id: req.user._id });

  // fetch profile details
  Profile.findOne({ "user": req.user._id })
    .then(profile => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: true,
        token: token,
        id: req.user._id,
        status: 'You are successfully logged in!',
        profile: profile
      });
    })
});

userRouter.get(
  '/logout',
  cors.corsWithOptions,
  authenticate.verifyUser,
  (req, res, next) => {
      authenticate.getToken({ _id: req.user._id }, 0);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
          success: true,
          status: 'You have successfully logged out!'
      });
  }
);

// userRouter.route('/')
// .get((req, res, next) => {
//   User.find()
//     .then(users => {
//       res.statusCode = 200;
//       res.setHeader('Content-Type', 'text/plain');
//       res.json(users);
//     })
//     .catch(err => next(err))
// })
// .delete((req, res, next) => {
//   User.deleteMany()
//     .then(response => {
//       res.statusCode = 200;
//       res.setHeader('Content-Type', 'text/plain');
//       res.json(response);
//     })
//     .catch(err => next(err))
// })

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
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    // only admin can perform this action
    User.findByIdAndUpdate(req.params.reviewId, {
      status: "Inactive"
    }, { new: true })
      .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
      })
      .catch(err => next(err));
  });
module.exports = userRouter;
