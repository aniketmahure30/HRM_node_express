const express = require("express");
const { connect } = require("mongoose");  //used to create connetion for mongoDB
const Handlebars = require("handlebars");
const { engine } = require("express-handlebars");
const passport = require("passport"); // use for login stargies authentication
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");

const { PORT, MONGODB_URL } = require("./config");  // this port & url is 
const { join } = require("path");

// import all Routing module......
const EmployeeRoute = require("./Route/employee");
const AuthRoute = require("./Route/auth");
const app = express();

require("./middlewares/passport")(passport);

//!=============database connection STARTS here====================//
let DatabaseConnection = async () => {
  await connect(MONGODB_URL);
  console.log(`Database Connceted`);
};

DatabaseConnection();

//!=============database connection ENDS here====================//

// ?========set TEMPLETE ENGINE MIDDlEWARE STATRS HERE ================//
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
// app.set("views", "./views");  //it is optional
// ?========set TEMPLETE ENGINE MIDDlEWARE ENDS HERE============//

//? ======== BUILT IN MIDDLEWARE STARTS HERE ==========//
app.use(express.static(join(__dirname, "public")));
app.use(express.static(join(__dirname, "node_modules")));

// body [parser]:it parsing incoming request body/data raw data,json data,binary
app.use(express.urlencoded({ extended: true }));
// {extended:true} it will accept any data
// {extented :false} = it will accept only string data
app.use(methodOverride("_method"));

//? ======== BUILT IN MIDDLEWARE STARTS HERE ==========//

// session Middleware
app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());


// ====== session Middlware =======

// conect flash middleware for alert msg
app.use(flash());


// Handlebars HElper Classes

//!========= helper to make img file path trim ==========//
Handlebars.registerHelper("trimString", function (passedString) {
  var theString = passedString.slice(6);
  return new Handlebars.SafeString(theString);
});

// to make gender radio button checkecd form database in editEmp.hbs
Handlebars.registerHelper("setChecked", function (value, currentValue) {
  if (value == currentValue) {
    return "checked";
  } else {
    return "";
  }
});

// to make emp_skills checkbox checked form database in editEmp.hbs
Handlebars.registerHelper("checkedIf", function (value ,currentValue) {
  let flag= false;
  for(i of currentValue){
    if (value == i) {
      flag = true;
      break;
    }
  }
  
  return flag ? "checked" : "";
});

// to make emp_edu selected dropdown form database in editEmp.hbs

 Handlebars.registerHelper("getValue", function (value, options) {
   if (options.fn(this).indexOf(value) >= 1) {
     return `selected='selected'`;
   }
 });

//!============= Handlebars HElper Classes ends  ============//

//?========= set Global Variable===============//
app.use(function (req, res, next) {
  app.locals.SUCCESS_MESSAGE = req.flash("SUCCESS_MESSAGE");
  app.locals.ERROR_MESSAGE = req.flash("ERROR_MESSAGE");
  app.locals.errors = req.flash("errors"); // sever side validation done form form
  app.locals.error = req.flash("error"); // session authentication validation
  app.locals.user = req.user || null;    /// to hide pages when user is logged in user 
  let userData = req.user || null;
  res.locals.finalData = Object.create(userData);
  res.locals.username = res.locals.finalData.username;
  next();
});


//!=====  Using Route modules======//
app.use("/employee", EmployeeRoute);
app.use("/auth", AuthRoute);


//---------- listen port----------//

app.listen(PORT, err => {
  if (err) throw err;
  console.log(`App is running on ${PORT}`);
});
