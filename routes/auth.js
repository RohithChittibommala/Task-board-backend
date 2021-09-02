const {
  loginController,
  signupController,
  handleUserConformation,
  handleForgotPassword,
  handleResetPassword,
  changePassword,
} = require("../controllers/auth_controllers");
const { isValidUser } = require("../middleware/isAuth");
const { User } = require("../models/user");

const router = require("express").Router();

router.post("/signin", loginController);

router.post("/signup", signupController);

router.get("/logout", (req, res) => {
  res.clearCookie("jid", { sameSite: "none", secure: true });
  res.send({ type: "success", message: "logout success" });
});

router.post("/conformation", handleUserConformation);

router.post("/forgot_password", handleForgotPassword);

router.post("/reset_password", handleResetPassword);

router.post("/change_password", changePassword);

module.exports = router;
