var inputContainer = document.querySelector(".input-container");
var videoContainer = document.querySelector(".video-container");

var pasteButton = document.getElementById('pasteVideo');
var videoInput = document.getElementById('videoURL');
var iframe = document.getElementById("video-player");

let isFullScreen = false;

function extractVideoId(url) {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S+[\?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\?t=(\d+))?/;
    const match = url.match(regExp);
    return match ? { videoId: match[1], timestamp: match[2] || 0 } : null;
}

function loadVideo(videoId, timestamp) {
    var url = "https://www.youtube.com/embed/" + videoId + "?rel=0&modestbranding=1&autoplay=0&showinfo=0&controls=1";
    if (timestamp) {
        url += `&start=${timestamp}`;
    }
    iframe.src = url;
}

function checkVideo(event) {
    const cleanURL = videoInput.value.trim(); // Remove spaces

    if (cleanURL === "") {
        alert("Please enter a valid YouTube URL.");
        return;
    }

    const videoData = extractVideoId(cleanURL);
    if (videoData) {
        loadVideo(videoData.videoId, videoData.timestamp);
    } else {
        alert("Please enter a valid YouTube video URL.");
        videoInput.value = '';
    }
}

videoInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        checkVideo()}
});

async function pasteURL() {
    const text = await navigator.clipboard.readText(); // get clipboard text

    videoInput.value = text;
    checkVideo();

    setTimeout(function(){
    if (videoInput.value === text && !isFullScreen) {
            fullScreen();
        } else {
            return;
        }
    },1000);
}

// Hide sidebar indicator
document.getElementById('sidebar-container').addEventListener('mouseenter', function() {
    this.style.transition = "var(--sidebarFade)";
    setTimeout(function(){
        document.getElementById('sidebar-container').classList.add('faded');
    },1);
});

// Toggle video input field
function toggleVideoInput() {
    if (!inputContainer.classList.contains('closed')) {
        inputContainer.classList.add('closed');
    } else {
        inputContainer.classList.remove('closed');
    }
}

function fullScreen() {
    if (!isFullScreen) {
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100vw';
        iframe.style.height = '100vh';

        videoContainer.style.position = 'fixed';
        videoContainer.style.top = '0';
        videoContainer.style.left = '0';
        videoContainer.style.width = '100vw';
        videoContainer.style.height = '100vh';
        videoContainer.style.maxWidth = 'unset';

        isFullScreen = true;
    } else {
        // Reset iframe size
        iframe.style.position = '';
        iframe.style.top = '';
        iframe.style.left = '';
        iframe.style.width = '';
        iframe.style.height = '';

        videoContainer.style.position = '';
        videoContainer.style.top = '';
        videoContainer.style.left = '';
        videoContainer.style.width = '';
        videoContainer.style.height = '';
        videoContainer.style.maxWidth = '';

        isFullScreen = false;
    }
}