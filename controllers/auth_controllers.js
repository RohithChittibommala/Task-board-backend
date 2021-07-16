const { User } = require("../models/user");
const { errorFormator } = require("../utils");

const {
  sendRefreshToken,
  createAccessToken,
} = require("../utils/token_generator");

module.exports.loginController = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({
      message: "user doesnot exist",
      type: "error",
    });
  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.status(400).json({
      message: "password does not match",
      type: "error",
      accessToken: "",
    });

  sendRefreshToken(res, user);
  // res.cookie("j", "hi");

  res.json({ type: "success", accessToken: createAccessToken(user), user });
};

module.exports.signupController = async (req, res) => {
  const { name, password, email } = req.body;

  let isUserExists = await User.findOne({ email });

  if (isUserExists)
    return res
      .status(400)
      .json({ type: "error", message: "Email already exists" });

  const user = new User({
    name,
    password,
    email,
  });

  try {
    await user.save();
    res.status(200).json({ type: "success", message: "user created" });
  } catch (err) {
    res.status(400).json({ type: "error", message: errorFormator(err) });
  }
};

module.exports.revokeTokenForUser = async (id) =>
  await User.findOneAndUpdate(
    { _id: id },
    { $inc: { tokenVersion: 1 } },
    (err, res) => err
  );
