var contenedorWeb = document.getElementById('contenedor-web');

function popupHover(){document.getElementById("music-ext-window").src = "/assets/icons/popup_hover.png"}
function popupNotHover(){document.getElementById("music-ext-window").src = "/assets/icons/popup.png"}

function cargarWeb(url) {
  contenedorWeb.innerHTML = '<iframe src="' + url + '"></iframe>';
}

function cerrarPanel() {
  var acc = document.getElementsByClassName("accordion");
  for (var i = 0; i < acc.length; i++) {
    acc[i].classList.remove("active");
    var panel = acc[i].nextElementSibling;
    panel.style.display = "none";
  }
}

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}

var panel = document.querySelector('.panel');
var timeout;

contenedorWeb.addEventListener('mouseover', function() {
  timeout = setTimeout(function() {
    if (panel.style.display === 'block') {
      panel.style.display = 'none';
    }
  }, 100); // 1000 = 1s
});

contenedorWeb.addEventListener('mouseout', function() {
  clearTimeout(timeout);
});