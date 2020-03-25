// html page elements
let deleteButtons = document.getElementsByTagName('button');
const footerText = document.getElementsByTagName('footer')[0].getElementsByTagName('p')[0];
const main = document.getElementsByTagName('main')[0];
const sections = main.getElementsByTagName('section');
let matchedItems = sections[0].getElementsByTagName('li');
let pendingItems = sections[1].getElementsByTagName('li');

// if likedlist is empty, tell the user it is
if (pendingItems.length + matchedItems === 0) {
    footerText.textContent = `You haven't liked anyone yet.`
}

// make removebutton invisible when javascript is active 
for (let i = 0; i < deleteButtons.length; i++){ 
    deleteButtons[i].classList.add('invisible');
}

// when user clicks on someone's photo, this person gets deleted from the liked list
function removeChat(event) {
    surroundingUl = this.closest('ul');
    closestHeading = surroundingUl.parentNode.getElementsByTagName('h2')[0];
    
    this.closest('li').remove();

    if (surroundingUl.children.length === 0) {
        closestHeading.remove();
    }
    
    let node = event.target;
    let id = node.dataset.id;

    let res = new XMLHttpRequest();
    res.open('DELETE', '/' + id);
    res.onload = onload;
    res.send();

    function onload() {
        if (res.status !== 200) {
            throw new Error('Could not delete!');
        }

        window.location = '/';

    }
// als js niet werkt, via html 'post' request form met een 'delete' value -> alsnog verwijderen
}

// for every liked person...
for (let i = 0; i < (matchedItems.length + pendingItems.length); i++) {
    
    // give every chat the right details
    const photo = main.getElementsByTagName('img')[i];

    // make every profile picture clickable (and execute removeChat function)
    photo.addEventListener('click', removeChat)
}