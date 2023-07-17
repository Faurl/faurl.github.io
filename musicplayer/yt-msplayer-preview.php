$param = $_GET['playlist']; // Obtener el valor del parámetro de la URL

if ($param == 'playlist') {
  // Metadatos para el parámetro específico
  echo '<meta property="og:title" content="Reproductor de Música by Faurl852">';
  echo '<meta property="og:description" content="Reproductor de PlayLists de YouTube mediante Url">';

  // Obtener el ID de la lista de reproducción de la URL
  $playlistId = '';
  if (preg_match('/list=([^&]+)/i', $_GET['playlist'], $matches)) {
      $playlistId = $matches[1];
  }

  // Imprimir el valor de $playlistId para verificar si se asigna correctamente
  echo "Playlist ID: " . $playlistId . "<br>";

  if (!empty($playlistId)) {
      // Hacer una solicitud a la API de YouTube para obtener la información de la lista de reproducción
      $apiUrl = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=' . $playlistId . '&key=AIzaSyBojdH9dK2F8Dyk4mw7Ia2Y-e0zVWk_Sis';

      // Imprimir la URL de la API para verificar si es correcta
      echo "API URL: " . $apiUrl . "<br>";

      $response = file_get_contents($apiUrl);
      $data = json_decode($response, true);

      if (!empty($data['items'][0]['snippet']['thumbnails']['high']['url'])) {
          // Utilizar la URL de la miniatura de alta calidad de la lista de reproducción como imagen en los metadatos
          $thumbnailUrl = $data['items'][0]['snippet']['thumbnails']['high']['url'];

          // Imprimir la URL de la miniatura para verificar si es correcta
          echo "Thumbnail URL: " . $thumbnailUrl . "<br>";

          echo '<meta property="og:image" content="' . $thumbnailUrl . '">';
      }
  } else {
      // Metadatos predeterminados si no se proporciona un valor válido para el parámetro 'playlist'
      echo '<meta property="og:image" content="https://faurl.github.io/musicplayer/preview1.png">';
  }
} else {
  // Metadatos predeterminados si no se cumple la condición
  echo '<meta property="og:title" content="Reproductor de Música by Faurl852">';
  echo '<meta property="og:description" content="Reproductor de PlayLists de YouTube mediante Url">';
  echo '<meta property="og:image" content="https://faurl.github.io/musicplayer/preview1.png">';
}
