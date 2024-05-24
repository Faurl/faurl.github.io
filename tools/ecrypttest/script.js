document.getElementById('encrypt-button').addEventListener('click', function() {
    var text = document.getElementById('text-input').value;
    var password = document.getElementById('password-input').value;
    if (text && password) {
        var encrypted = CryptoJS.AES.encrypt(text, password).toString();
        document.getElementById('result-output').value = encrypted;
    } else {
        alert('Por favor, introduce el texto y/o la contraseña.');
    }
});

// Evento para desactivar el modo automático al hacer clic izquierdo o derecho en el cuadro de resultado
document.getElementById('result-output').addEventListener('click', function(event) {
    // Si es un clic izquierdo o derecho
    if (event.button === 0 || event.button === 2) {
        document.getElementById('auto-encrypt-checkbox').checked = false;
    }
});

document.getElementById('decrypt-button').addEventListener('click', function() {
    var encryptedText = document.getElementById('result-output').value;
    var password = document.getElementById('password-input').value;
    if (encryptedText && password) {
        try {
            var decrypted = CryptoJS.AES.decrypt(encryptedText, password);
            var decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
            document.getElementById('result-output').value = decryptedText; // Modificado para mostrar el texto desencriptado en el cuadro de resultado
        } catch (e) {
            alert('La desencriptación falló. Verifica la contraseña y el texto encriptado.');
        }
    } else {
        alert('Por favor, introduce el TEXTO ENCRIPTADO >:(');
    }
});



document.getElementById('toggle-password').addEventListener('click', function() {
    var passwordInput = document.getElementById('password-input');
    var toggleButton = document.getElementById('toggle-password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
    } else {
        passwordInput.type = 'password';
        toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
    }
});

// Evento para encriptar automáticamente al escribir en el textarea
document.getElementById('text-input').addEventListener('input', function() {
    var autoEncryptCheckbox = document.getElementById('auto-encrypt-checkbox');
    if (autoEncryptCheckbox.checked) {
        encryptText();
    }
});

// Función para encriptar el texto
function encryptText() {
    var text = document.getElementById('text-input').value;
    var password = document.getElementById('password-input').value;
    if (text && password) {
        var encrypted = CryptoJS.AES.encrypt(text, password).toString();
        document.getElementById('result-output').value = encrypted;
    } else {
      
    }
}

// Evento para copiar el contenido del cuadro de resultado al portapapeles
document.getElementById('copy-button').addEventListener('click', function() {
    var resultOutput = document.getElementById('result-output');
    resultOutput.select();
    document.execCommand('copy');
});
