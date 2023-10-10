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

const checkAuthenticationType = (username) => {
  if (!username) { // check if field is empty
    return 0;
  } else if (!username.includes('@')) { // check if not an email id then check if a valid phone number
    const regex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
    if ((!username || regex.test(username) === false)) {
      return 0;
    }
    return "phone-password";
  } else { // check if its valid email id
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(username)) {
      return 0;
    }
    return "email-password";
  }
}

userRouter.route('/signup')
  .post(cors.corsWithOptions, (req, res, next) => {

    // check authentication type
    const auth_type = checkAuthenticationType(req.body.username)
    console.log(req.body.username, auth_type);
    if ( auth_type === 0) {
      err = new Error('Not Valid Username');
      err.status = 404;
      return next(err);
    }

    User.register(
      new User({ username: req.body.username, is_admin: false, authentication_method: auth_type }),
      req.body.password,
      async (err, user) => {
        if (err) {
          console.log(err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
        } else {
          console.log(`User ${user._id} successfully created!`);
          try {
            const profileInfo = new Profile({
              user: user._id,
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: (auth_type === "email-password") ? req.body.username : "",
              phone: (auth_type === "phone-password") ? req.body.username : ""
            })
            const profile = await profileInfo.save();
            passport.authenticate('local')(req, res, () => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({ success: true, user: user, profile: profile });
            });

          } catch (err) {
            next(err);
          }
        }
      }
    )
  })

//Authenticating the user, being passed as middleware
userRouter.post('/login', cors.corsWithOptions, passport.authenticate('local', { session: false }), (req, res) => {
  const token = authenticate.getToken({ _id: req.user._id });

  // fetch profile details
  Profile.findOne({ "user": req.user._id })
    .populate('contacts')
    .populate('address')
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
userRouter.route('/')
  .get(async (req, res, next) => {
    const query = {}
    const { status, is_admin } = req.body;
    if (status) { query.status = status }
    if (is_admin) { query.is_admin = is_admin }

    try {
      const users = await User.find(query);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.json(users);
    } catch (err) {
      next(err)
    }
  })
// .post((req, res, next) => {
//   User.create(req.body)
//     .then((user) => {
//       res.statusCode = 200;
//       res.setHeader('Content-Type', 'text/plain');
//       res.json(user);
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
  .get(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.userId);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
    } catch (err) {
      next(err)
    }
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
