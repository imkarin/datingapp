// html elements
const deleteButton = document.querySelectorAll(".deleteButton");

function removeMovie() {
	let node = event.target;
	let id = node.dataset.id

	let res = new XMLHttpRequest();
	res.open("PUT", "/" + id);
	res.onload = onload;
	res.send();

	function onload() {
		if (res.status !== 200) {
			throw new Error("Could not delete!");
		}
	}

	window.location = '/';
}

// eventlisteners
deleteButton.addEventListener('click', removeMovie);