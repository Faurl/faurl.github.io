        // Obtener la URL actual
        var currentUrl = window.location.href;

        // Verificar si la URL contiene la etiqueta "playlist"
        if (currentUrl.includes("playlist")) {
            // Obtener el valor de la etiqueta "playlist" de la URL
            var playlistUrl = new URL(currentUrl).searchParams.get("playlist");

            // Construir el texto de la descripción con el formato deseado
            var descriptionText = 'Playlist: ' + playlistUrl;

            // Modificar la descripción en la etiqueta <meta property="og:description">
            var ogDescription = document.querySelector('meta[property="og:description"]');
            ogDescription.setAttribute("content", descriptionText);
        }


var player;
var playlist = [];
var currentSongIndex = 0;
var progressInterval;
var currentVolume = 100;
var YouttubeAapikeeyy = "AIzaSyBojdH9dK2F8Dyk4mw7Ia2Y-e0zVWk_Sis"

var hideLoadingTimeout;

function onYouTubeIframeAPIReady() {
	document.getElementById("player").style.display = "block";
	hideLoadingTimeout = setTimeout(function() {
		hideLoadingMessage();
	}, 0);
	loadPlaylist();
}

function hideLoadingMessage() {
	if (document.getElementById("loading-message").style.display !== "none") {
		document.getElementById("loading-message").style.display = "none";
	}
}

// Verificar si el mensaje de carga se ha ocultado automáticamente después de 3 segundos
setTimeout(function() {
	if (document.getElementById("loading-message").style.display !== "none") {
		// Si no se ha ocultado, ocultarlo manualmente
		hideLoadingMessage();
	}
}, 3000);

var playlist = []; // Variable para almacenar la playlist actual


function loadPlaylist() {
    playlist = []; // Reiniciar la playlist actual
    var playlistURL = document.getElementById("playlistURL").value;
    var playlistId = extractPlaylistId(playlistURL);

    if (playlistId) {
        var apiUrl = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + playlistId + "&key=" + YouttubeAapikeeyy;

        // Obtener el título de la playlist usando la API de YouTube
        fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=" + playlistId + "&key=" + YouttubeAapikeeyy)
            .then(response => response.json())
            .then(data => {
                var playlistTitle = data.items[0].snippet.title;
                document.getElementById("playlist-title").textContent = playlistTitle; // Mostrar el título en la esquina superior derecha
            })
            .catch(error => console.error("Error loading playlist title:", error));

        // Función para cargar las canciones
        var loadSongs = function(pageToken) {
            var url = apiUrl;
            if (pageToken) {
                url += "&pageToken=" + pageToken;
            }
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    var newPlaylist = data.items.map(item => {
                        return {
                            title: item.snippet.title,
                            videoId: item.snippet.resourceId.videoId
                        };
                    });
                    
                    playlist = playlist.concat(newPlaylist); // Añadir las nuevas canciones a la lista existente
                    displayPlaylist();
                    
                    if (data.nextPageToken) {
                        // Si hay una página siguiente, cargar más canciones
                        loadSongs(data.nextPageToken);
                    }
                })
                .catch(error => console.error("Error loading playlist:", error));
        };
        
        loadSongs(null);
    } else {
        console.error("Invalid playlist URL");
    }
}


// Obtener el parámetro 'playlist' de la URL
var urlParams = new URLSearchParams(window.location.search);
var playlistParams = urlParams.getAll('playlist');
var firstPlaylistParam = playlistParams.length > 0 ? playlistParams[0] : null;

// Verificar si se proporcionó el parámetro 'playlist' en la URL
if (firstPlaylistParam) {
// Cargar el contenido del primer parámetro 'playlist' en el input playlistURL después de 3 segundos
setTimeout(function() {
	document.getElementById("playlistURL").value = firstPlaylistParam;
	loadPlaylist(firstPlaylistParam); // Cargar la lista de reproducción
}, 300);
}
function extractPlaylistId(url) {
var match = url.match(/[?&]list=([^&]+)/);
return match ? match[1] : null;
}
function displayPlaylist() {
var playlistElement = document.getElementById("playlist");
playlistElement.innerHTML = "";
playlist.forEach((song, index) => {
	var button = document.createElement("button");
	button.textContent = song.title;
	button.onclick = function() {
	loadPlayer(song.videoId, index);
	};
	playlistElement.appendChild(button);
	});
}
<!--fin código get playlist from url-->

function extractPlaylistId(url) {
	var match = url.match(/[?&]list=([^&]+)/);
	return match ? match[1] : null;
}

function displayPlaylist() {
	var playlistElement = document.getElementById("playlist");
	playlistElement.innerHTML = "";
	playlist.forEach((song, index) => {
		var button = document.createElement("button");
		button.textContent = song.title;
		button.onclick = function() {
			loadPlayer(song.videoId, index);
		};
		playlistElement.appendChild(button);
	});
}

function loadPlayer(videoId, index) {
	if (player) {
		currentVolume = player.getVolume(); // Guardar el volumen actual
		player.destroy();
	}
	player = new YT.Player('player', {
		height: '0',
		width: '0',
		videoId: videoId,
		events: {
			'onReady': function(event) {
				onPlayerReady(event, index);
			},
			'onStateChange': onPlayerStateChange
		}
	});

	var playPauseButton = document.querySelector(".play-pause-button");
	playPauseButton.classList.remove("paused");
}

function onPlayerReady(event, index) {
	currentSongIndex = index;
	updateProgressBar();
	player.playVideo();
	setCurrentSong(currentSongIndex);
	player.setVolume(currentVolume);
}

function onPlayerStateChange(event) {
	if (event.data === YT.PlayerState.ENDED) {
		nextSong();
	}
}

function previousSong() {
	currentSongIndex--;
	if (currentSongIndex < 0) {
		currentSongIndex = playlist.length - 1;
	}
	loadPlayer(playlist[currentSongIndex].videoId, currentSongIndex);
}

function nextSong() {
	currentSongIndex++;
	if (currentSongIndex >= playlist.length) {
		currentSongIndex = 0;
	}
	loadPlayer(playlist[currentSongIndex].videoId, currentSongIndex);
}

function togglePlayPause() {
	if (player) {
		if (player.getPlayerState() === YT.PlayerState.PLAYING) {
			player.pauseVideo();
		} else {
			player.playVideo();
		}
		var playPauseButton = document.querySelector(".play-pause-button");
		playPauseButton.classList.toggle("paused");
	}
}

function updateProgressBar() {
	progressInterval = setInterval(function() {
		var currentTime = player.getCurrentTime();
		var duration = player.getDuration();
		var progressPercentage = (currentTime / duration) * 100;
	
		// Formatear el tiempo actual y la duración total en formato mm:ss
		var currentTimeFormatted = formatTime(currentTime);
		var durationFormatted = formatTime(duration);
	
		document.getElementById("progress").style.width = progressPercentage + "%";
		document.getElementById("time-display").textContent = currentTimeFormatted + " / " + durationFormatted;
	}, 500);
	
		}
		
		function formatTime(time) {
			var minutes = Math.floor(time / 60);
			var seconds = Math.floor(time % 60);
			return padNumber(minutes) + ":" + padNumber(seconds);
		}
		
		function padNumber(number) {
			return (number < 10 ? "0" : "") + number;
		}


function setCurrentSong(index) {
	var buttons = document.querySelectorAll("#playlist button");
	buttons.forEach((button, i) => {
		if (i === index) {
			button.classList.add("current-song");
		} else {
			button.classList.remove("current-song");
		}
	});
}

function validateAndLoadPlaylist() {
	var playlistURL = document.getElementById("playlistURL").value.trim();
	if (playlistURL !== "") {
		loadPlaylist();
	} else {
		clearPlaylist();
	}
}

function clearPlaylist() {
	var playlistElement = document.getElementById("playlist");
	playlistElement.innerHTML = "";
}

var volumeSlider = document.querySelector(".volume-slider");
var volumeSliderProgress = document.querySelector(".volume-slider-progress");
var volumeSliderThumb = document.querySelector(".volume-slider-thumb");

volumeSlider.addEventListener("mousedown", startVolumeDrag);
volumeSlider.addEventListener("touchstart", startVolumeDrag);

function startVolumeDrag(event) {
event.preventDefault();

document.addEventListener("mousemove", moveVolumeSlider);
document.addEventListener("mouseup", stopVolumeDrag);
document.addEventListener("touchmove", moveVolumeSlider);
document.addEventListener("touchend", stopVolumeDrag);

moveVolumeSlider(event);
}

function stopVolumeDrag() {
document.removeEventListener("mousemove", moveVolumeSlider);
document.removeEventListener("mouseup", stopVolumeDrag);
document.removeEventListener("touchmove", moveVolumeSlider);
document.removeEventListener("touchend", stopVolumeDrag);
}

function moveVolumeSlider(event) {
var sliderRect = volumeSlider.getBoundingClientRect();
var sliderWidth = sliderRect.width;
var mouseX = event.pageX || event.touches[0].pageX;
var offsetX = mouseX - sliderRect.left;
var progress = Math.max(0, Math.min(offsetX / sliderWidth, 1));

volumeSliderProgress.style.width = (progress * 100) + "%";
volumeSliderThumb.style.right = "calc(" + (100 - progress * 100) + "% - 5px)";

if (player) {
	player.setVolume(progress * 100);
}
var volumePercentage = document.getElementById("volume-percentage");
volumePercentage.textContent = Math.round(progress * 100) + "%";

}

document.addEventListener("keydown", function(event) {
switch (event.key) {
	case " ":
	// Espacio: pausar/reanudar reproducción
	togglePlayPause();
	break;
	case "ArrowRight":
	// Flecha derecha: siguiente canción
	nextSong();
	break;
	case "ArrowLeft":
	// Flecha izquierda: anterior canción
	previousSong();
	break;
}
});
	function toggleDarkMode() {
	var body = document.body;
	body.classList.toggle("dark-mode");
}

var clickCount = 0;
var titleElement = document.querySelector("h1");
titleElement.addEventListener("click", function() {
clickCount++;
  
if (clickCount === 4) {
	toggleDarkMode();
	clickCount = 0; // Reiniciar el contador de clics
}
});