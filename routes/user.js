const { isValidUser } = require("../middleware/isAuth");
const { User } = require("../models/user");

const router = require("express").Router();

router.get("/", isValidUser, async (req, res) => {
  const user = await User.findOne({ _id: req.userId });
  res.send({ user });
});

router.post("/", isValidUser, async (req, res) => {
  const state = req.body;

  const user = await User.findOneAndUpdate(
    { _id: req.userId },
    { state: state },
    { new: true }
  );
  res.send({ user });
});

module.exports = router;
