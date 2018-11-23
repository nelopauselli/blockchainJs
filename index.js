const Q = require("q");
var Node = require("./blockchainNode");
var restify = require('restify-clients');

var node1 = new Node("nelo");
node1.run(5000)
    .then(function () {
        console.log("nodes running");
        /* Generando movimientos */
        var client = restify.createJsonClient({ url: 'http://localhost:5000' });

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
    });