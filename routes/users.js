var express = require('express');
const User = require('../models/user');
const Profile = require('../models/profile')
const passport = require('passport');
const authenticate = require('../authenticate');
var userRouter = express.Router();


userRouter.route('/signup')
  .post((req, res, next) => {
    User.register(
      new User({ username: req.body.username, is_admin: false }),
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
              last_name: req.body.last_name
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
userRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token: token, status: 'You are successfully logged in!' });
});

userRouter.route('/')
.get( async (req, res, next) => {
  const query = {}
  const { status, is_admin } = req.body;
  if (status)   { query.status = status     }
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
  .get( async (req, res, next) => {
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
    User.findByIdAndUpdate(req.params.reviewId,{
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
