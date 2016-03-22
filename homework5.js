var express = require("express");
var bodyParser = require("body-parser");

var app = express();

var wins=0,
losses=0,
result;

app.use(bodyParser.json());

app.post('/flip', function (req, res) {
    var myChoice = req.body.call;
    console.log("My choice : " + myChoice);
    var coinSide = getCoinSide();
	console.log("Coin side : " + coinSide)
    if (myChoice === coinSide){
        wins++;
		result="win";
		console.log("Result: " + result);
		console.log("wins: " + wins + " losses: "+ losses);
        res.end(JSON.stringify({
            "result": "win"
        }));
    }
	else{
		losses++;
		result="loss";
		console.log("Result: " + result);
		console.log("wins: " + wins + " losses: "+ losses);
        res.end(JSON.stringify({
            "result": "loss"
        }));
	}

});

app.get('/stats', function (req, res) {
  res.sendStatus(JSON.stringify({
        "wins": wins,
        "losses": losses
    }));
});

function getCoinSide(){
   var side = Math.floor((Math.random() * 2) + 1);
   if(side==1){
       return "heads";
   }
   else{
       return "tails";
   }
}

app.listen(8080, function() {
    console.log('App running on port 8080!');
});