// "Server started" message ---------------------------------------------------------------------
console.log("Server started, wait for database to connect...");

// Require .env ---------------------------------------------------------------------------------
require("dotenv").config();

// Express --------------------------------------------------------------------------------------
const express = require("express");
const app = express();

// Multer --------------------------------------------------------------------------------------
const multer = require("multer");
let storage = multer.diskStorage({
  destination: function (req, files, cb) {
    cb(null, "static/images/")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
let fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
    ) {
    cb(null, true);
  } else {
    cb(new Error("File format should be PNG,JPG,JPEG"), false);
  }
};
let upload = multer({ storage: storage, fileFilter: fileFilter });

// Compression ----------------------------------------------------------------------------
const compression = require("compression");
app.use(compression());

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

// Use Argon2 (password hashing) -----------------------------------------------------------------
const argon2 = require('argon2');

// MongoDB ---------------------------------------------------------------------------------------
require("aws-sdk");

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

// Mongoose -------------------------------------------------------------------------------------
const mongoose = require('mongoose');

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
app.get("/register", (req, res) => res.render("register.ejs")); 
app.get("/succes", (req, res) => res.render("succes.ejs"));
app.get("/events", function (req, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");

  let timer = setInterval(function () {
    res.write("data: ping\n\n");

    res.flush();
  }, 2000)
  res.on("close", function () {
    clearInterval(timer);
  });
});
app.post("/login", login);
app.post("/profilepage.ejs", addMovie);
app.post("/succes.ejs", removeMovie);
app.post("/register.ejs", upload.single("userImage"), registerUser);
app.post("/addfilters", addFilters);
app.post("/:id", like);
app.delete("/:id", remove);
app.use(onNotFound);

function loginPage(req, res, next) {
  res.render("login.ejs");
}

function login(req, res, next) {
  allUsersCollection.findOne({email: req.body.useremail}, async (err, data) => {
    if (err) {
      next (err);
    } else {
      // if e-mail doesn't exist
      if (data == null) {
        res.redirect("/login");
        console.log("No user for this e-mail");
        return;
      }
      // if e-mail and password match
      if (await argon2.verify(data.password, req.body.password)) {
        req.session.user = data;
        console.log("Logged in as " + req.session.user.name);
        res.redirect("/");
      } else {
        // if they don't match
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

  // convert our user's hasLiked + hasDisliked array (with strings) into array with mongo objectIDs, for the mongo query
  let likedObjects = req.session.user.hasLiked.map(s => mongoose.Types.ObjectId(s));
  let dislikedObjects = req.session.user.hasDisliked.map(s => mongoose.Types.ObjectId(s));

  // display the people who match our user's filters
  allUsersCollection.find({
    $and: [
      {_id: {$ne: mongo.ObjectId(req.session.user._id)}},
      {_id: {$nin: likedObjects}},
      {_id: {$nin: dislikedObjects}},
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
    _id: mongo.ObjectId(id)
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
    allUsersCollection.findOne({_id: mongo.ObjectId(req.session.user._id)}, (err, data) => {
      if (err){
        console.log("Error, cannot find the user");
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
    let userSessionID = req.session.user._id;
  
    // search in api for the inserted movie
    request(baseURL + "search/movie/?api_key=" + APIKEY + "&query=" + insertedMovie, function (error, response, body, req, res) {
      body = JSON.parse(body); // parse the outcome to object, so requesting data is possible
      let posterLink = baseImgURL + body.results[0].poster_path; // the path to the movie poster image

      allUsersCollection.updateOne({_id: mongo.ObjectId(userSessionID)}, { $addToSet: {movies: {
        title: body.results[0].original_title,
        posterImage: posterLink,
        description: body.results[0].overview
      }}}, (err, req, res) => {
        if (err) {
          console.log("could not add movie to movies");
        } else {
          console.log("update confirmed, movie is added");
        };
      });
    });
    res.redirect('/profilepage');
  };
};

function removeMovie(req, res) {
  let selectedMovie = req.body.movieTitle;
  console.log("function removeMovie...")
  console.log(selectedMovie);

  if (!req.session.user) {
    res.redirect("/login")
  } else {
    // assign the session user name to a variable
    let userSessionID = req.session.user._id;

    // remove the movie in database
    allUsersCollection.updateOne({_id: mongo.ObjectId(userSessionID)}, {$pull: {movies: {title: selectedMovie}}}, (err, req, res) => {
      if (err) {
        console.log("could not remove movie");
        console.log(err);
      } else {
        console.log("removed movie");
      };
    });
    res.redirect("/profilepage");
  };
};

async function registerUser(req, res, file) {
  let hash = await argon2.hash(req.body.password); // hash the inserted password

  let birthdate = req.body.birthday; // get inserted date
  let birthday = +new Date(birthdate);
  let age = Math.floor((Date.now() - birthday) / 31557600000); // calculate age

  allUsersCollection.insertOne({
    email: req.body.useremail,
    password: hash,
    name: req.body.name,
    age: age,
    gender: req.body.gender,
    photo: req.file.originalname,
    desc: req.body.desc,
    preference: {
      gender: [req.body.prefGenderMale, req.body.prefGenderFemale],
      minAge: parseInt(req.body.prefAge)
    },
    location: req.body.location,
    movies: [],
    hasLiked: [],
    hasDisliked: [],
    messages: {}
  }, (err, req, res) => {
    if (err) {
      console.log("Could not post/add form");
    } else {
      console.log("Added user!");
    }
  })
  res.redirect("/login");
};

function likedUsers(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }

  // convert our user's hasLiked + hasDisliked array (with strings) into array with mongo objectIDs, for the mongo query
  let likedObjects = req.session.user.hasLiked.map(s => mongoose.Types.ObjectId(s));
  let dislikedObjects = req.session.user.hasDisliked.map(s => mongoose.Types.ObjectId(s));

  // divide our user's likes in matches and pending
  let matches = [];
  let pending = [];

  allUsersCollection.find({
    $and: [
      {_id: {$in: likedObjects}},
      {_id: {$nin: dislikedObjects}}
    ]}).toArray(done);

  function done(err, data) {
    if (err) {
      next (err);
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].hasLiked.includes(req.session.user._id) && !req.session.user.hasDisliked.includes(data[i]._id) && !data[i].hasDisliked.includes(req.session.user._id)) {
          matches.push(data[i]);
        } else if (!req.session.user.hasDisliked.includes(data[i]._id) && !data[i].hasDisliked.includes(req.session.user._id)) {
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
app.listen(process.env.PORT || 3000);
