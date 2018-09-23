var restify = require('restify');

var Blockchain = require("./blockchain.js");

var blockchain = new Blockchain(2);

blockchain.createTransaction(null, 'ballena', 1000);
blockchain.createTransaction('ballena', 'nelo', 100);
blockchain.createTransaction('nelo', 'analia', 50);
blockchain.minePendingTransaction("nelo");

console.log("ballena balance: ", blockchain.getBalanceOfAddress("ballena"));
console.log("nelo balance: ", blockchain.getBalanceOfAddress("nelo"));
console.log("analia balance: ", blockchain.getBalanceOfAddress("analia"));

blockchain.minePendingTransaction("nelo");

console.log("ballena balance: ", blockchain.getBalanceOfAddress("ballena"));
console.log("nelo balance: ", blockchain.getBalanceOfAddress("nelo"));
console.log("analia balance: ", blockchain.getBalanceOfAddress("analia"));

console.log(`Chain is valid? ${blockchain.isValid() ? 'yes':'no'}`);

var initHttpServer = () => {
    var server = restify.createServer();

    server.get('/blocks', (req, res) => res.json(blockchain.chain));
    server.post('/account', (req, res) => {
        var account = blockchain.createAcount(req.body.owner, req.body.accountName);
        res.json(account);
    });
    server.post('/transaction', (req, res) => {
        var transaction = blockchain.createTransaction(req.body.from, req.body.to, req.body.ammount);
        //broadcast(responseLatestMsg());
        res.json(transaction);
    });
    server.get('/transaction', (req, res) => {
        var pending = blockchain.pendingTransactions;
        res.json(pending);
    });
    server.post('/mineBlock', (req, res) => {
        var block = blockchain.minePendingTransaction(req.body.miningRewardAddress);
        //broadcast(responseLatestMsg());
        res.status(201).json(block);
    });
    server.get('/balance/:address', (req, res) => {
        var pending = blockchain.getBalanceOfAddress(req.params.address);
        res.json(pending);
    });
    server.get('/peers', (req, res) => {
        res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    server.post('/addPeer', (req, res) => {
        connectToPeers([req.body.peer]);
        res.send();
    });

    let port = 5000;
    server.listen(port, () => console.log('Api listening http on port: ' + port));
};

initHttpServer();