const input = document.getElementById("master-input");
const bottomtxt = document.getElementById("bottomtext");
const bottomimg = document.getElementById("bottomimg");
let headerkey = null;
let alertkey = null;

async function checkInputs() {
  	const entry = input.value.trim();
  	const path = paths[entry];

  	if (path) {window.open(path, "_self"); return;}
  	if (entry === "") {return;} //do nothing on empty input
  	if (entry == "beemov" || entry == "beemovie") {
  		bottomimg.src = img["bmov"];
  		bottomtxt.innerHTML = bms; return;
  	}

	const headerhash = "26d228663f13a88592a12d16cf9587caab0388b262d6d9f126ed62f9333aca94";
  	const kfe = "dm9sYXRpbGl6YWJsZSBhc2NvIHNhbmTDrWEgYW5ndXN0aWEgZXNwZXNvciBwaWNvdGF6bw";
  	const param = "646973706C6179636F6465";

  	if (entry == headerkey && await sha256(headerkey) == headerhash) {
  		window.open("/tools/知らない"+"?"+param+"="+kfe, "_self");
  		headerkey = null; return;
  	}
  	if (entry == alertkey) {
  		window.open("/-ʭ", "_self");
  		alertkey = null; return;
  	}
	headerkey = rdm404(3); //rdmInt(100,999);
  	alertkey = genErrcode(7,"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
	document.getElementById('errheader').innerHTML = headerkey;

  	alert("Unknown value \""+input.value+"\".\nError id: "+alertkey);

   	//console.log('Error code:', alertkey);
}

input.addEventListener('keydown', function onEvent(keypress) {
	if (keypress.keyCode === 13) {checkInputs()}
});