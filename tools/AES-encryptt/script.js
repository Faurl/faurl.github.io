document.getElementById('password-input').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                decryptText();
            }
        });

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
        event.preventDefault(); // Evitar añadir nueva línea
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
    copyEncryptedTextURL();
});

function copyEncryptedTextURL() {
    var encryptedText = document.getElementById('result-output').value;
    var password = document.getElementById('password-input').value;
    var passwordInput = document.getElementById('password-input');

    var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    var newUrl = baseUrl;

    // Create an array to hold parameters
    var params = [];

    // Include encrypted text only if it exists
    if (encryptedText) {
        var encodedText = encodeURIComponent(encryptedText);
        params.push(`s=${encodedText}`);
    }

    // Only include the password if it is visible
    if (passwordInput.type === 'text' && password) {
        var encodedPassword = CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(password));
        params.push(`kee=${encodedPassword}`);
    }

    // Include the CSS parameter if it exists in the current URL
    var currentCssParam = new URLSearchParams(window.location.search).get('t');
    if (currentCssParam) {
        params.push(`t=${currentCssParam}`);
    }

    // If there are any parameters, join them and append to the URL
    if (params.length > 0) {
        newUrl += '?' + params.join('&');
    }

    navigator.clipboard.writeText(newUrl).then(function() {
        alert('URL customizada copiada al portapapeles:\n\n' + newUrl);
    }, function(err) {
        alert('Error copiando la URL: ' + err);
    });
}

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

window.onload = function() {
    let params = new URLSearchParams(window.location.search);
    let encryptedText = params.get('s');
    let encodedPassword = params.get('kee');
    let cssParam = params.get('t');

    if (cssParam) {
        let cssUrl = getCssUrl(cssParam);
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = cssUrl;
        document.head.appendChild(link);
    }

    if (encryptedText) {
        document.getElementById('text-input').value = decodeURIComponent(encryptedText);
    }
    if (encodedPassword) {
        try {
            let decryptedPassword = CryptoJS.enc.Hex.parse(encodedPassword).toString(CryptoJS.enc.Utf8);
            document.getElementById('password-input').value = decryptedPassword;
        } catch (e) {
            console.error('Error al desencriptar la contraseña desde la URL.');
        }
    }
}

function getCssUrl(cssFileName) {
    return 'styles/' + cssFileName + '.css';
}

// auto-resize the textarea
function autoResizeTextarea() {
    // Reset the height to get the correct scrollHeight
    this.style.height = 'auto'; 

    // Only set the height if the scrollHeight exceeds the current height
    if (this.scrollHeight > this.clientHeight) {
        this.style.height = this.scrollHeight + 'px'; // Set the new height
    }
}

document.getElementById('text-input').addEventListener('input', autoResizeTextarea);

//
//function update_title() {
//    const title = getComputedStyle(document.documentElement).getPropertyValue('--Title').replace(/'/g, "").trim();
//    document.getElementById('Title').textContent = title;
//}
//
//document.addEventListener('DOMContentLoaded', function () {
//    update_title()
//})
//
//