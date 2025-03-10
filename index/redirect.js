// if (window.location.pathname === "/brandon-crypt") {
//    window.location.href = "/tools/AES-encryptt/?t=brandon";
// } else {
//    window.location.href = "/";
// }

function goto(link,path) {
   if (window.location.pathname === link) {
      window.location.href = path;
   } else {
      window.location.href = "/";
   }
}

goto("/mtos","/tools/mtos.html");
goto("/mtomil","/tools/mtomil.html");
goto("/crono","/tools/cronómetro.html");
goto("/xd","/tools/xd-file");

goto("/yt-player","/tools/ty-lightweight-player");
goto("/tw-player","/tools/twitch-lightweight-player.html");

goto("/brandon-crypt","/tools/AES-encryptt/?t=brandon");