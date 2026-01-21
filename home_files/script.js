const contenedorWeb = document.getElementById('contenedor-web');
const menubart = document.getElementById("menu-bar");
const panel = document.getElementById('panel');
let params = new URLSearchParams(location.search);

const ext_window_bttn = document.getElementById("music-ext-window");
function popupHover(){ ext_window_bttn.src = "./assets/media/icons/popup_hover.png"}
function popupNotHover(){ ext_window_bttn.src = "./assets/media/icons/popup.png"}

//contenedorWeb.innerHTML = '<iframe src="' + url + '"></iframe>';
function cargarWeb(url) {
  contenedorWeb.src = url;
  togglePanel();
}

panelIsActive = false;
activemenu = false;

function togglePanel() {
  if (panelIsActive === false) {
    panel.style.display = 'block';
    panelIsActive = true;
    activemenu = true;

  } else if (panelIsActive === true){
    panel.style.display = 'none';
    panelIsActive = false;
    activemenu = false;
  }
}

menubart.addEventListener("click", function() {
  togglePanel();
});

var timeout;

contenedorWeb.addEventListener('mouseover', function() {
  timeout = setTimeout(function() {
    if (activemenu === true) {
      togglePanel();}
  }, 200); // 1000 = 1s
});


contenedorWeb.addEventListener('mouseout', function() {
  clearTimeout(timeout);
});

// cargar parámetros url
function loadParameters() {
  if (params.has('custom_path')) {
    param_url = params.get('custom_path');
    cargarWeb(param_url);
  } else {return;}
}

//const useful_tips = {
//  0:'¡Consejo diario! 🕊️\n\n¿Sabías que puedes añadir el parámetro "?noalert" después de "https://faurl.github.io/" para desactivar la alerta de consentimiento de datos?\n\n\n(Al permanecer oculta se aceptará automáticamente).'
//};
//
//function usefulTip(){
//  e = Math.floor(Math.random()*100)+1;
//  if(e == 1){alert(useful_tips[0]);}
//}

window.onload=(event)=>{
  loadParameters();
  //usefulTip();
};