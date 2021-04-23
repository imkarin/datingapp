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
* [NPM packages](#npm-packages-)
* [License](#license-)
* [Sources](#sources-)


<img src="https://i.imgur.com/TtBEJ8z.png" width="33%"><img src="https://i.imgur.com/hqh7Jhv.png" width="33%"><img src="https://i.imgur.com/QPssjUy.png" width="33%">

## Installation guide 🖱️
### Requirements
To run this project, you'll need Node and Git installed. Also, any text editor and MongoDB compass are useful, if you want to look into the code and see the database structure for yourself.

### Install
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
We've subdivided the app into several features:
* [Registration](#registration)
* [Login](#login)
* [Profile page](#profile-page)
* [Discover page](#discover-page)
* [Movie filter](#movie-filter)
* [Age and gender filter](#age-and-gender-filter)
* [Matching](#matching)

### Registration
Users can create an account on the registration page. They fill in their name, e-mail, age, preferences and profile picture. Passwords get stored in the database as hashes, using **Argon 2**.

<img src="https://user-images.githubusercontent.com/57796369/79169403-a60f5d00-7dec-11ea-8d0b-2f4cf8cd898a.gif" width="20%" />

***

### Login
Users can login using their e-mail and password. Verification goes through **Argon 2**.

<img src="https://user-images.githubusercontent.com/57796369/79170166-dc4ddc00-7dee-11ea-8c5c-98e2255f4fb2.gif" width="20%" />

***

### Profile page
On their profile page, the user can edit their profile picture and add/delete movies to his account.

<img src="https://user-images.githubusercontent.com/57796369/79170081-97c24080-7dee-11ea-88fc-3f7b84ac52af.gif" width="20%" />

***

### Discover page
On the discover page, the user sees people who meet his preferences and have similar favourite movies on their profiles.

<img src="https://user-images.githubusercontent.com/57796369/79170665-5a5eb280-7df0-11ea-881c-fda30e87231c.gif" width="20%" />

***

### Movie filter
Based on the user's favourite movies and series, the app shows them people with the same movies/series on the discover page.

<img src="https://user-images.githubusercontent.com/57796369/79170699-75c9bd80-7df0-11ea-9c63-437dcf95a9a7.gif" width="20%" />

***

### Age and gender filter
The user can set a preferred gender and minimum age for the people on the discover page, to find his ideal date.

<img src="https://user-images.githubusercontent.com/57796369/79170713-79f5db00-7df0-11ea-8be5-9789c6bef79f.gif" width="20%" />  <img src="https://user-images.githubusercontent.com/57796369/79170716-7bbf9e80-7df0-11ea-8243-b705fe08a31d.gif" width="20%" />

***

### Matching
When the user sees someone who interests him, they can press the like button. The other person appears on the 'liked' page: if the other user hasn't liked our user yet, in the 'pending' section. If it's a mutual like, in the 'matches' section.

<img src="https://user-images.githubusercontent.com/57796369/79170719-7d896200-7df0-11ea-886d-3726f29d5232.gif" width="20%" />

## NPM packages 📦
The dependencies we've used to build this project are:

* [Argon2](https://www.npmjs.com/package/argon2)
* [Body-parser](https://www.npmjs.com/package/body-parser)
* [Compression](https://www.npmjs.com/package/compression)
* [Dotenv](https://www.npmjs.com/package/dotenv)
* [EJS](https://www.npmjs.com/package/ejs)
* [Express](https://www.npmjs.com/package/express)
* [Express-session](https://www.npmjs.com/package/express-session)
* [MongoDB](https://www.npmjs.com/package/mongodb)
* [Mongoose](https://www.npmjs.com/package/mongoose)
* [Multer](https://www.npmjs.com/package/multer)
* [Request](https://www.npmjs.com/package/request)
* [Aws-sdk](https://www.npmjs.com/package/aws-sdk)

And dev dependencies:
* [ESLint](https://www.npmjs.com/package/eslint)
* [Nodemon](https://www.npmjs.com/package/nodemon)

## License 📄
This project is made and shared under the MIT license. For more details, read the [license.md](https://github.com/KarinMeijvogel/datingapp/blob/master/LICENSE).

## Sources 🔎
### Code conventions
* airbnb. (n.d.). airbnb/javascript. Retrieved March 10, 2020, from https://github.com/airbnb/javascript/blob/master/README.md#arrow-functions
* JavaScript Style Guide. (n.d.). Retrieved March 10, 2020, from https://www.w3schools.com/js/js_conventions.asp

### GitHub flow
* de Vries, D. (2018, September 9). Using GitHub as a team. Retrieved from https://medium.com/@dandevri/using-github-as-a-team-61f189eaa8ff
* How to Write a Git Commit Message. (n.d.). Retrieved March 20, 2020, from https://chris.beams.io/posts/git-commit/
* Understanding the GitHub flow · GitHub Guides. (n.d.). Retrieved March 10, 2020, from https://guides.github.com/introduction/flow/

### Topic: Password hashing
* L. (2019, January 13). Why You Shouldn’t be Using BCrypt and Scrypt – Ben Prime. Retrieved from https://blog.benpri.me/blog/2019/01/13/why-you-shouldnt-be-using-bcrypt-and-scrypt/
* Preziuso, M. (2019, February 16). Password Hashing: PBKDF2, Scrypt, Bcrypt and ARGON2. Retrieved from https://medium.com/@mpreziuso/password-hashing-pbkdf2-scrypt-bcrypt-and-argon2-e25aaf41598e
* Z. (n.d.). bcrypt vs scrypt vs argon2 · zaiste.net. Retrieved April 5, 2020, from https://zaiste.net/security/vs/bcrypt-scrypt-argon2/

### Topic: External API's
* RapidAPI. (n.d.). How to use the IMDb API on RapidAPI. Retrieved April 10, 2020, from https://rapidapi.com/blog/how-to-use-imdb-api/
* Does IMDB provide an API? (2009, December 27). Retrieved April 11, 2020, from https://stackoverflow.com/questions/1966503/does-imdb-provide-an-api
* IMDb | Help. (n.d.). Retrieved April 10, 2020, from https://help.imdb.com/article/imdb/general-information/what-is-imdb/G836CY29Z4SGNMK5?ref_=__seemr#

### Topic: Compression
* Wilson, D. (2019, March 18). npm: compression. Retrieved April 11, 2020, from https://www.npmjs.com/package/compression
* Sexton, P. (2016, May 27). How to enable compression and gzip for page speed. Retrieved April 11, 2020, from https://varvy.com/pagespeed/enable-compression.html
* Performance Best Practices Using Express in Production. (n.d.). Retrieved April 11, 2020, from https://expressjs.com/en/advanced/best-practice-performance.html#use-gzip-compression

### Topic: Deployment
* Cloud Application Platform | Heroku. (2020, April 7). Retrieved from https://www.heroku.com/
* Kubernetes vs Openshift. (n.d.). Retrieved April 7, 2020, from https://www.slant.co/versus/11649/24867/~kubernetes_vs_openshift
* Red Hat OpenShift Container Platform, Built on Kubernetes. (n.d.). Retrieved April 7, 2020, from https://www.openshift.com/
* Team, D. (2018, September 15). AWS Advantages & Disadvantages | Advantages of Cloud Computing. Retrieved from https://data-flair.training/blogs/aws-advantages/
* Vidal, J. (2018, November 19). Google Cloud Storage: Pros/Cons and how to use it with JavaScript. Retrieved from https://medium.com/dailyjs/google-cloud-storage-pros-cons-and-how-to-use-it-with-javascript-ea9ce60a94c0
* Vidal, Jose. (2018, February 23). Amazon S3 pros, cons and how to use it with JavaScript. Retrieved from https://codeburst.io/amazon-s3-pros-cons-and-how-to-use-it-with-javascript-701fffc89154
