const jwt = require("jsonwebtoken");

module.exports.createAccessToken = (user) =>
  jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: "15m",
  });

module.exports.createRefreshToken = (user) =>
  jwt.sign(
    { userId: user._id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_KEY,
    {
      expiresIn: "7d",
    }
  );

module.exports.sendRefreshToken = (res, user) => {
  const expiryDate = new Date(Number(new Date()) + 604800000);
  res.cookie("jid", this.createRefreshToken(user), {
    httpOnly: true,
    expires: expiryDate,
    sameSite: "none",
    secure: true,
  });
};
