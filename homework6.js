/* globals require */
var express = require("express");
var bodyParser = require("body-parser");
var redis = require('redis');

var client = redis.createClient();
var app = express();

client.set('wins', 0);
client.set('losses', 0);

app.use(bodyParser.json());

app.post('/flip', function (req, res) {

    var myChoice = req.body.call;
    console.log("My choice : " + myChoice);
    var coinSide = getCoinSide();
    console.log("Coin side : " + coinSide);

    if (myChoice === coinSide) {
        client.set('result', "wins");

        client.get('result', function (err, reply) {
            console.log("result: " + reply);
            res.end(JSON.stringify({
                "result": reply
            }));


        });

        client.incr('wins', function (err, reply) {
            console.log("wins: " + reply);
        });
    }
    else {
        client.set('result', "losses");

        client.get('result', function (err, reply) {
            console.log("result: " + reply);
            res.end(JSON.stringify({
                "result": reply
            }));

        });

        client.incr('losses', function (err, reply) {
            console.log("losses: " + reply);
        });

    }
});

app.get('/stats', function (req, res) {
    client.mget("wins", "losses", function (err, reply) {
        console.log("status: wins - " + reply[0] + ", losses - " + reply[1]);
        res.sendStatus(JSON.stringify({
            "status": { "wins": reply[0], "losses": reply[1] }
        }));
    });


});

app.del('/stats', function (req, res) {

    client.set('wins', 0);
    client.set('losses', 0);

    client.mget("wins", "losses", function (err, reply) {
        console.log("status: wins - " + reply[0] + ", losses - " + reply[1]);
        res.sendStatus(JSON.stringify({
            "status": { "wins": reply[0], "losses": reply[1] }
        }));
    });

});

function getCoinSide() {
    var side = Math.random();
    if (side < 0.5) {
        return "heads";
    }
    else {
        return "tails";
    }
}

app.listen(3000, function () {
    console.log('App running on port 3000!');
});