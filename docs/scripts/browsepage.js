// users
class Person{
    constructor(name, age, id, photo, desc) {
        this.name = name;
        this.age = age;
        this.id = id;
        this.photo = photo;
        this.desc = desc;
    }
}

let Olivia = new Person('Olivia Delroy', '24', '001', 'girl.jpeg', `Sup, I'm Olivia and I like video games n movies. My fav food is pizza and I love walking my dogs in my free time.`)
let Kayla = new Person('Kayla Solomon', '25', '002', 'girl1.jpeg', `Sup, I'm Kayla and I like video games n movies. My fav food is pizza and I love walking my dogs in my free time.`)
let Nadia = new Person('Nadia Williams', '23', '003', 'girl2.jpeg', `Sup, I'm Nadia and I like video games n movies. My fav food is pizza and I love walking my dogs in my free time.`)
let Eve = new Person('Eve Johnson', '24', '004', 'girl3.jpeg', `Sup, I'm Eve and I like video games n movies. My fav food is pizza and I love walking my dogs in my free time.`)
let Abby = new Person('Abby Watts', '25', '005', 'girl4.jpeg', `Sup, I'm Abby and I like video games n movies. My fav food is pizza and I love walking my dogs in my free time.`)

let people = [Olivia, Kayla, Nadia, Eve, Abby];

// html page elements
const main = document.getElementsByTagName('main')[0];
const personView = document.getElementsByTagName('ul')[0];
const headerPhoto = document.getElementsByTagName('figure')[0].getElementsByTagName('img')[0];
const personName = document.getElementsByTagName('figure')[0].getElementsByTagName('h2')[0];
const personDesc = document.getElementsByTagName('figure')[0].getElementsByTagName('p')[0];
const likeButton = document.getElementById('likebutton');
const dislikeButton = document.getElementById('dislikebutton');

var para = document.createElement("p");
var textNode = document.createTextNode("No more people to display.");
para.appendChild(textNode);

// first person is being shown
let i = 0;
headerPhoto.src = 'images/' + people[i].photo;
personName.textContent = people[i].name;
personDesc.textContent = people[i].desc;

// when you press the (dis)like button
function ratePerson() {
    if (i < people.length ) {
        if (this == likeButton) { // determine if it's a like or dislike
            console.log(people[i].name + ' liked!');
        }
        else if (this == dislikeButton) {
            console.log(people[i].name + ' disliked.')
        }

        i++;

        if (i < (people.length)) { // show next person
            headerPhoto.src = 'images/' + people[i].photo;
            personName.textContent = people[i].name;
            personDesc.textContent = people[i].desc;
        }
        else if (i >= (people.length)) { // show 'no more people'
            console.log('No more people to display.');
            personView.classList.add('invisible');
            main.appendChild(para);
        }
    } 
}

// eventlisteners
likeButton.addEventListener('click', ratePerson);
dislikeButton.addEventListener('click', ratePerson);