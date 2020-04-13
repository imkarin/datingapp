let fileInput = document.querySelector("input[name='userImage']");
let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
let fileInvalid = document.querySelector(".fileInvalid");
let changeImgForm = document.querySelector(".changeImageForm");

function validateImage() {

	if (!allowedExtensions.exec(fileInput.value)) {
		fileInput.value = "";
		fileInvalid.style.display = "block";
		fileInvalid.style.color = "red";
	} else {
		fileInvalid.style.display = "none";
		changeImgForm.submit();
	}
}

fileInput.addEventListener("change", validateImage);