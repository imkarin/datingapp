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
let userid = null;
let url = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_HOST + "/test?retryWrites=true&w=majority";

mongo.MongoClient.connect(url, function (err, client) {
  if (err) {
    throw err;
  }
  db = client.db(process.env.DB_NAME);
  console.log("Connected to database.");
  
  // the allUsersCollection contains general data about all user accounts
  allUsersCollection = db.collection("users_profile");
})

// Session --------------------------------------------------------------------------------------
let session = require("express-session");

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true  
}))

// Handle routes ----------------------------------------------------------------------
app.get("/", allUsers);
app.get("/login", loginPage);
app.get("/browsepage", allUsers);
app.get("/likedpage", likedUsers);
app.get("/profile/:id", profile);
app.get("/profilepage", profilepage);
app.get("/profilepage/:id", profilepage);
//app.get("/succes", (req, res) => res.render("succes.ejs"));
app.post("/login", login);
//app.post("/:id", like);
app.post("/succes.ejs", addMovie);
app.delete("/:id", remove);
app.use(onNotFound);

function loginPage(req, res, next) {
  res.render("login.ejs");
}

function login(req, res, next) {
  req.session.currentUser = req.body.user;
  userid = req.session.currentUser;
  res.redirect("/");
  console.log("Logged in as user " + userid);
}

function allUsers(req, res, next) {
  // if a user is logged in, load their data
  if (userid !== null) {
    allUsersCollection.find().toArray(done);
    
    function done(err, data) {
      if (err) {
        next(err);
      } else {
        // find our current user in the db
        let currentUser = data.filter((object) => {
          return object.id == userid;
        })[0];

        // only display people that our user hasn't (dis)liked yet
        let peopleToDisplay = []; 
        for (let i = 0; i < data.length; i++) {
          if (!currentUser.hasLiked.includes(data[i].id) && !currentUser.hasDisliked.includes(data[i].id) && data[i].id !== currentUser.id) {
            peopleToDisplay.push(data[i])
          }
        }

        res.render("index.ejs", {data: peopleToDisplay});
      }
    } 
  } else {
    res.redirect("/login");
  }
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
  // load profile data
  let id = req.params.id;
  console.log("userid= " + userid + " id= " + id);
  allUsersCollection.findOne({
    id: id
  }, done);

  function done(err, data) {
    if (err) {
      console.log("Couldn't find user");
    } else {
      console.log("Found user");
      res.render("profilepage.ejs", {
        data: data
      });
    };
  };
};

function addMovie(req, res) {
  // load user id
  let id = req.params.id;
  console.log("id= ", userid)
  //the movie the user adds to his/her profile
  let insertedMovie = req.body.movieTitle

  //log this movie for confirmation
  console.log("Movie title input: ", insertedMovie);

  //search in api for the inserted movie
  request(baseURL + "search/movie/?api_key=" + APIKEY + "&query=" + insertedMovie, function (error, response, body, req, res) {
    body = JSON.parse(body); //parse the outcome to object, so requesting data is possible
    console.log("Movie title from api: ", body.results[0].original_title); //confirming the title
    let posterLink = baseImgURL + body.results[0].poster_path; //the path to the movie poster image
    console.log("imagepath: ", posterLink);

  //Add the title of the movie into the 'movies' array in the database
  allUsersCollection.updateOne({id: "'" + id + "'"}, { $addToSet: {movies: [body.results[0].original_title, posterLink] }}, function(err, req, res) {
    if (err) {
      console.log("Error, could not update database");
    } else {
      console.log("Update confirmed, added/updated " + body.results[0].original_title + ' and ' + baseImgURL + body.results[0].poster_path + ' to database');
    };
    // closes the function that is in updateOne()
  });
  //closes the function that is in request()    
  });

  //render the inserted data to the succes.ejs page
  res.render("succes.ejs",{
    data: req.body
  });

  //Confirmation for the data that is added to the database
    console.log('This data is added to the database:', data);
    console.log('title: ', req.body.movieTitle);
};

function likedUsers(req, res, next) {
  if (userid !== null) {
    // load all users data
    allUsersCollection.find().toArray(done);

    function done(err, data) {
      if (err) {
        next(err);
      } else {
        // find our current user in the db
        let currentUser = data.filter((object) => {
          return object.id == userid;
        })[0];
        
        // divide our user's likes in matches and pending
        let matches = [];
        let pending = [];
        
        // check who's matched and who's pending
        for (let i = 0; i < data.length; i++) {
          // condition for matching: you have liked them, they have liked you, you haven't deleted them, they haven't deleted you
          if (currentUser.hasLiked.includes(data[i].id) && data[i].hasLiked.includes(currentUser.id) && !currentUser.hasDisliked.includes(data[i].id) && !data[i].hasDisliked.includes(currentUser.id)) {
            matches.push(data[i]);
          // condition for pending: you have liked them, they haven't liked or disliked/deleted you yet
          } else if (currentUser.hasLiked.includes(data[i].id) && !data[i].hasLiked.includes(currentUser.id) && !data[i].hasDisliked.includes(currentUser.id)) {
            pending.push(data[i]);
          }
        }

        let likedPageContent = {
          matches: matches,
          pending: pending
        };
        
        // render the matching and pending arrays into the html
        res.render("likedpage.ejs", {data: likedPageContent});
      }
    } 
  } else {
    res.redirect("/login");
  }
}

function like(req, res, next) {
  // add liked person to our user's hasLiked array
  let id = req.params.id;
  allUsersCollection.updateOne({id: userid}, {$push: {"hasLiked": id}});

  console.log(id + " liked by " + userid)
  res.redirect("/");
}

function remove(req, res, next) {
  // add disliked person to the user's hasDisliked array
  let id = req.params.id;
  allUsersCollection.updateOne({id: userid}, {$push: {"hasDisliked": id}});
  
  console.log(id + " disliked by " + userid)
}

function onNotFound(req, res, next) {
  res.status(404).sendFile(__dirname + "/static/notfound.html")
}

// Listen on a port
app.listen(3000, () => console.log("Server is running..."));