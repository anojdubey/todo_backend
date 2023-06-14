var app = require("express")();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cors = require("cors");
var Schema = mongoose.Schema;

const todoSchema = new Schema({
  srno: Number,
  title: String,
  desc: String,
  active: Boolean,
});

mongoose
  .connect(
    "mongodb+srv://anojadubey:qjmgXNa1oVnzrgw4@cluster0.8fwzjox.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((err) => console.log(err));

const Todos = mongoose.model("Todos", todoSchema);

app.use(cors());

app.get("/", function (req, res) {
  Todos.find()
    .then((todos) => {
      if (!todos || todos.length === 0) {
        return res.status(404).json({ message: "No Todos found" });
      } else {
        return res.status(200).json({ todos: todos });
      }
    })
    .catch((err) => console.log(err));
});

app.post("/", bodyParser.json(), function (req, res) {
  const todo = new Todos({
    srno: req.body.srno,
    title: req.body.title,
    desc: req.body.desc,
    active: req.body.active,
  });
  todo.save().then((result) => {
    res
      .status(201)
      .json({
        message: "Post added successfully",
        result: result,
      })
      
  }).catch((err) => console.log(err));
});

app.put("/edittodo", bodyParser.json(), function (req, res) {
  const id = req.body.id;
  const todo = Todos.findByIdAndUpdate(id, {
    title: req.body.title,
    desc: req.body.desc,
  })
    .then((result) => {
      res.status(201).json({
        message: "Post updated successfully",
      });
    })
    .catch((err) => console.log(err));
});

app.delete("/deletetodo/:id", function (req, res) {
  const id = req.params.id;
  Todos.findByIdAndDelete(id)
    .then((result) => {
      res.status(201).json({
        message: "Post deleted successfully",
      });
    })
    .catch((err) => console.log(err));
});

app.listen(5000, function () {
  console.log("listening on port 5000!");
});
