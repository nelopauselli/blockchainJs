const Miner = require('./../builtInMiner');

describe("Blockchain", function () {
    var Blochchain = require('../blockchain');

    beforeEach(function () {
        blochchain = new Blochchain(new Miner("miner-test"), 2);
    });

    it("Blockchain empty", function () {
        expect(2).toEqual(blochchain.difficulty);
        expect(0).toEqual(blochchain.pendingDocuments.length);
        expect(100).toEqual(blochchain.miningReward);

        expect(1).toEqual(blochchain.chain.length);
        var block = blochchain.chain[0];

        expect(2).toEqual(block.documents.length);

        var genesis =block.documents[0];
        expect('genesis block').toEqual(genesis.type);

        var minerReawrd = block.documents[1];
        expect('miner reward').toEqual(minerReawrd.type);
        expect(100).toEqual(minerReawrd.data.ammount);
    });

    it("write a document", function () {
        blochchain.add({type: 'info', data: {text: 'Hola desde el blockchain'}});

        expect(1).toEqual(blochchain.chain.length); // genesis block
        expect(1).toEqual(blochchain.pendingDocuments.length);
    });

    it("write a document and mine", function () {

        blochchain.add({ type: 'info', data: { text: 'Hola desde el blockchain' } });
        blochchain.minePendingTransaction();

        expect(2).toEqual(blochchain.chain.length); // genesis block + document
        expect(0).toEqual(blochchain.pendingDocuments.length);
    });
});
