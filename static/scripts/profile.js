// html page elements
const dislikeButton = document.querySelectorAll('.dislikebutton')[0];
const likeButton = document.querySelectorAll('.likebutton')[0];

// when you press the (dis)like button
function dislikePerson() {
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
    }

    window.location = '/';
}

function likePerson() {
    window.location = '/';
}

// eventlisteners
dislikeButton.addEventListener('click', dislikePerson);
likeButton.addEventListener('click', likePerson);
