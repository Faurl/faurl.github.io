var link = window.location.pathname;
var path = window.location.href;

function redirect() {
   if (link === "/crono"){
      path = "/tools/cronómetro.html";

   } else if (link === "/mtos"){
      path = "/tools/mtos.html";

   } else if (link === "/mtomil"){
      path = "/tools/mtomil.html";

   } else if (link === "/xd"){
      path = "/tools/xd-file";

   } else if (link === "/tw-player"){
      path = "/tools/twitch-lightweight-player";

   } else if (link === "/yt-player"){
      path = "/tools/ty-lightweight-player";

   } else if (link === "/brandon-crypt"){
      path = "/tools/AES-encryptt/?t=brandon";

   } else {
      path = "/";
   }
}

redirect();