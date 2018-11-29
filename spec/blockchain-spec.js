const Blockchain = require('./../blockchain');
const Miner = require('./../builtInMiner');
const Transaction = require('./../transaction');
const MinerReward = require('./../minerReward');


describe("Blockchain", function () {
    var blockchain;

    beforeEach(function () {
        blockchain = new Blockchain(new Miner("1234"), 2);
        blockchain.createGenesisBlock(); 
    });

    it("Minado del genesis block", function () {
        expect(1).toBe(blockchain.chain.length);

        var block = blockchain.chain[blockchain.chain.length - 1];
        expect("00").toBe(block.hash.substring(0, 2));
    });

    it("Hash comienza con ceros", function () {
        blockchain.add(new Transaction("address-1", "address-2", 10));
        blockchain.createGenesisBlock(); 

        expect(2).toBe(blockchain.chain.length);

        var block = blockchain.chain[blockchain.chain.length-1];
        expect("00").toBe(block.hash.substring(0, 2));
    });

    it("Cadena válida", function () {
        blockchain.add(new Transaction("address-1", "address-2", 10));
        blockchain.createGenesisBlock();

        expect(true).toBe(blockchain.isValid());
    });

    it("Cadena inválida por doble recomensa", function () {
        blockchain.add(new MinerReward("miner-address"));
        blockchain.createGenesisBlock();

        expect(false).toBe(blockchain.isValid());
    });

    it("Cadena inválida por transacción sin origen", function () {
        blockchain.add(new Transaction(null, "my-address", 456));
        blockchain.createGenesisBlock();

        expect(false).toBe(blockchain.isValid());
    });
})