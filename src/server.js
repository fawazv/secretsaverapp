import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import "dotenv/config";
import { post, user } from "./config.js";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

let userProfile;

// middleware to check whether authenticated or not
const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/");
  }
};

app.get("/", (req, res) => {
  res.render("form.ejs");
});

// ROUTE TO SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const data = {
      id: Date.now().toString(),
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    // check if the user already exists in the database
    const existingUser = await user.findOne({ email: data.email });

    if (existingUser) {
      res.send("User already exists. Please choose a different username!");
    } else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      data.password = hashedPassword; //Replace the hash password with original password

      const userData = await user.insertMany(data);
      console.log(userData);
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
});

// ROUTE TO LOGIN
app.post("/login", async (req, res) => {
  try {
    const check = await user.findOne({ email: req.body.email });
    if (!check) {
      res.send("User name cannot found");
    }

    // compare the hash password from the database with the plain text
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (isPasswordMatch) {
      req.session.isAuth = true;
      userProfile = check.username;
      res.redirect("/secrets");
    } else {
      req.send("wrong password");
    }
  } catch {
    res.redirect("/");
  }
});

// ROUTE TO READ ITEMS
app.get("/secrets", isAuth, async (req, res) => {
  await post.find().then((post) => {
    res.render("secrets.ejs", {
      secrets: post,
      userProfile: userProfile,
    });
  });
});

// ROUTE TO ADD ITEM
app.post("/create", async (req, res) => {
  try {
    const data = {
      imgUrl: req.body.imgUrl,
      title: req.body.title,
      description: req.body.description,
    };
    const cardData = new post(data);
    cardData.save();
    res.redirect("/secrets");
  } catch {
    res.send("can't create the post!");
  }
});

// ROUTE TO DELETE ITEM
app.get("/delete/:id", (req, res) => {
  post
    .findByIdAndDelete({ _id: req.params.id })
    .then(() => {
      console.log("Deleted Successfully!");
      res.redirect("/secrets");
    })
    .catch(() => {
      console.log("Something went wrong to delete data");
    });
});

// ROUTE TO LOGOUT
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
