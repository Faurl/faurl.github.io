let line0 = document.getElementById("line_0");
let line1 = document.getElementById("line_1");
let line2 = document.getElementById("line_2");
let line3 = document.getElementById("line_3");

let metalborder = document.getElementById("metalborder");
let screen = document.getElementById("screen");

let jimage0 = document.getElementById("jimage0");
let jimage1 = document.getElementById("jimage1");
let jimage2 = document.getElementById("jimage2");

jimage0_clicked = false;

ñ = 0
while(ñ < 100) { changeBG(); ñ++ }
var loopSpeed0 = "60";
function changeBG() {
	document.body.style.backgroundColor = "black";
	setTimeout(function(){
		changeBG_back();
	},loopSpeed0);
}

function changeBG_back() {
	document.body.style.backgroundColor = "";
	setTimeout(function(){
		changeBG()
	},loopSpeed0);
}


function randomNum(min,max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function randomLineMove() {
	line0.style.transform = "translateX("+ randomNum(0,100) + "vw)";
	line1.style.transform = "translateX("+ randomNum(0,100) + "vw)";
	line2.style.transform = "translateX("+ randomNum(0,1) + "vw)";
	line3.style.transform = "translateX("+ randomNum(70,100) + "vw)";

	line0.style.opacity = randomNum(10,40) + "%";
	line1.style.opacity = randomNum(10,40) + "%";
	line2.style.opacity = randomNum(10,40) + "%";
	line3.style.opacity = randomNum(10,40) + "%";
}

let jimage0pos = {
	right: null,
	left: null,
	top: null,
	bottom: null
};

function jimage0Move() {
	let jiMin = 130;
	let jiMax = -90;

	jimage0pos.right = randomNum(jiMin, jiMax);
	jimage0pos.left = randomNum(jiMin, jiMax);
	jimage0pos.top = randomNum(jiMin, jiMax);
	jimage0pos.bottom = randomNum(jiMin, jiMax);

	jimage0.style.right = jimage0pos.right + "vw";
	jimage0.style.left = jimage0pos.left + "vw";
	jimage0.style.top = jimage0pos.top + "vh";
	jimage0.style.bottom = jimage0pos.bottom + "vh";

	jimage0.style.opacity = randomNum(10,40) + "%";

	console.log(
		"	right: " + jimage0pos.right + ", 	" +
		"	left: " + jimage0pos.left + ", 	" +
		"	top: " + jimage0pos.top + ", 	" +
		"	bottom: "+ jimage0pos.bottom
	);
}

function MetalMove() {
	num = randomNum(3,50);
	metalborder.style.borderImageSlice = num;
}
function metalLoop() {
	MetalMove();
}setInterval(metalLoop, 6000);

function linesLoop() {
	randomLineMove();
}setInterval(linesLoop, 60);


const jimage0LoopInterv = setInterval(jimage0Loop, 700); // 60/800

function jimage0Loop() {
	if (jimage0_clicked == false) {
		jimage0Move();
		jimage0.style.display = 'block';
	} else {
		clearInterval(jimage0LoopInterv);
	};
}

function jimage0Click() {
	document.getElementById("dup").play();
	jimage0_clicked = true;

	jimage0.style.opacity = '';
	jimage0.style.cursor = 'auto';
	jimage0.style.pointerEvents = 'none';

	jimage0.style.transition = '0.5s';
	jimage0.style.right = '';
	jimage0.style.left = '';
	jimage0.style.top = '';
	jimage0.style.bottom = '';

	setTimeout(function(){ jimage0.style.transition = '' },100);

	setTimeout(function(){
		document.getElementById("audiio").play(); //play 22256.mp3
		setTimeout(function() {
			screen.style.display = 'block';
			document.documentElement.style.backgroundColor = 'black';
			document.getElementById("lines").style.display = 'none';
			metalborder.style.display = 'none';

			setTimeout(function(){
				jimage0.style.display = "none";
				jimage1.style.display = "none";
				jimage2.style.display = "none";
			},4000);

			document.getElementById("browniano").play();

		},66600); //66600

	},670); // 22256.mp3 play delay
}

//jimage0 hover
function jimage0hover(x) {
	if(jimage0_clicked == false) {
		x.src = "resources/jimage/ddk_i.png";
	} else {return}
}
function jimage0NOThover(x) {
	x.src = "resources/jimage/ddk.png";
}