const { verify } = require("jsonwebtoken");

module.exports.isValidUser = (req, res, next) => {
  const authorization = req.headers["authorization"];

  const errors = {
    type: "error",
    message: "no token provided",
  };

  if (!authorization) return res.status(401).json({ ...errors });
  const token = authorization.split(" ")[1];

  verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) => {
    console.log(err);
    if (err)
      return res.status(401).json({ errors: { msg: "token is not valid" } });

    req.userId = user.userId;
    next();
  });
};
