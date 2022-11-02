const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { mongoose, Schema } = require("mongoose");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const text =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const user = process.env.DB_USER;
const pwd = process.env.DB_PASSWORD;

const url =
  "mongodb+srv://" +
  user +
  ":" +
  pwd +
  "@cluster0.ctjpt9c.mongodb.net/blogPosts?retryWrites=true&w=majority";

const options = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose
  .connect(url, options)
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((err) => {
    console.log("Error while connecting to db");
    console.log(err);
  });

const postSchema = new Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("post", postSchema);

app.get("/", (req, res) => {
  const posts = [];

  Post.find({})
    .then((result) => {
      result.forEach((post) => {
        posts.push(post);
      });
    })
    .then(() => {
      res.render("home", {
        homeStartingContent: text,
        postsArr: posts,
      });
    })
    .catch((err) => {
      console.log("Error occurred while fetching DB.");
      console.log(err);
    });
    
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: text });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: text });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/posts/:postId", (req, res) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((result) => {
      res.render("post", { postTitle: result.title, postBody: result.content });
    })
    .catch((err) => {
      console.log("Error occurred while fetching DB.");
      console.log(err);
    });
});

app.post("/compose", (req, res) => {
  const title = req.body.postTitle;
  const content = req.body.postBody;

  const post = new Post({
    title: title,
    content: content,
  });

  post
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log("Error occurred while inserting post into DB.");
      console.log(err);
    });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
