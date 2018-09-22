var CryptoJS = require('crypto-js');

class Block {
    constructor(timestamp, data) {
        this.index = null;
        this.previousHash = null;
        this.timestamp = timestamp;
        this.data = data;
        this.key = 0;
        this.hash = null;
    }

    calculateHash() {
        var middle = CryptoJS.SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.key).toString();
        var hash = CryptoJS.SHA256(middle).toString();
        return hash;
    }

    mine(difficulty) {
        const zeros = Array(difficulty + 1).join("0");

        var count = 1;
        while (!this.hash || this.hash.substring(0, difficulty) !== zeros) {
            this.key++;
            this.hash = this.calculateHash();

            console.log("intento #", count++);
        }
    }
}

module.exports = Block;