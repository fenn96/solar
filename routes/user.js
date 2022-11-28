const express = require("express")
const { signup, signin, signout, newSolar } = require("../controllers/user")
const { requireAuth, checkUser } = require('../middleware/auth');
const {check} = require('express-validator')
const Solar = require("../models/solar")
const router = express.Router()

// Check User GET method - Allows access to current user information through app.locals.user
router.get('/*', checkUser);

// Register GET method - Renders the registration page
router.get('/signup', (req, res) => {
  return res.render('signup');
});

// Register POST method - Handles registration
router.post('/signup', [
  check("firstName", "First name should be at least 3 characters").isLength({min: 3}),
  check("firstName", "First name should be less than 32 characters").isLength({max: 32}),
  check("lastName", "Last name should be at least 3 characters").isLength({min: 3}),
  check("lastName", "Last name should be less than 3 characters").isLength({max: 32}),
  check("email", "Email should be valid").isEmail(),
  check("password", "Password should be at least 6 characters").isLength({min: 6}),
] ,signup)

// Login GET method - Renders the login page
router.get('/', (req, res) => {
  return res.render('signin');
});


// Login POST method - Handles logging in
router.post('/', signin)

// Forgot Password Page GET method - Renders the forgot password page
router.get('/forgot-password', (req, res) => {
  return res.render('forgot-password');
});

// Property GET method - Gets property info to show if there are any properties that have the current user's id associated with them
// (Also renders the dashboard page)
router.get('/dashboard', requireAuth, async (req, res) => {
  try{
        const solars = await Solar.find({})
        res.render('dashboard', {
          solars: solars,
          firstName: res.app.locals.user.firstName,
          id: res.app.locals.user.id
        })
    } catch(error) {
      console.log(error)
        res.redirect('/', {
          error: "Error logging in"
        })
    }
});

// Dev POST method for making new Solars easily
router.post('/solar', newSolar)

// Logout GET method - Handles logging out
router.get("/signout", signout)

module.exports = router