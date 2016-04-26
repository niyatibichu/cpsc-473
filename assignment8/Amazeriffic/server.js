/*globals require*/
/*globals __dirname*/
var express = require("express"),
    http = require("http"),
    io = require("socket.io")(http),
    // import the mongoose library
    mongoose = require("mongoose"),
    app = express();

app.use(express.static(__dirname + "/client"));
app.use(express.bodyParser());

// connect to the amazeriffic data store in mongo
mongoose.connect('mongodb://localhost/amazeriffic');

// This is our mongoose model for todos
var ToDoSchema = mongoose.Schema({
    description: String,
    tags: [String]
});

var ToDo = mongoose.model("ToDo", ToDoSchema);

var server = http.createServer(app).listen(3000);
io.listen(server);// tell socket io to listen to server

app.get("/todos.json", function (req, res) {
    ToDo.find({}, function (err, toDos) {
        res.json(toDos);
    });
});

//socket io on event to emit new ToDo
io.on('connection', function (socket) {
    socket.on('newToDo', function (toDo) {
        io.emit('newToDo', toDo);
    });
});

app.post("/todos", function (req, res) {
    console.log(req.body);
    var newToDo = new ToDo({ "description": req.body.description, "tags": req.body.tags });
    newToDo.save(function (err, result) {
        if (err !== null) {
            // the element did not get saved!
            console.log(err);
            res.send("ERROR");
        } else {
            // our client expects *all* of the todo items to be returned, so we'll do
            // an additional request to maintain compatibility
            ToDo.find({}, function (err, result) {
                if (err !== null) {
                    // the element did not get saved!
                    res.send("ERROR");
                }
                res.json(result);
            });
        }
    });
});

