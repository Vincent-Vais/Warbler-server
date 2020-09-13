const mongoose = require("mongoose");

mongoose.set("debug", true);
mongoose.Promise = Promise;
mongoose.connect(process.env.DATABASE || "mongodb://localhost/warbler", {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports.User = require("./user");
module.exports.Message = require("./message");
