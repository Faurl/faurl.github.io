const inputContainer = document.querySelector(".input-container");
const videoContainer = document.querySelector(".video-container");

const pasteButton = document.getElementById('pasteVideo');
const videoInput = document.getElementById('videoURL');

function checkVideo(event) {

        var videoURL = document.getElementById("videoURL").value.trim();

        if (videoURL === "") {
            alert("Please enter a valid YouTube URL.");
            return;
        }

        var videoId = extractVideoId(videoURL);
        if (videoId) {
            loadVideo(videoId);
        } else {
            alert("Please enter a valid YouTube video URL.");
            videoInput.value = '';
        }
}

document.getElementById("videoURL").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        checkVideo()
    }
});



function extractVideoId(url) {
    var regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S+[\?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    var match = url.match(regExp);
    return match ? match[1] : null;
}

function loadVideo(videoId) {
    var iframe = document.getElementById("video-player");
    iframe.src = "https://www.youtube.com/embed/" + videoId + "?rel=0&modestbranding=1&autoplay=0&showinfo=0&controls=1";

    inputContainer.style.display = "none";
    videoContainer.style.borderRadius = 'var(--borderRadius)';
}

// Toggle input visibility
document.getElementById("toggleInputButton").addEventListener("click", function() {
    if (inputContainer.style.display === "block" || inputContainer.style.display === "") {
        inputContainer.style.display = "none";
        videoContainer.style.borderRadius = 'var(--borderRadius)'
    } else {
        inputContainer.style.display = "block";
        videoContainer.style.borderRadius = '0 0 var(--borderRadius) var(--borderRadius)'
    }
});

// Toggle fullscreen mode
document.getElementById("fullscreenButton").addEventListener("click", function() {
    var iframe = document.getElementById("video-player");
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) { /* Firefox */
        iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { /* IE/Edge */
        iframe.msRequestFullscreen();
    }
});

// Add event listener for button click
pasteButton.addEventListener('click', async () => {
    try {
    // Get clipboard text
    const text = await navigator.clipboard.readText();

    // Set the clipboard content into the input field
    videoInput.value = text;
    checkVideo();
    } catch (err) {
    console.error('Failed to read clipboard contents: ', err);
    }
});