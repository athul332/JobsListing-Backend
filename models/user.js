const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = mongoose.Schema({
  name: {
    type: String,
    requires: [true, "please provide name"],
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: [true, "please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    requires: [true, "please provide name"],
  },
});
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.createJWT = function () {
  const token = jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  return token;
};

userSchema.methods.comparePassword = function (uncodedPassword) {
  const isValid = bcrypt.compare(uncodedPassword, this.password);
  return isValid
};

module.exports = mongoose.model("user", userSchema);
