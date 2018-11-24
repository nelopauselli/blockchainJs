var Blockchain = require("./blockchain.js");
var Miner = require("./builtInMiner");
var Peers = require("./peers");

class Node {

    constructor(accountRewards, peer) {
        this.id = accountRewards;
        this.blockchain = new Blockchain(new Miner(accountRewards), 2);

        this.peers = new Peers(this);
        if (peer)
            this.peers.add(peer);
        else
            this.blockchain.createGenesisBlock();
    }

    init() {
        this.peers.register(this);
    }

    add(document) {
        if (!this.blockchain.find(document)) {
            console.log(`adding document ${JSON.stringify(document)} to blockchain of ${this.id}`);

            this.blockchain.add(document);
            this.peers.broadcast({ type: 'new document', document: document });
        }
    }

    notify(message) {
        if (message.type === 'node added') {
            console.log(`register ${message.node.id} as new peer in ${this.id}`);
            this.peers.add(message.node);
        } else if (message.type == 'new document') {
            this.add(message.document);
        } else if (message.type == 'block mined') {
            this.blockchain.addBlock(message.block);
        }
    }

    getBlocks(startAt, callback) {
        var blocks = this.blockchain.chain.slice(startAt);
        callback(blocks);
    }

    mine() {
        var block = this.blockchain.minePendingTransaction();
        if(block)
            this.peers.broadcast({ type: 'block mined', block: block });
    }

    getBalanceOfAddress(account) {
        return this.blockchain.getBalanceOfAddress(account);
    }

    run() {

        console.log(`Chain is valid? ${this.blockchain.isValid() ? 'yes' : 'no'}`);

        /*
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
                    var transaction = this.blockchain.add(new Transaction(req.body.from, req.body.to, req.body.ammount));
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
                server.post('/peers', (req, res) => {
                    console.log("connecting from remote peer");
                    console.log(req.body);
        
                    if (req.body.url) {
                        var url = decodeURI(req.body.url);
                        this.peers.add(url)
                            .then(function (response) {
                                res.send(response.added ? 201 : 200);
                            });
                    }
                });
        
                server.listen(port, function () {
                    console.log('Api listening http on port: ' + port);
                    defered.resolve();
                });
        
                return defered.promise;
        
        */
    }
}

module.exports = Node;