const { db, TABLE_NAMES } = require("./connect");
const User = require("./user");
const Admin = require("./admin");
const Service = require("./service");
const Feedback = require("./feedback");

module.exports = {
  User,
  Admin,
  Service,
  Feedback,
  db,
  TABLE_NAMES
};