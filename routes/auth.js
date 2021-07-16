const {
  loginController,
  signupController,
} = require("../controllers/auth_controllers");
const { User } = require("../models/user");

const router = require("express").Router();

router.post("/signin", loginController);

router.post("/signup", signupController);

router.get("/logout", (req, res) => {
  res.clearCookie("jid", { sameSite: "none" });
  res.send({ type: "success", message: "logout success" });
});

module.exports = router;
