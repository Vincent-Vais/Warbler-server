const db = require("../models");

exports.createMessage = async function (req, res, next) {
  try {
    const message = await db.Message.create({
      text: req.body.text,
      user: req.params.id,
    });
    const foundUser = await db.User.findById(req.params.id);
    foundUser.messages.push(message);
    await foundUser.save();
    const foundMessage = await db.Message.findById(message._id).populate(
      "user",
      {
        username: true,
        profileImageUrl: true,
      }
    );
    return res.status(200).json(foundMessage);
  } catch (err) {
    return next(err);
  }
};

exports.getMessage = async function (req, res, next) {
  try {
    const message = await db.Message.find(req.params.message_id);
    res.status(200).json(message);
  } catch (err) {
    return next(err);
  }
};

exports.deleteMessage = async function (req, res, next) {
  try {
    const foundMessage = await db.Message.findById(req.params.message_id);
    await foundMessage.remove();
    res.status(200).json(foundMessage);
  } catch (err) {
    return next(err);
  }
};
