require("dotenv").config();

const express = require("express"),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  db = require("./models");

const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messages");

const { loginRequired, ensureCorrectUser } = require("./middleware/auth");

const errorHandler = require("./handlers/error");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use(
  "/api/users/:id/messages",
  loginRequired,
  ensureCorrectUser,
  messagesRoutes
);

app.get("/api/messages", loginRequired, async function (req, res, next) {
  try {
    const messages = await db.Message.find()
      .sort({ createdAt: "desc" })
      .populate("user", { username: true, profileImageUrl: true });
    res.status(200).json(messages);
  } catch (err) {
    return next(err);
  }
});

app.use((req, res, next) => {
  let err = new Error("Not found");
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is starting on PORT: ${PORT}`);
});
