describe("Blockchain", function () {
    var Blochchain = require('../blockchain');

    beforeEach(function () {
        blochchain = new Blochchain(2);
    });

    it("Blockchain empty", function () {
        expect(2).toEqual(blochchain.difficulty);
        expect(0).toEqual(blochchain.accounts.length);
        expect(0).toEqual(blochchain.miners.length);
        expect(0).toEqual(blochchain.pendingChunks.length);
        expect(100).toEqual(blochchain.miningReward);
        expect(23).toEqual(blochchain.gift);
    });

    it("create an account", function () {
        let account = blochchain.createAccount("test");
        expect("test").toEqual(account.name);
        expect(1).toEqual(blochchain.accounts.length);

        expect(0).toEqual(blochchain.getBalanceOfAddress("test"));
    });

    it("create an account and mine pending transaction", function () {
        blochchain.createAccount("test");
        expect(1).toEqual(blochchain.accounts.length);

        blochchain.minePendingTransaction();
        expect(blochchain.gift).toEqual(blochchain.getBalanceOfAddress("test"));
    });
});
