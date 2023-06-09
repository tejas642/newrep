//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});
const User = new mongoose.model("User", userSchema);
//TODO
app.get("/", function (req, res) {
  res.render("home");
});

app
  .route("/login")

  .get(function (req, res) {
    res.render("login");
  })

  .post(function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: username })
      .then((foundUser) => {
        if (password === foundUser.password) {
          res.render("secrets");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

app
  .route("/register")

  .get(function (req, res) {
    res.render("register");
  })

  .post(function (req, res) {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    });
    // newUser.save.then(function (err) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     res.render("secrets");
    //   }
    // })
    newUser
      .save()
      .then(() => {
        res.render("secrets");
      })
      .catch((err) => {
        console.log(err);
      });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
