const Blockchain = require('./../blockchain');
const Miner = require('./../builtInMiner');
const Transaction = require('./../transaction');
const MinerReward = require('./../minerReward');
const Wallet = require('./../wallet');


describe("Blockchain", function () {
    var blockchain;
    var wallet1 = new Wallet("fe75beff4e1ce28e8e6555adee7acfed47ce58be338ff95addb8e2371d262b2d");
    var wallet2 = new Wallet("841dc0dacfebc2372aba0d22af1a3455f63501bf53c7b3bfa91b0e117a43e0c6");

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
        blockchain.add(new Transaction(wallet1.address, wallet2.address, 10));
        blockchain.createGenesisBlock();

        expect(2).toBe(blockchain.chain.length);

        var block = blockchain.chain[blockchain.chain.length-1];
        expect("00").toBe(block.hash.substring(0, 2));
    });

    it("Cadena válida", function () {
        var transaction = wallet1.sendTo(wallet2.address, 10);
        blockchain.add(transaction);
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