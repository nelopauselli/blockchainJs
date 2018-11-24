var Node = require("./blockchainNode");

describe("Blockchain nodes", function () {
    it("create two node", function () {
        var node1 = new Node("nelo");
        node1.run(5000)
            .then(function (url) {
                var node2 = new Node("pedro", "http://localhost:5000/");

                node2.run(5001)
                    .then(function () {
                        
                    })

            });
    });
});


