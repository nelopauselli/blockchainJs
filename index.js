var restify = require('restify');
var Blockchain = require("./blockchain.js");
var Miner = require("./miner.js");
var CriptoCoin = require("./criptoCoin");

var blockchain = new Blockchain(2);
var criptoCoin = new CriptoCoin(blockchain);

var nelo = criptoCoin.createAccount("nelo");
criptoCoin.createAccount("analia");

blockchain.attachMiner(new Miner(nelo));

blockchain.minePendingTransaction("nelo");

for (let account of criptoCoin.accounts)
    console.log(`${account.name} balance: ${blockchain.getBalanceOfAddress(account.name)}`);

console.log(`Chain is valid? ${blockchain.isValid() ? 'yes' : 'no'}`);

var initHttpServer = () => {
    var server = restify.createServer();
    server.use(restify.plugins.bodyParser());

    server.post('/account', function (req, res) {
        var account = blockchain.criptoCoin(req.body.name);
        res.send(201, account);
    });
    server.get('/account', function (req, res) {
        res.json(criptoCoin.accounts);
    });

    server.get('/blocks', (req, res) => res.json(blockchain.chain));

    server.post('/transaction', (req, res) => {
        var transaction = blockchain.add(req.body.from, req.body.to, req.body.ammount);
        //broadcast(responseLatestMsg());
        res.json(transaction);
    });
    server.get('/transaction', (req, res) => {
        var pending = blockchain.pendingDocuments;
        res.json(pending);
    });
    server.post('/mineBlock', (req, res) => {
        var block = blockchain.minePendingTransaction(req.body.miningRewardAddress);
        //broadcast(responseLatestMsg());
        res.send(201, block);
    });
    server.get('/balance/:address', (req, res) => {
        let address = req.params.address;
        var balance = blockchain.getBalanceOfAddress(address);
        res.json({ account: address, balance: balance});
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