var mInput = document.getElementById("master-input");

function checkInputs() {
	if (mInput.value == "") {

	} else if (mInput.value == "tools") {
	   window.open("https://faurl.github.io/tools","_self")

	} else if (mInput.value == "aes") {
	   window.open("https://faurl.github.io/tools/AES-encryptt/","_self")

	} else if (mInput.value == "brandon") {
	   window.open("https://faurl.github.io/brandon","_self")

	} else if (mInput.value == "QCtC$h2k5.¿r60OJ-&3jri$0OEBSp@O0SfK`t1I*@#k0`") {
	   window.open("https://faurl.github.io/-ʭ","_self")
	} else {alert("Error: unknown value.\nQCtC$h2k5.¿r60OJ-&3jri$0OEBSp@O0SfK`t1I*@#k0`")}
}

mInput.addEventListener('keydown', function onEvent(keypress) {
	if (keypress.keyCode === 13) {
		checkInputs();
	}
});