const jwt = require("jsonwebtoken");

exports.loginRequired = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function (err, payload) {
      if (payload) return next();
      return next({ status: 401, message: "Please login first" });
    });
  } catch (err) {
    return next({ status: 401, message: "Please login first" });
  }
};

exports.ensureCorrectUser = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function (err, payload) {
      if (payload && payload.id === req.params.id) return next();
      return next({ status: 401, message: "Unathorized" });
    });
  } catch (err) {
    return next({ status: 401, message: "Unathorized" });
  }
};
