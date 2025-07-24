// Base64
const toBase64 = str => btoa(unescape(encodeURIComponent(str)));
const fromBase64 = str => decodeURIComponent(escape(atob(str)));

// Hex
const toHex = str => Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
const fromHex = hex => hex.match(/.{1,2}/g).map(h => String.fromCharCode(parseInt(h, 16))).join('');

// Binary
const toBinary = str => Array.from(str).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
const fromBinary = bin => bin.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');

// Caesar Cipher
const caesar = (str, shift) => {
  return Array.from(str).map(char => {
    const code = char.charCodeAt(0);
    return String.fromCharCode(code + shift);
  }).join('');
}