const Q = require("q");
var Node = require("./blockchainNode");

var node1 = new Node("nelo");
var node2 = new Node("pedro", node1);

node1.add({ type: 'transaction', from: "nelo", to: "juan", ammount: 23 });
node2.add({ type: 'transaction', from: "nelo", to: "pedro", ammount: 17 });

node1.mine();

Q.all([node1.run(5000), node2.run(5001)])
.done();

/* Generando uso del blochain */
/*
var client = restify.createJsonClient({ url: `http://localhost:${port}` });

client.post('/transaction', { from: "nelo", to: "juan", ammount: 23 }, function (err, req, res, obj) {
    if (err) console.error(err);
    else console.log(obj);

    client.get('/balance/nelo', function (err, req, res, obj) {
        if (err) console.error(err);
        else console.log(obj);

        client.post('/mineBlock', null, function (err, req, res, obj) {
            if (err) console.error(err);

            client.get('/balance/nelo', function (err, req, res, obj) {
                if (err) console.error(err);
                else console.log(obj);
            });

            client.get('/balance/juan', function (err, req, res, obj) {
                if (err) console.error(err);
                else console.log(obj);
            });
        });
    });
});
*/