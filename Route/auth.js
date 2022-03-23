const { Router } = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs") // to encrypt password middleware third party
const UserSchema = require("../Model/Auth")
const router = Router();  



//? ========= get Request=============//
/*
@HTTP GET REQUEST
@ ACCESS PUBLIC
@URL /auth/register

*/
router.get("/register", (req, res) => {
    res.render("../views/auth/register", {});
})

/*
@HTTP GET REQUEST
@ ACCESS PUBLIC
@URL /auth/login

*/
router.get("/login", (req, res) => {
    res.render("../views/auth/login", {});
})

/*
@HTTP GET REQUEST
@ ACCESS PUBLIC
@URL /auth/logout
*/

router.get("/logout", async (req, res) => {
    await req.logout();   // logout is a function provide by express to logout of session
    req.flash("SUCCESS_MESSAGE", "Successfully Logged Out");
    res.redirect("/auth/login",302, {})
})



/*
@HTTP POST REQUEST
@ ACCESS PUBLIC
@URL /auth/register

*/
router.post("/register", async (req, res) => {
    // res.render("./views/auth/register")
    let { username, email, password, confirmpassword } = req.body;
    let errors = [];
    if (!username) {
        errors.push({ text: "username is required" })
    }
    if (!email) {
        errors.push({ text: "email is required" });
    }
    if (!password) {
        errors.push({ text: "password is required" });
    }
    if (password !== confirmpassword) {
        errors.push({ text: "password is not match" });
    }
    if (errors.length > 0) {
        res.render("../views/auth/register", {
            errors,
            username,
            email,
            password,
            confirmpassword,
        });
    }
    else {
        let user = await UserSchema.findOne({ email });
        if (user)
        {
            req.flash("ERROR_MESSAGE", `Email already exits`);
            res.redirect("/auth/register",302,{})
        }
        else
        {
            let newUser = new UserSchema({
                username,
                email,
                password,
            });

            bcrypt.genSalt(12, (err, salt) => {      //12&10 will be alogrithm salt createEncryption   // to store encrypt the password in database
                if (err) throw err;
                bcrypt.hash(newUser.password, salt,async (err, hash) => {    // hash hold the encrypted password
                    if (err) throw err;
                    // console.log(hash)
                    newUser.password = hash;
                    await newUser.save();
                    req.flash("SUCCESS_MESSAGE", ` Successfully Registered`);
                    res.redirect("/auth/login", 302, {});
                })

            })
            
        }
    }
});

/*
@HTTP POST REQUEST
@ ACCESS PUBLIC
@URL /auth/login

*/


router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/employee/home",
        failureRedirect: "/auth/login",
        failureFlash: true,
        successFlash:true,
    })(req, res, next);
    req.flash("SUCCESS_MESSAGE", "Successfully logged-in");
})


module.exports = router ;
