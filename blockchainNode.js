var restify = require('restify');
var Blockchain = require("./blockchain.js");
var Miner = require("./builtInMiner");

class BlockchainNode {

    constructor(accountRewards) {
        this.blockchain = new Blockchain(new Miner(accountRewards), 2);
    }

    run(port) {
        console.log(`Chain is valid? ${this.blockchain.isValid() ? 'yes' : 'no'}`);

        var server = restify.createServer();
        server.use(restify.plugins.bodyParser());

        server.post('/account', function (req, res) {
            var account = this.blockchain.criptoCoin(req.body.name);
            res.send(201, account);
        });
        server.get('/account', function (req, res) {
            res.json(criptoCoin.accounts);
        });

        server.get('/blocks', (req, res) => res.json(this.blockchain.chain));

        server.post('/transaction', (req, res) => {
            var transaction = this.blockchain.add(req.body.from, req.body.to, req.body.ammount);
            //broadcast(responseLatestMsg());
            res.json(transaction);
        });
        server.get('/transaction', (req, res) => {
            var pending = this.blockchain.pendingDocuments;
            res.json(pending);
        });
        server.post('/mineBlock', (req, res) => {
            var block = this.blockchain.minePendingTransaction();
            //broadcast(responseLatestMsg());
            res.send(201, block);
        });
        server.get('/balance/:address', (req, res) => {
            let address = req.params.address;
            var balance = this.blockchain.getBalanceOfAddress(address);
            res.json({ account: address, balance: balance });
        });
        server.get('/peers', (req, res) => {
            res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
        });
        server.post('/addPeer', (req, res) => {
            connectToPeers([req.body.peer]);
            res.send();
        });

        server.listen(port, () => console.log('Api listening http on port: ' + port));
    };
}

module.exports = BlockchainNode;