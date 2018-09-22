var express = require("express");
var bodyParser = require('body-parser');

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
    var app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => res.json(blockchain.chain));
    app.post('/transaction', (req, res) => {
        var transaction = blockchain.createTransaction(req.body.from, req.body.to, req.body.ammount);
        //broadcast(responseLatestMsg());
        res.json(transaction);
    });
    app.get('/transaction', (req, res) => {
        var pending = blockchain.pendingTransactions;
        res.json(pending);
    });
    app.post('/mineBlock', (req, res) => {
        var block = blockchain.minePendingTransaction(req.body.miningRewardAddress);
        //broadcast(responseLatestMsg());
        res.status(201).json(block);
    });
    app.get('/balance/:address', (req, res) => {
        var pending = blockchain.getBalanceOfAddress(req.params.address);
        res.json(pending);
    });
    app.get('/peers', (req, res) => {
        res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    app.post('/addPeer', (req, res) => {
        connectToPeers([req.body.peer]);
        res.send();
    });

    http_port = 5000;
    app.listen(http_port, () => console.log('Listening http on port: ' + http_port));
};

initHttpServer();