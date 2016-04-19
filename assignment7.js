/*globals require*/
var express = require('express');
var bodyParser = require('body-Parser');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';

var app = express();
app.use(bodyParser.json());

//to fetch all the links and return an array in response
app.get("/links", function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.warn(err.message);
        }
        else {
            var collection = db.collection('links');
            collection.find().toArray(function (err, items) {
                for (var i in items) {
                    if (items[i] !== null) {
                        /*
                        to convert the _id-ObjectId to 'title' to send array in response
                        */
                        items[i].title = items[i]._id;   
                        delete items[i]._id;
                    }
                }
                res.end(JSON.stringify(items));

            });
        }
         //db.close();
    });
});

//to insert new links in db
app.post("/links", function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.warn(err.message);
            res.send("failed to connect to the db");
        }
        else {
            var links = req.body.links;
            for (var i in links) {
                if (links[i] !== null) {
                    var link = links[i];
                    /*
                    convertion 'title' to ObjectId _id 
                    while storing in db to prevent duplicate values with same title
                    */ 
                    link._id = link.title;
                    delete link.title;
                    link.clicks = 0;
                }
            }
            var collection = db.collection('links');
            collection.insert(links, { w: 1 }, function (err, result) {
                res.send("successfully created and updated the db");

            });
        
        }
         //db.close();
    });
    
});

//to increment the link count on click and update the link click count in db
app.get("/click/:title", function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.warn(err.message);
            res.send("failed to connect to the db");
        }
        else {
            var collection = db.collection('links');
            collection.findAndModify(
                { _id: req.params.title },
                [['_id', 'asc']],
                { $inc: { clicks: 1 } },
                {},
                function (err, object) {
                    if (err) {
                        console.warn(err.message);
                    } else {
                        res.redirect(object.value.link);
                    }
                });

        }
         //db.close();
    });


});


app.listen(3000, function () {
    console.log('App running on port 3000!');
});
