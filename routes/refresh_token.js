const { verify } = require("jsonwebtoken");

const { User } = require("../models/user");
const {
  createAccessToken,
  sendRefreshToken,
} = require("../utils/token_generator");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const token = req.cookies.jid;

  const errors = {
    ok: false,
    accesToken: "",
    errors: { msg: "No token provided" },
  };

  if (!token)
    return res.status(403).json({
      ...errors,
    });
  let payload;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_KEY);
  } catch (error) {
    return res.status(403).json({ error: error });
  }

  const { userId, tokenVersion } = payload;

  const user = await User.findOne({ _id: userId });

  if (!user) return res.json({ ok: false, accessToken: "" });

  if (user.tokenVersion !== tokenVersion) {
    return res.json({ ok: false, accessToken: "" });
  }
  sendRefreshToken(res, user);
  return res.json({ ok: true, accessToken: createAccessToken(user) });
});

module.exports = router;
