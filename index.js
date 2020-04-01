// "Server started" message --------------------------------------------------------------------
console.log("Server started, wait for database to connect...");

// Express --------------------------------------------------------------------------------------
const express = require("express");
const app = express();

// Define static files folder -------------------------------------------------------------------
app.use("/static", express.static("static"));

// EJS ------------------------------------------------------------------------------------------
app.set("view engine", "ejs");

// Use body-parser ------------------------------------------------------------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// MongoDB ---------------------------------------------------------------------------------------
require("dotenv").config();
const mongo = require("mongodb");

let db = null;
const url = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_HOST + "/test?retryWrites=true&w=majority";

mongo.MongoClient.connect(url, function (err, client) {
  if (err) {
    throw err;
  }
  db = client.db(process.env.DB_NAME);
  console.log("Connected to database.");
  
  // the allUsersCollection contains general data about all user accounts
  allUsersCollection = db.collection("users");
})

// Session --------------------------------------------------------------------------------------
const session = require("express-session");

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true  
}))

// Handle routes ---------------------------------------------------------------------------------
app.get("/", allUsers);
app.get("/login", loginPage);
app.get("/browsepage", allUsers);
app.get("/addfilters", filterPage);
app.get("/likedpage", likedUsers);
app.get("/profile/:id", profile);
app.post("/login", login);
app.post("/addfilters", addFilters);
app.post("/:id", like);
app.delete("/:id", remove);
app.use(onNotFound);

function loginPage(req, res, next) {
  res.render("login.ejs");
}

function login(req, res, next) {
  allUsersCollection.findOne({email: req.body.useremail}, (err, data) => {
    if (err) {
      next (err);
    } else {
      // if e-mail doesn't exist
      if (data == null) {
        res.redirect("/login");
        console.log("No user for this e-mail")
        return;
      }
      // if e-mail and password match
      if (req.body.password == data.password) {
        req.session.user = data;
        console.log("Logged in as " + req.session.user.name);
        res.redirect("/");
      } else {
      // if password is incorrect
      console.log("Incorrect password");
      res.redirect("/login");
      }
    }
  })
}

function allUsers(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }

  // display the people who match our user's filters
  allUsersCollection.find({
    $and: [
      {_id: {$ne: mongo.ObjectId(req.session.user._id)}},
      {id: {$nin: req.session.user.hasLiked}},
      {id: {$nin: req.session.user.hasDisliked}},
      {gender: {$in: req.session.user.preference["gender"]}},
      {age: {$gte: req.session.user.preference["minAge"]}}
    ]
  }).toArray(done)

  function done(err, filteredPeople) {
    if (err) {
      next (err);
    } else {
      res.render("index.ejs", {data: filteredPeople})
    }
  }
}

function filterPage(req, res, next) {
  res.render("addfilters.ejs");
}

function addFilters(req, res, next) {
  // put filter-formdata in the user's preferences-object in the db
  const userPrefs = {};
  userPrefs["minAge"] = parseInt(req.body.years);
  userPrefs["gender"] = req.body.gender;

  // make sure the "gender" prefs is an array
  if (!Array.isArray(userPrefs["gender"])) {
    userPrefs["gender"] = req.body.gender.split(" ");
  }

  // update the user's prefs in the database
  allUsersCollection.updateOne(
    {_id: mongo.ObjectId(req.session.user._id)},
    { $set: {preference: userPrefs}})
  
  // then also update the userdata in the session
    req.session.user.preference = userPrefs;
    res.redirect("/");
}
  
function profile(req, res, next) {
  // load profile data
  let id = req.params.id;
  allUsersCollection.findOne({
    id: id
  }, done)
  
  function done(err, data) {
    if (err) {
      next(err);
    } else {
      res.render("profile.ejs", {data: data});
    }
  }
}

function likedUsers(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }

  // divide our user's likes in matches and pending
  let matches = [];
  let pending = [];

  allUsersCollection.find({id: {$in: req.session.user.hasLiked}}).toArray(done)

  function done(err, data) {
    if (err) {
      next (err);
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].hasLiked.includes(req.session.user.id) && !req.session.user.hasDisliked.includes(data[i].id) && !data[i].hasDisliked.includes(req.session.user.id)) {
          matches.push(data[i]);
        } else if (!req.session.user.hasDisliked.includes(data[i].id) && !data[i].hasDisliked.includes(req.session.user.id)) {
          pending.push(data[i]);
        }
      }
      // render the matching and pending arrays into the html
      let likedPageContent = {matches, pending};
      res.render("likedpage.ejs", {data: likedPageContent});
    }
  }
}

function like(req, res, next) {
  // add liked person to our user's hasLiked array
  let id = req.params.id;
  allUsersCollection.updateOne({_id: mongo.ObjectId(req.session.user._id)}, {$push: {"hasLiked": id}});

  // also update the userdata in the session
  req.session.user.hasLiked.push(id);
  res.redirect("/");
}

function remove(req, res, next) {
  // add disliked person to the user's hasDisliked array
  let id = req.params.id;
  allUsersCollection.updateOne({_id: mongo.ObjectId(req.session.user._id)}, {$push: {"hasDisliked": id}});
  
  // also update the userdata in the session
  req.session.user.hasDisliked.push(id);
  res.redirect("/");
}

function onNotFound(req, res, next) {
  res.status(404).sendFile(__dirname + "/static/notfound.html");
}

// Listen on a port
app.listen(3000);