// users
class Person{
    constructor(name, age, id, photo, msg) {
        this.name = name;
        this.age = age;
        this.id = id;
        this.photo = photo;
        this.msg = msg;
    }
}

let Olivia = new Person('Olivia Delroy', '24', '001', 'girl.jpeg', `Hey! I love all of the bands in your...`)
let Kayla = new Person('Kayla Solomon', '25', '002', 'girl1.jpeg', `What's up :-)`)
let Nadia = new Person('Nadia Williams', '23', '003', 'girl2.jpeg', `lol ikr`)
let Eve = new Person('Eve Johnson', '24', '004', 'girl3.jpeg', `Are you going to DLDK this year?`)
let Abby = new Person('Abby Watts', '25', '005', 'girl4.jpeg', `Yeah, saw them live 3 weeks ago.`)

let likedPeople = [Olivia, Kayla, Nadia, Eve, Abby];

// html page elements
const main = document.getElementsByTagName('main')[0];
const footerText = document.getElementsByTagName('footer')[0].getElementsByTagName('p')[0];
const chatList = document.getElementsByTagName('ul')[0];
const clItems = [];

// when user clicks on someone's photo, this person gets deleted from the liked list
function removeChat() {
    this.closest('li').remove();
    
    if (chatList.children.length === 0) {
        footerText.textContent = `You haven't liked anyone yet.`
    }
}

// for every liked person...
for (let i = 0; i < likedPeople.length; i++) {

// make a list item and put it in the 'clItems' array
    clItems.push(document.createElement('li'));
    clItems[i].innerHTML = '<figure><img src="" alt="profilepicture"><figcaption><h4>Username</h4><p>Message</p></figcaption></figure>'
   
// add the elements in the 'clItems' array to the HTML's actual chatlist
    chatList.appendChild(clItems[i]);

// give every chat the right details
    const photo = clItems[i].getElementsByTagName('img')[0];
    const name = clItems[i].getElementsByTagName('h4')[0];
    const msg = clItems[i].getElementsByTagName('p')[0];
    
    photo.src = "images/" + likedPeople[i].photo;
    name.textContent = likedPeople[i].name;
    msg.textContent = likedPeople[i].msg;

// make every profile picture clickable (it removes the person from the liked list)
    photo.addEventListener('click', removeChat)
}