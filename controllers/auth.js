const User = require("../models/user");
const BadRequest = require("../errors/bad-request");
const UnauthenticatedError = require("../errors/unauthenticated");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};
const login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    throw new BadRequest("please provide email and password");
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new BadRequest("Not a valid user.Please register first");
  }
  const isValidPassword = await user.comparePassword(req.body.password);
  if (!isValidPassword) {
    throw new UnauthenticatedError("Incorrect Password");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};
module.exports = {
  register,
  login,
};
