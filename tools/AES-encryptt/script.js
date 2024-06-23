document.getElementById('encrypt-button').addEventListener('click', function() {
    encryptText();
});

document.getElementById('decrypt-button').addEventListener('click', function() {
    encryptAndTripleDecryptText();
});

document.getElementById('toggle-password').addEventListener('click', function() {
    togglePasswordVisibility();
});

document.getElementById('text-input').addEventListener('input', function() {
    handleAutoEncrypt();
});

document.getElementById('result-output').addEventListener('click', function(event) {
    disableAutoEncryptOnResultClick(event);
});

document.getElementById('copy-button').addEventListener('click', function() {
    copyToClipboard();
});

function encryptText() {
    var text = document.getElementById('text-input').value;
    var password = document.getElementById('password-input').value;
    if (text && password) {
        var encrypted = CryptoJS.AES.encrypt(text, password).toString();
        document.getElementById('result-output').value = encrypted;

        // Encriptar la contraseña en Base64 y actualizar la URL
        var encodedPassword = btoa(password);
        var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?pwd=' + encodedPassword;
        history.replaceState(null, '', newUrl);
    } else {
        //alert('Por favor, introduce el texto y/o la contraseña.');
    }
}

function encryptAndTripleDecryptText() {
    var text = document.getElementById('text-input').value;
    var password = document.getElementById('password-input').value;
    if (text && password) {
        // Encrypt the text
        var encrypted = CryptoJS.AES.encrypt(text, password).toString();
        document.getElementById('result-output').value = encrypted;

        // First decryption
        try {
            var decrypted = CryptoJS.AES.decrypt(text, password);
            var decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

            // Second decryption
            if (decryptedText) {
                var reEncrypted = CryptoJS.AES.encrypt(decryptedText, password).toString();
                var doubleDecrypted = CryptoJS.AES.decrypt(reEncrypted, password);
                var doubleDecryptedText = doubleDecrypted.toString(CryptoJS.enc.Utf8);

                // Third decryption
                if (doubleDecryptedText) {
                    var reEncryptedAgain = CryptoJS.AES.encrypt(doubleDecryptedText, password).toString();
                    var tripleDecrypted = CryptoJS.AES.decrypt(reEncryptedAgain, password);
                    var tripleDecryptedText = tripleDecrypted.toString(CryptoJS.enc.Utf8);

                    // Display the final result
                    document.getElementById('result-output').value = tripleDecryptedText;
                } else {
                    alert('La segunda desencriptación falló. Verifica la contraseña y el texto encriptado.');
                }
            } else {
                alert('⚠ Error. Verifica la contraseña y el texto encriptado.');
                document.getElementById('result-output').value = '';
            }
        } catch (e) {
            alert('La desencriptación falló. Verifica la contraseña y el texto encriptado.');
        }
    } else {
        document.getElementById('result-output').value = '';
    }
}

function togglePasswordVisibility() {
    var passwordInput = document.getElementById('password-input');
    var toggleButton = document.getElementById('toggle-password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
    } else {
        passwordInput.type = 'password';
        toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
    }
}

function handleAutoEncrypt() {
    var autoEncryptCheckbox = document.getElementById('auto-encrypt-checkbox');
    if (autoEncryptCheckbox.checked) {
        encryptText();
    }
    if (document.getElementById('text-input').value.trim() === '') {
        document.getElementById('result-output').value = '';
    }
}

function disableAutoEncryptOnResultClick(event) {
    if (event.button === 0 || event.button === 2) {
        document.getElementById('auto-encrypt-checkbox').checked = false;
    }
}

function copyToClipboard() {
    var resultOutput = document.getElementById('result-output');
    resultOutput.select();
    document.execCommand('copy');

    document.getElementById('auto-encrypt-checkbox').checked = false;
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    let results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
window.onload = function() {
    let encryptedPassword = getParameterByName('pwd');
    if (encryptedPassword) {
        let decryptedPassword = atob(encryptedPassword);
        document.getElementById('password-input').value = decryptedPassword;
    }
};

//copiar url junto con contraseña en base64
document.getElementById('copy-url-button').addEventListener('click', function() {
    copyUrlToClipboard();
});
function copyUrlToClipboard() {
    var password = document.getElementById('password-input').value;
    if (password) {
        var encodedPassword = btoa(password);
        var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?pwd=' + encodedPassword;
        navigator.clipboard.writeText(newUrl).then(function() {
            alert('URL copiada al portapapeles: ' + newUrl);
        }, function(err) {
            alert('Error al copiar la URL: ' + err);
        });
    } else {
        alert('Por favor, introduce una contraseña.');
    }
}