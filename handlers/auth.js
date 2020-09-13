const db = require("../models"),
  jwt = require("jsonwebtoken");

exports.signin = async function (req, res, next) {
  try {
    const user = await db.User.findOne({ email: req.body.email });
    const { id, username, profileImageUrl } = user;
    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      const token = jwt.sign(
        { id, username, profileImageUrl },
        process.env.SECRET_KEY
      );
      return res.status(200).json({ id, username, profileImageUrl, token });
    } else {
      return next({ status: 400, message: "Invalid username/password" });
    }
  } catch (err) {
    return next({ status: 400, message: "Invalid username/password" });
  }
};

exports.signup = async function (req, res, next) {
  try {
    const user = await db.User.create(req.body);
    const { id, username, profileImageUrl } = user;
    const token = jwt.sign(
      { id, username, profileImageUrl },
      process.env.SECRET_KEY
    );
    return res.status(200).json({
      id,
      username,
      profileImageUrl,
      token,
    });
  } catch (err) {
    if (err.code === 11000) {
      err.message = "Sorry, that username and/or email is taken";
    }
    return next({ status: 400, message: err.message });
  }
};
