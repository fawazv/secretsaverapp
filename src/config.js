import mongoose from "mongoose";

mongoose
  .connect(
    `mongodb+srv://fawaz1chemmad:${process.env.MONGO_PASS}@cluster0.p8ce7zh.mongodb.net/login-secret`
  )
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log("failed to connect");
  });

const LoginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const secretSchema = new mongoose.Schema({
  imgUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const user = new mongoose.model("users", LoginSchema);
const post = new mongoose.model("posts", secretSchema);

export { user, post };
