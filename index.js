// "Server started" message ---------------------------------------------------------------------
console.log("Server started, wait for database to connect...");

// Require .env ---------------------------------------------------------------------------------
require("dotenv").config();

// Express --------------------------------------------------------------------------------------
const express = require("express");
const app = express();

// Movie database API ----------------------------------------------------------------------------
const request = require('request');
  // This is the baseURl for accessing the API database
let baseURL = 'https://api.themoviedb.org/3/';
  // This is the baseURl for the images for accessing the images in the API database
let baseImgURL = 'https://image.tmdb.org/t/p/w500';
  // The id of a movie in the API database
let movieIdApi = 'null';
  // The APIKEY
let APIKEY = process.env.APIKEY;

// Define static files folder -------------------------------------------------------------------
app.use("/static", express.static("static"));

// EJS ------------------------------------------------------------------------------------------
app.set("view engine", "ejs");

// Use body-parser ------------------------------------------------------------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// MongoDB ---------------------------------------------------------------------------------------
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
  allUsersCollection = db.collection(process.env.DB_COLLECTION);
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
app.get("/profilepage", profilepage);
//app.get("/succes", (req, res) => res.render("succes.ejs"));
app.post("/login", login);
app.post("/succes.ejs", addMovie);
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
  console.log("id= " + id + " userid= " + userid);
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

function profilepage(req, res) {
  if (!req.session.user) {
    res.redirect("/login");
    return
  } else {
    allUsersCollection.findOne({id: req.session.user.id}, (err, data) => {
      if (err){
        console.log("Error, cannot find the user");
      } else {
        console.log("Found user")
      };

      res.render("profilepage.ejs", {
        data: data
      });
    });
  };
};

function addMovie(req, res) {
  // the movie the user adds to his profile
  let insertedMovie = req.body.movieTitle;

  if (!req.session.user) {
    res.redirect("/login");
  } else {
    // assign the session user name to a variable
    let userSessionID = req.session.user.id;
  
    // search in api for the inserted movie
    request(baseURL + "search/movie/?api_key=" + APIKEY + "&query=" + insertedMovie, function (error, response, body, req, res) {
      body = JSON.parse(body); // parse the outcome to object, so requesting data is possible
      let posterLink = baseImgURL + body.results[0].poster_path; // the path to the movie poster image

      allUsersCollection.updateOne({id: userSessionID}, { $addToSet: {movies: {
        title: body.results[0].original_title,
        posterImage: posterLink,
        description: body.results[0].overview
      }}}, (err, req, res) => {
        if (err) {
          console.log('could not add movie to movies');
        } else {
          console.log('update confirmed, movie is added')
        };
      });
    });
    res.redirect('/profilepage');
  };
};

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
