

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {

  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
})

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  
  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        title: post.title,
        content: post.content
      });
    });

  });

app.get("/about", function (req, res) {
  res.render("about", { about: aboutContent });
})

app.get("/contact", function (req, res) {
  res.render("contact", { contact: contactContent });
})

app.listen(3000, function () {
  console.log("Port 3000 status: ON");
});
