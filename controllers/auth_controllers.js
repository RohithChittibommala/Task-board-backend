const { User } = require("../models/user");
const { errorFormator } = require("../utils");
const jwt = require("jsonwebtoken");

const {
  sendRefreshToken,
  createAccessToken,
} = require("../utils/token_generator");
const sendMail = require("../email");

module.exports.loginController = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({
      message: "user doesnot exist",
      type: "error",
    });

  if (!user.verified)
    return res.status(400).json({
      message: "please verify your email id",
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

  let existingUser = await User.findOne({ email });

  if (existingUser && existingUser.verified)
    return res
      .status(400)
      .json({ type: "error", message: "Email already exists" });

  if (existingUser && !existingUser.verifed)
    return res.status(400).json({
      type: "info",
      message: "email sent Please verify email address",
    });

  const user = new User({
    name,
    password,
    email,
  });

  const emailVerificationToken = jwt.sign(
    { email },
    process.env.REFRESH_TOKEN_KEY,
    {
      expiresIn: "24h",
    }
  );

  sendMail({
    from: "Taskboard",
    to: email,
    subject: "Verify your email",
    html: `press <a href=https://rohith-taskboard.netlify.app/verify/${emailVerificationToken}>here</a> to verify your email`,
  }).catch((err) => {
    return res
      .status(500)
      .json({ type: "error", message: "Error in email sending." });
  });

  try {
    await user.save();
    res
      .status(200)
      .json({ type: "success", message: "email sent to your email address" });
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
