import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import "dotenv/config";

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

const cardDetails = [
  {
    imgUrl:
      "https://s3.amazonaws.com/www.explorersweb.com/wp-content/uploads/2022/09/30041336/shutterstock_606386231.jpg",
    title: "Hidden Treasure",
    description:
      "Buried beneath the ancient oak lies a trove of forgotten gold.",
  },
  {
    imgUrl:
      "https://ca-times.brightspotcdn.com/dims4/default/f8138a8/2147483647/strip/true/crop/4153x2600+0+0/resize/1200x751!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F1d%2F57%2Fc1016f3549bd9e1fc957333bc82e%2Fdsc02484.JPG",
    title: "Whispering Winds",
    description:
      "Buried beneath the ancient oak lies a trove of forgotten gold.",
  },
  {
    imgUrl:
      "https://w0.peakpx.com/wallpaper/563/614/HD-wallpaper-moonlight-serenade-violin-moon-sky-girl-clouds.jpg",
    title: "Midnight Serenade",
    description:
      "Under the moon's gaze, melodies of the heart echo through silent streets.",
  },
];

const users = [];

let userProfile;

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/");
  }
};

app.get("/", (req, res) => {
  console.log(req.sessionID);
  res.render("form.ejs");
});

app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({
      id: Date.now().toString(),
      username: username,
      email: email,
      password: hashedPassword,
    });
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const findUser = users.find((user) => user.email === email);
  userProfile = findUser.username;

  if (findUser == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    bcrypt.compare(password, findUser.password);
    req.session.isAuth = true;
    res.redirect("/secrets");
  } catch {
    res.redirect("/");
  }
});

app.get("/secrets", isAuth, (req, res) => {
  console.log(req.session);
  res.render("secrets.ejs", {
    secrets: cardDetails,
    userProfile: userProfile,
  });
});

app.post("/create", (req, res) => {
  cardDetails.push({
    imgUrl: req.body.imgUrl,
    title: req.body.title,
    description: req.body.description,
  });

  res.redirect("/secrets");
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
