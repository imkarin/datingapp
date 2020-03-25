// Liking people
const likeButton = document.getElementsByTagName('button')[0];
let myLikedPeople = [];
let thisPerson = {} // object with properties, the person whose profile our user is viewing right now

function like() {
    if (!myLikedPeople.includes(thisPerson.id)) {
        myLikedPeople.push(thisPerson.id)
    }
}

likeButton.addEventListener("click", like)


// Show only unliked people on browsing page
let user1 = {};
let user2 = {};
let user3 = {};

let allPeople = [user1, user2, user3];
let myLikedPeople = [];


function showUnliked() {
    for(i = 0; i < allPeople.length; i++) {
        if (myLikedPeople.includes(allPeople[i].id)) {
            // function that makes all liked people invisible
        }
    }
}


// Show only liked people on my liked page
let user1 = {};
let user2 = {};
let user3 = {};

let allPeople = [user1, user2, user3];
let myLikedPeople = [];


function showUnliked() {
    for(i = 0; i < allPeople.length; i++) {
        if (myLikedPeople.includes(allPeople[i].id)) {
            // function that makes all liked people visible
        }
    }
}



