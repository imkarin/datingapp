<p align="center"><img width="100%" alt="wavylogo" src="https://user-images.githubusercontent.com/57796369/79156952-0d6ce300-7dd4-11ea-8cd9-1dbc453a9a06.png" /></p>

<h1 align="center">Wavy Dating App</h1>
 <h4 align="center">A dating app for movie and show lovers.</h4>

Welcome to the Wavy repo! This repository contains the files for a team project for Block Tech 2020, for the bachelor Communication and Multimedia Amsterdam.

Wavy is a dating app for anyone who enjoys spending their free time watching movies and shows. After making an account, you can tell the dating app about your favourite movies and series, and connect with people with similar cinematic tastes.

This project is made by Karin Meijvogel and Jelmer Overeem, and is partially based on individual research and features that we've made before joining forces. To read more about this, we'd like to refer you to **[Karin's](https://github.com/KarinMeijvogel/bloktech/wiki)** and **[Jelmer's](https://github.com/Jelmerovereem/dating-app-feature/wiki)** indivual wiki's as well. You can read about the team progress and research in **[this repository's wiki](https://github.com/KarinMeijvogel/datingapp/wiki)**.

## Table of contents 📜
* [Installation guide](#installation-guide-%EF%B8%8F)
* [Database structure](#database-structure-)
* [App features](#app-features-)
* [Sources](#sources-)


<img src="https://i.imgur.com/TtBEJ8z.png" width="33%"><img src="https://i.imgur.com/hqh7Jhv.png" width="33%"><img src="https://i.imgur.com/QPssjUy.png" width="33%">

## Installation guide 🖱️
If you just want to try the app for yourself, you can visit it on [wavy-dating.herokuapp.com](http://wavy-dating.herokuapp.com/). You can also clone the repository to your desired location. Then navigate to it:

```
git clone https://github.com/KarinMeijvogel/datingapp.git
cd bloktech
```

Once you're in the directory, install the required node modules:

```
npm install
```

Finally, start the server:
```
npm run start
```

To run the app in dev mode, run:
```
nodemon
```

You can now go to http://localhost:3000/ in your browser and view the app. Create an account on the /register page, and go to the /login page to switch between users. Enjoy!

## Database structure 📂
To understand the code better, it's useful to know how the database is structured. Our MongoDB database has one collection called "users". Every object in this collection stands for a user in the app, with its own properties:

* `string` firstName
* `string` lastName
* `number` age
* `string` gender
* `string` description
* `array` preferences
    - `array` gender
    - `number` minAge
* `string` location
* `array` movies
* `array` hasLiked (with liked people's IDs)
* `array` hasDisliked (with disliked people's IDs)
* `object` messages

<br />
<img src="https://user-images.githubusercontent.com/57796369/79160698-81aa8500-7dda-11ea-926b-c8cdac1387b8.gif">

## App features ✨
### Registration
Users can create an account on the registration page. They fill in their name, e-mail, age, preferences and profile picture. Passwords get stored in the database as hashes, using **Argon 2**.

### Login
Users can login using their e-mail and password. Verification goes through **Argon 2**.

### Profile page
On their profile page, the user can edit their profile picture and add/delete movies to his account. Based on their favourite movies, the app shows them people with similar interests on the discover page.

### Discover page
On the discover page, the user sees people who meet his preferences and have similar favourite movies on their profiles.

### Age and gender filter
The user can set a preferred gender and minimum age for the people on the discover page, to find his ideal date.

### Matching
When the user sees someone who interests him, they can press the like button. The other person appears on the 'liked' page: if the other user hasn't liked our user yet, in the 'pending' section. If it's a mutual like, in the 'matches' section.

## Sources 🔎
### Project Tech
* airbnb. (n.d.). airbnb/javascript. Retrieved February 5, 2020, from https://github.com/airbnb/javascript/blob/master/README.md#arrow-functions
* F. (n.d.). Atom vs Sublime Text vs Visual Studio Code | What are the differences? Retrieved February 20, 2020, from https://stackshare.io/stackups/atom-vs-sublime-text-vs-visual-studio-code
* Goldspink, M. (2017, January 18). Best Text Editor? Atom vs Sublime vs Visual Studio Code vs Vim. Retrieved from https://www.codementor.io/@mattgoldspink/best-text-editor-atom-sublime-vim-visual-studio-code-du10872i7
* Hartikainen, J. (2015, March 5). A Comparison of JavaScript Linting Tools. Retrieved from https://www.sitepoint.com/comparison-javascript-linting-tools/
* javascript linting tools comparison. (n.d.). Retrieved February 20, 2020, from https://codeburst.io/javascript-linting-tools-comparison-ebcb4aa23c49
* JavaScript Style Guide. (n.d.). Retrieved February 5, 2020, from https://www.w3schools.com/js/js_conventions.asp

### Frontend
* Closures. (2020, March 6). Retrieved from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
* JavaScript Hoisting. (n.d.). Retrieved March 19, 2020, from https://www.w3schools.com/js/js_hoisting.asp
* The Coding Train. (2017, February 22). 9.19: Prototypes in Javascript - p5.js Tutorial [Video file]. Retrieved from https://www.youtube.com/watch?v=hS_WqkyUah8
* The Coding Train. (2019, February 28). 9.20: Look away! Inheritance with Prototype in JavaScript - p5.js Tutorial [Video file]. Retrieved from https://www.youtube.com/watch?v=CpmE5twq1h0
* Ontwikkelen met progressive enhancement · Fronteers. (n.d.). Retrieved February 25, 2020, from https://fronteers.nl/blog/2015/05/ontwikkelen-met-progressive-enhancement
* Progressive Enhancement: What It Is, And How To Use It? (2009, April 22). Retrieved from https://www.smashingmagazine.com/2009/04/progressive-enhancement-what-it-is-and-how-to-use-it/
* Cosset, D. (2019, February 16). Higher-order functions in Javascript. Retrieved from https://dev.to/damcosset/higher-order-functions-in-javascript-4j8b
* Higher-Order Functions :: Eloquent JavaScript. (n.d.). Retrieved March 5, 2020, from https://eloquentjavascript.net/05_higher_order.html
* Loops and iteration. (2020, January 30). Retrieved from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration
* The Coding Train. (2018, February 19). 16.5: Higher Order Functions in JavaScript - Topics of JavaScript/ES6 [Video file]. Retrieved from https://www.youtube.com/watch?v=H4awPsyugS0

### Backend
* Best JavaScript templating engines. (n.d.). Retrieved February 27, 2020, from https://www.slant.co/topics/51/~best-javascript-templating-engines
* Collection Methods — MongoDB Manual. (n.d.). Retrieved March 7, 2020, from https://docs.mongodb.com/manual/reference/method/js-collection/
* EJS -- Embedded JavaScript templating. (n.d.). Retrieved February 27, 2020, from https://ejs.co/
* Express basic routing. (n.d.). Retrieved February 10, 2020, from https://expressjs.com/en/starter/basic-routing.html
* Express routing. (n.d.). Retrieved February 27, 2020, from https://expressjs.com/en/guide/routing.html
* Get Started with Atlas — MongoDB Atlas. (n.d.). Retrieved March 7, 2020, from https://docs.atlas.mongodb.com/getting-started/
* MongoDB. (n.d.). Compass. Retrieved March 7, 2020, from https://www.mongodb.com/products/compass
* Mongoose v5.9.5: Getting Started. (n.d.). Retrieved March 7, 2020, from https://mongoosejs.com/docs/
* NPM global or local packages. (n.d.). Retrieved February 10, 2020, from https://nodejs.dev/npm-global-or-local-packages
* npm: mongodb. (2020, March 11). Retrieved from https://www.npmjs.com/package/mongodb
* Traversy Media. (2019a, February 22). Express JS Crash Course [Video file]. Retrieved from https://www.youtube.com/watch?v=L72fhGm1tfE
* Traversy Media. (2019b, February 6). Node.js Crash Course [Video file]. Retrieved from https://www.youtube.com/watch?v=fBNz5xF-Kx4
