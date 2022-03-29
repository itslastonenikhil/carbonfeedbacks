const express = require("express");
const router = express.Router();
const passport = require("passport")


router.get("/user", (req, res)=>{
    // res.render('index/login.ejs')
    res.send("Login Page");
});

router.post("/user", passport.authenticate("user-local",  {failureRedirect : "/login/user"}), (req, res)=>{
    if(!(req.user.username && req.user.password)){
        res.redirect('/login/user')
    }
    
    res.redirect('/dashboard/user/' + req.user.username);
});

router.get("/admin", (req, res)=>{
    // res.render('index/login.ejs')
    res.send("Admin Page");
});

router.post("/admin", passport.authenticate("admin-local",  {failureRedirect : "/login/admin"},), (req, res)=>{
    if(!(req.user.username && req.user.password)){
        res.redirect('/login/admin')
    }
    
    res.redirect('/dashboard/admin/' + req.user.username);
   
});


module.exports = router;