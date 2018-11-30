const EC = require("elliptic").ec;
const ec = new EC('secp256k1');

const keys = ec.genKeyPair();
console.log(`private key is: ${keys.getPrivate('hex')}`);
console.log(`public key is: ${keys.getPublic('hex')}`);