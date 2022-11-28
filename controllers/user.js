const Owner = require("../models/owner")
const Solar = require("../models/solar")
const {validationResult} = require('express-validator')
var jwt = require('jsonwebtoken')

// Handles registration of User
exports.signup = (req, res) => {
  const errors = validationResult(req)

  if(!errors.isEmpty()) {
    return res.render('signup', {
      error: errors.array()[0].msg
    })
  }

  const owner = new Owner({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  })
  owner.save((err, owner) => {
    if(err) {
      return res.render('signup', {
        error: "Unable to add user"
      });
    }

    console.log("Successfully created account!")
    return res.render('signup', {
      error: "Successfully created account!"
    })
  })
}

// Handles Signing in of user
exports.signin = (req, res) => {
  let email = req.body.email;
	let password = req.body.password;

  Owner.findOne({email}, (err, owner) => {
    if(err || !owner || !owner.authenticate(password)) {
      return res.render('signin', {
        error: "Incorrect password or email not found"
      })
    }

    // Create token
    const token = jwt.sign({_id: owner._id}, process.env.SECRET)

    // Put token in cookie
    res.cookie('token', token, {expire: new Date() + 1})

    res.redirect('dashboard')

    // Send response
  /*const {_id, firstName, lastName, email} = user
   return res.json({
    token,
   user: {
   _id,
   firstName,
   lastName,
   email
  }
  })*/
    
  })
}

// Handles Signing out of User
exports.signout = (req, res) => {
  res.clearCookie("token")
  res.redirect('/');
  //return res.json({
  //  message: "User signout successful"
  //})
}

// Creates a New Property - CURRENTLY WORKING
exports.newSolar = (req, res) => {
  const errors = validationResult(req)

  if(!errors.isEmpty()) {
    console.log(errors.array()[0].msg)
  }

  const solar = new Solar({
    ownerId: req.app.locals.user.id,
    voltage: req.body.voltage,
    amperage: req.body.amperage,
    current: req.body.current
  })
  solar.save((err, solar) => {
    if(err) {
      console.log(err);
      console.log("Unable to add solar")
    } else {
      console.log("Added Solar Successfully")
      console.log(solar)
    }
  })
}

