var player;
var playlist = [];
var currentSongIndex = 0;
var progressInterval;
var currentVolume = 100;
var YouttubeAapikeeyy = "AIzaSyB53d0aVpGq1-jkQ3-Zpntl3hjd9fPmm_o";

var hideLoadingTimeout;

function onYouTubeIframeAPIReady() {
	document.getElementById("player").style.display = "block";
	hideLoadingTimeout = setTimeout(function() {
		hideLoadingMessage();
	}, 0);
//	loadPlaylist();
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

// LOG LAST song url on CONSOLE
function logCurrentVideoUrl() {
    if (player) {
        var currentVideoUrl = "https://www.youtube.com/watch?v=" + player.getVideoData().video_id;
        console.log("Last-Song-URL: ", currentVideoUrl);
    }
}

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

// GET PLAYLIST FROM URL :

// Obtener el parámetro 'playlist' de la URL
var urlParams = new URLSearchParams(window.location.search);
var playlistParams = urlParams.getAll('playlist');
var darkModeParam = urlParams.get('dark-mode');

// Verificar si se proporcionó el parámetro 'playlist' en la URL y no hay '?dark-mode'
if (playlistParams.length > 0 && !darkModeParam) {
    var firstPlaylistParam = playlistParams[0];
    
    // Si el primer parámetro 'playlist' no contiene comillas, asume que es la URL de la playlist
    if (!firstPlaylistParam.includes('"')) {
        // Cargar el contenido del primer parámetro 'playlist' en el input playlistURL tras 3 segundos
        setTimeout(function () {
            document.getElementById("playlistURL").value = firstPlaylistParam;
            loadPlaylist(firstPlaylistParam); // Cargar playlist
        }, 300);
    } else {
        // Si contiene comillas, se extrae el contenido entre ellas :
        var match = firstPlaylistParam.match(/"([^"]+)"/); // Encuentra el contenido entre las comillas
        var playlistUrl = match ? match[1] : null; // Obtiene el contenido encontrado
        if (playlistUrl) {
            // Cargar el contenido del primer parámetro 'playlist' (sin comillas) en el input playlistURL después de 3 segundos
            setTimeout(function () {
                document.getElementById("playlistURL").value = playlistUrl;
                loadPlaylist(playlistUrl); // Cargar la playlist
            }, 300);
        }
    }
}
// FIN CÓDIGO GET PLAYLIST FROM URL


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
		currentVolume = player.getVolume(); // Guardar volumen actual
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

	logCurrentVideoUrl();
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

	logCurrentVideoUrl();
}

function nextSong() {
	currentSongIndex++;
	if (currentSongIndex >= playlist.length) {
		currentSongIndex = 0;
	}
	loadPlayer(playlist[currentSongIndex].videoId, currentSongIndex);

	logCurrentVideoUrl();
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
		var currentTime = !player.getCurrentTime ? 0.0 : player.getCurrentTime();
		var duration = !player.getDuration ? 0.0 : player.getDuration();
		var progressPercentage = (currentTime / duration) * 100;
	
		// Colocar tiempo actual y duración total en formato mm:ss
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

				// Verificar si la canción(botón) actual está fuera de la vista (hace scroll si es necesario)

	            if (typeof button.scrollIntoViewIfNeeded === 'function') {
	                button.scrollIntoViewIfNeeded();
	            } else if (typeof button.scrollIntoView === 'function') {
	                button.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
	            }

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
	player.setVolume(progress * 30); //100
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

// Verifica si la URL contiene "dark-mode"
if (window.location.href.includes('dark-mode')) {
    toggleDarkMode();
}
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
	clickCount = 0; // Reiniciar el contador clicks
}
});
