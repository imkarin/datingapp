let dateInput = document.querySelector('input[type="date"]');
let ageInvalid = document.querySelector('.ageInvalid');

function validate(){
	if (!dateInput.validity.valid) {
		ageInvalid.style.display = "block";
		ageInvalid.style.color = "red";
	} else {
		ageInvalid.style.display = "none";
	}
};

dateInput.addEventListener("change", validate);

let validFileExtensions = ["jpg", "jpeg", "png"];
let fileInput = document.querySelector("input[name='userImage']");
let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
let fileInvalid = document.querySelector(".fileInvalid");

function validateImage() {

	if (!allowedExtensions.exec(fileInput.value)) {
		fileInput.value = "";
		fileInvalid.style.display = "block";
		fileInvalid.style.color = "red";
	} else {
		fileInvalid.style.display = "none";
	}
};

fileInput.addEventListener("change", validateImage)

let prefInputs = document.querySelectorAll(".prefInput");
let setCheck;

for (let i=0; i<prefInputs.length; i++) {
	function uncheck() {
		if (setCheck != this) {
			setCheck = this;
		} else {
			this.checked = false;
			setCheck = null;
		};
	};

	prefInputs[i].addEventListener("click", uncheck)
}

let ageSlider = document.querySelector("input[name='prefAge']");
let sliderOutput= document.querySelector(".valueAge");
sliderOutput.innerHTML = ageSlider.value;

ageSlider.oninput = function() {
	sliderOutput.innerHTML = this.value;
}