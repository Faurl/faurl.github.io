async function sha256(str) {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
              .map(b => b.toString(16).padStart(2, '0'))
              .join('');
}

const keyhash = '654b29f8a0942cff4028e85cf93ebae85271e588b8e6111236d830f3bb1a6b1f';
const encId =  new URLSearchParams(window.location.search).get('646973706C6179636F6465');

async function onloadcheck(){
	html = document.documentElement.style;
	if(await sha256(encId) == keyhash){
		document.body.style.display = "block";
		html.backgroundColor = "transparent";
		html.backgroundImage = "unset";
		html.backgroundPositionX = "0%";
		html.backgroundSize = "auto";
	} else {
		document.body.remove();
		html.backgroundColor = "black";
		html.backgroundImage = "url(../../assets/media/image/saulgoodman.png)";
		html.backgroundPositionX = "49%";
		html.backgroundSize = "40% 100%";
	}
}

window.onload = function(){onloadcheck();}