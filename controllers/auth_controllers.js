const { User } = require("../models/user");
const { errorFormator } = require("../utils");
const jwt = require("jsonwebtoken");
const {
  sendRefreshToken,
  createAccessToken,
  createRefreshToken,
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

  const token = jwt.sign({ email }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: "24h",
  });

  try {
    await user.save();
    res.json({ type: "success", message: "email sent" });
    sendMail
      .sendConformationMail(token, email, name)
      .then((res) => console.log(res))
      .catch((er) => console.log(er));
  } catch (err) {
    res.status(400).json({ type: "error", message: errorFormator(err) });
  }
};

module.exports.verifyUser = (req, res) => {
  const { token } = req.body;
  jwt.decode(token);
};

module.exports.revokeTokenForUser = async (id) => {
  await User.findOneAndUpdate(
    { _id: id },
    { $inc: { tokenVersion: 1 } },
    (err, res) => err
  );

  return res.json({ type: "success", message: "tokens revoked" });
};

module.exports.handleUserConformation = async (req, res) => {
  const { token } = req.body;

  const { email } = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);

  const updated = await User.findOneAndUpdate(
    {
      email,
    },
    { verified: true },
    { new: true }
  );

  res.json({ type: "success", message: "your email id is verified" });
};

module.exports.handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.send();
  const token = createRefreshToken(user);
  sendMail.sendForgotPasswordMail(token, email);
  res.send();
};

module.exports.handleResetPassword = async (req, res) => {
  const { token } = req.body;
  const { userId } = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
  const user = await User.findById(userId);
  res.json({ type: "success" });
};

module.exports.changePassword = async (req, res) => {
  const data = req.body;

  const { userId } = jwt.verify(data.token, process.env.REFRESH_TOKEN_KEY);
  const user = await User.findById(userId, function (err, user) {
    if (err) return false;
    user.password = data.password;
    user.save();
  });
  if (!user)
    return res.status(400).json({ type: "error", message: "user not found" });
  res.json({ type: "success", message: "password changed" });

  sendMail.sendAccountPsdChangedMail(user.email);
};

//
// sendMail({
//   to: email,
//   subject: "Verify your email",
//   html: `press <a href=https://rohith-taskboard.netlify.app/verify/${emailVerificationToken}>here</a> to verify your email`,
// }).catch((err) => {
//   console.log(err);

//   return res
//     .status(500)
//     .json({ type: "error", message: "Error in email sending." });
// });
