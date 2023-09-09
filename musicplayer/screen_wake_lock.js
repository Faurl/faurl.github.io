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
                        console.log('Bloqueo de pantalla liberado con éxito.');
                    })
                    .catch((err) => {
                        console.error('No se pudo liberar el bloqueo de pantalla:', err);
                    });
            }
        }

        // Manejadores de eventos
        document.getElementById('lockButton').addEventListener('click', requestWakeLock);
        window.addEventListener('beforeunload', releaseWakeLock);

        // Verificar si la API es compatible con el navegador
        if ('wakeLock' in navigator) {
            console.log('La API Screen Wake Lock es compatible con este navegador.');
        } else {
            console.error('Screen Wake Lock API no es compatible con este navegador.');
        }
