const express = require("express");
const { nanoid } = require("nanoid");
const {
  db,
  User,
  Admin,
  Service,
  Feedback,
  TABLE_NAMES,
} = require("./database");
const routes = require("./routes");
const utility = require("./utility");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local");

//========================================
//  PASSPORT CONFIGURATION
//========================================

const PORT = 4000;
const app = express();

app.use(
  require("express-session")({
    secret: "ready_to_die",
    resave: false,
    saveUninitialized: false,
  })
);

//Adding Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());

async function verifyUser(user, password, done) {
  //If user does not exists, then the array is length
  if (user.length === 0)
    return done(null, false, { message: "User Not Found!" });

  //Since, there is a unique user, our first element will be that user
  user = user[0];

  //Hashing Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Comparing the hashed passowrd with the current typed password
  let isMatching = false

  try {
    isMatching = await bcrypt.compare(password, user.password)
    // isMatching = (password == user.password)


    if (!isMatching)
      return done(null, false, { message: "Incorrect Password" });
    else console.log("Password matches!");

    return done(null, user);

  } catch (error) {
    throw error
  }



}

passport.use('user-local', new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.getUserByUsername(username);

    await verifyUser(user, password, done);
  }
  catch (err) {
    throw err;
  }
})
);

passport.use('admin-local', new LocalStrategy(async (username, password, done) => {
  try {
    const admin = await Admin.getAdminByUsername(username);
    
    await verifyUser(admin, password, done);
  }
  catch (err) {
    throw err;
  }
})
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use((req, res, next) => {
  res.locals.current_user = req.user;
  next();
});


//---------------
// Logout 
//---------------
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

// =======================
// Include Routes
//========================
app.use("/dashboard", routes.dashboard);
app.use("/register", routes.register);
app.use("/login", routes.login);


 
//------------
//Routes
//------------

app.get("/", (req, res) => {
  res.redirect('/login/admin');
});

app.get("/", async (req, res) => {
  res.send("<h1>Hello World</h1>");
});


app.listen(PORT, (req, res, err) => {
  console.log(`Server started at http://localhost:${PORT}`);
  //console.log(`Server started at http://${process.env.IP}:${PORT}`)
});
