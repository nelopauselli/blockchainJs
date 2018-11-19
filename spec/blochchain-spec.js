const Account = require('./../account');
const Miner = require('./../miner');

describe("Blockchain", function () {
    var Blochchain = require('../blockchain');

    beforeEach(function () {
        blochchain = new Blochchain(2);
    });

    it("Blockchain empty", function () {
        expect(2).toEqual(blochchain.difficulty);
        expect(0).toEqual(blochchain.miners.length);
        expect(1).toEqual(blochchain.pendingDocuments.length);
        expect(100).toEqual(blochchain.miningReward);

        var genesis = blochchain.pendingDocuments[0];
        expect('genesis block').toEqual(genesis.type);
    });

    it("create an account", function () {
        expect(0).toEqual(blochchain.getBalanceOfAddress("test"));
    });

    it("create an account and mine pending transaction", function () {

        let account = new Account("test");
        let miner = new Miner(account);

        blochchain.attachMiner(miner);
        blochchain.minePendingTransaction("test");
        blochchain.minePendingTransaction("test");

        expect(100).toEqual(blochchain.getBalanceOfAddress("test"));
    });
});
