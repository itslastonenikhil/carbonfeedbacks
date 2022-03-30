const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn } = require("./middleware");
const middleware = require("./middleware");

router.get("/", (req, res)=>{
    res.redirect("/");
})

router.get("/user", (req, res)=>{
    
    res.render('login.ejs', { 
        type: 'user',
        isLoggedIn: middleware.isLoggedIn
    });
});

router.post("/user", passport.authenticate("user-local",  {failureRedirect : "/"}), (req, res)=>{
    if(!(req.user.username && req.user.password))
        res.redirect('/login');
    
    res.redirect(`/dashboard/user/${req.user.username}`);
});

router.get("/admin", (req, res)=>{
    res.render('login.ejs', { 
        type: 'admin',
        isLoggedIn: middleware.isLoggedIn
    });
});

router.post("/admin", passport.authenticate("admin-local",  {failureRedirect : "/"},), (req, res)=>{
    if(!(req.user.username && req.user.password)){
        res.redirect('/login')
    }
    
    res.redirect(`/dashboard/admin/${req.user.username}`);
});


module.exports = router;