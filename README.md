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
<img src="https://user-images.githubusercontent.com/57796369/79169403-a60f5d00-7dec-11ea-8d0b-2f4cf8cd898a.gif" width="20%" />

### Registration
Users can create an account on the registration page. They fill in their name, e-mail, age, preferences and profile picture. Passwords get stored in the database as hashes, using **Argon 2**.

***

<img src="https://user-images.githubusercontent.com/57796369/79170166-dc4ddc00-7dee-11ea-8c5c-98e2255f4fb2.gif" width="20%" />

### Login
Users can login using their e-mail and password. Verification goes through **Argon 2**.

***
<img src="https://user-images.githubusercontent.com/57796369/79170081-97c24080-7dee-11ea-88fc-3f7b84ac52af.gif" width="20%" />

### Profile page
On their profile page, the user can edit their profile picture and add/delete movies to his account.

***
<img src="https://user-images.githubusercontent.com/57796369/79170665-5a5eb280-7df0-11ea-881c-fda30e87231c.gif" width="20%" />

### Discover page
On the discover page, the user sees people who meet his preferences and have similar favourite movies on their profiles.

***
<img src="https://user-images.githubusercontent.com/57796369/79170699-75c9bd80-7df0-11ea-9c63-437dcf95a9a7.gif" width="20%" />

### Movie filter
Based on the user's favourite movies and series, the app shows them people with the same movies/series on the discover page.

***
<img src="https://user-images.githubusercontent.com/57796369/79170713-79f5db00-7df0-11ea-8be5-9789c6bef79f.gif" width="20%" />  <img src="https://user-images.githubusercontent.com/57796369/79170716-7bbf9e80-7df0-11ea-8243-b705fe08a31d.gif" width="20%" />

### Age and gender filter
The user can set a preferred gender and minimum age for the people on the discover page, to find his ideal date.

***
<img src="https://user-images.githubusercontent.com/57796369/79170719-7d896200-7df0-11ea-886d-3726f29d5232.gif" width="20%" />

### Matching
When the user sees someone who interests him, they can press the like button. The other person appears on the 'liked' page: if the other user hasn't liked our user yet, in the 'pending' section. If it's a mutual like, in the 'matches' section.

## Sources 🔎
