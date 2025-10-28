const User = require("../models/user.js");


module.exports.renderSignUpForm = (req,res) => {
    res.render("reg_User/signUp.ejs");
};

module.exports.signUp = async(req,res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User ({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err) =>{
            if(err){
                return next();
            }
            req.flash("success", "You Signed in Successfully! Welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogInForm = (req,res) => {
    res.render("reg_User/login.ejs");
};

module.exports.logIn = async(req,res) => {
        req.flash("success","Welcome Back to Wanderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
};

module.exports.logOut = (req,res,next) => {
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    req.flash("success","You logged Out!");
    res.redirect("/listings");
    })
};