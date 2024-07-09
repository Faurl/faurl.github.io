document.getElementById('encrypt-button').addEventListener('click', function() {
    encryptText();
});

document.getElementById('decrypt-button').addEventListener('click', function() {
    decryptText();
});

document.getElementById('toggle-password').addEventListener('click', function() {
    togglePasswordVisibility();
});

document.getElementById('text-input').addEventListener('input', function() {
    handleAutoEncrypt();
});

document.getElementById('text-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita que se añada una nueva línea en el textarea
        encryptText();
    }
});

document.getElementById('result-output').addEventListener('click', function(event) {
    disableAutoEncryptOnResultClick(event);
});

document.getElementById('copy-button').addEventListener('click', function() {
    copyToClipboard();
});

document.getElementById('copy-url-button').addEventListener('click', function() {
    copyUrlToClipboard();
});

function encryptText() {
    var text = document.getElementById('text-input').value;
    var password = document.getElementById('password-input').value;
    if (text && password) {
        var encrypted = CryptoJS.AES.encrypt(text, password).toString();
        document.getElementById('result-output').value = encrypted;
    } else {
        alert('Por favor, introduce el texto y/o la contraseña.');
    }
}

function decryptText() {
    var encryptedText = document.getElementById('text-input').value;
    var password = document.getElementById('password-input').value;
    if (encryptedText && password) {
        try {
            var decrypted = CryptoJS.AES.decrypt(encryptedText, password);
            var decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
            if (decryptedText) {
                document.getElementById('result-output').value = decryptedText;
            } else {
                alert('La desencriptación falló. Verifica la contraseña y el texto encriptado.');
            }
        } catch (e) {
            alert('La desencriptación falló. Verifica la contraseña y el texto encriptado.');
        }
    } else {
        alert('Por favor, introduce el texto encriptado y la contraseña.');
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

function copyUrlToClipboard() {
    var password = document.getElementById('password-input').value;
    if (password) {
        var encodedPassword = CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(password));
        var css = getParameterByName('css');
        var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        var newUrl;

        if (css) {
            newUrl = baseUrl + '?css=' + css + '&' + encodedPassword;
        } else {
            newUrl = baseUrl + '?' + encodedPassword;
        }

        navigator.clipboard.writeText(newUrl).then(function() {
            alert('URL copiada al portapapeles: ' + newUrl);
        }, function(err) {
            alert('Error al copiar la URL: ' + err);
        });
    } else {
        alert('Por favor, introduce una contraseña.');
    }
}

// Función para obtener el valor de un parámetro en la URL
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    let results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

window.onload = function() {
    let params = window.location.search.substring(1).split('&');
    let cssParam = params.find(param => param.startsWith('css='));
    let css = cssParam ? getCssUrl(cssParam.substring(4)) : null;
    let encodedPassword = params.find(param => param !== cssParam && param.length > 0) || null;

    if (css) {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = css;
        document.head.appendChild(link);
    }

    if (encodedPassword) {
        try {
            let decryptedPassword = CryptoJS.enc.Hex.parse(encodedPassword).toString(CryptoJS.enc.Utf8);
            document.getElementById('password-input').value = decryptedPassword;
        } catch (e) {
            console.error('Error al desencriptar la contraseña desde la URL.');
        }
    }
};

function getCssUrl(cssFileName) {
    return 'styles/' + cssFileName + '.css';
}