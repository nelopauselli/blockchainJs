const EC = require("elliptic").ec;
const ec = new EC('secp256k1');

const Blockchain = require('./../blockchain');
const Miner = require('./../builtInMiner');
const Transaction = require('./../transaction');
const MinerReward = require('./../minerReward');
const Genesis = require("./../genesis");


describe("Blockchain", function () {
    var blockchain;
    var key1 = ec.keyFromPrivate('c82a83763ad986ac5503a1b843ae26a6d35f688c87333e69ada0d5e9493976d9');
    var address1 = key1.getPublic('hex');
    var key2 = ec.keyFromPrivate('61d94dd6861e6ad450b21dd1da2c8b9941f6929334f53f6d278c51045a8082f1');
    var address2 = key2.getPublic('hex');

    beforeEach(function () {
        blockchain = new Blockchain(new Miner("1234"), 2);

        let pendingDocuments = [new Genesis()];
        blockchain.minePendingTransaction(pendingDocuments);
    });

    it("Minado del genesis block", function () {
        expect(1).toBe(blockchain.chain.length);

        var block = blockchain.chain[blockchain.chain.length - 1];
        expect("00").toBe(block.hash.substring(0, 2));
    });

    it("Hash comienza con ceros", function () {
        var tx = new Transaction(address1, address2, 10);
        tx.sign(key1);

        blockchain.minePendingTransaction([tx]);

        expect(2).toBe(blockchain.chain.length);

        var block = blockchain.chain[blockchain.chain.length-1];
        expect("00").toBe(block.hash.substring(0, 2));
    });

    it("Cadena válida", function () {
        var tx = new Transaction(address1, address2, 10);
        tx.sign(key1);

        blockchain.minePendingTransaction([tx]);

        expect(true).toBe(blockchain.isValid());
    });

    it("Cadena inválida por doble recomensa", function () {
        blockchain.minePendingTransaction([new MinerReward("miner-address")]);

        expect(false).toBe(blockchain.isValid());
    });

    it("Cadena inválida por transacción sin firmar", function () {
        var invalidAction = function () { 
            var tx = new Transaction(address1, address2, 10);
            blockchain.minePendingTransaction([tx]);
        };
        expect(invalidAction).toThrow(new Error("Documento inválido"));

        expect(true).toBe(blockchain.isValid());
    });
})