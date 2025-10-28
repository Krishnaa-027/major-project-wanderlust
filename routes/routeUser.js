const express = require("express");
// const router = express.Router({mergeParams: true});
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const {saveredirectUrl} = require("../middleware.js");

const userController = require("../controllers/ctrlUser.js");

router.route("/signup")
  .get(userController.renderSignUpForm)
  .post( wrapAsync(userController.signUp));


router.route("/login")
  .get(userController.renderLogInForm )
  .post(saveredirectUrl, 
    passport.authenticate("local", {failureRedirect: `/login`, failureFlash : true}), 
    userController.logIn);

    
router.get("/logout",userController.logOut);



module.exports = router;