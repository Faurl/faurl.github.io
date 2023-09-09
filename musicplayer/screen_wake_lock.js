let wakeLock = null;

async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Bloqueo de pantalla solicitado con éxito.');
    } catch (err) {
        console.error('No se pudo solicitar el bloqueo de pantalla:', err);
    }
}

function releaseWakeLock() {
    if (wakeLock) {
        wakeLock.release()
            .then(() => {
                console.log('Bloqueo de pantalla liberado con éxito!');
            })
            .catch((err) => {
                console.error('No se pudo liberar el bloqueo de pantalla:', err);
            });
    }
}

// Solicitar el bloqueo de pantalla cuando la página se carga
window.addEventListener('load', requestWakeLock);

// Liberar el bloqueo de pantalla antes de cerrar la página
window.addEventListener('beforeunload', releaseWakeLock);

// Verificar si la API es compatible con el navegador
if ('wakeLock' in navigator) {
    console.log('✅ La API Screen Wake Lock se ha cargado correctamente.');
} else {
    console.error('❌ Screen Wake Lock API no es compatible con este navegador.');
}
