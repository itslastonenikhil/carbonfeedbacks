//----------------
//  Check Login
//----------------
const middleware = {}
middleware.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  // req.flash("error", "Please Login First!");
  res.redirect("/");
}


middleware.isAdmin = (req, res, next)=>{
  if(req.isAuthenticated()){
      console.log(req.user);
  }

  return next();
}
module.exports = middleware;