const jwt = require("jsonwebtoken");
const config = require("config"); //We need to get the JwtSecret

module.exports = function (req, res, next) {
  // next is like the callback...

  //Get token from the header
  const token = req.header("x-auth-token"); //x-auth-token ..key that we want to send the token in

  //check if no token
  if (!token) {
    return res.status(401).json({ msg: "No Token , Authorization Denied" });
  }

  //Verify Token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret")); // this will decode the token
    req.user = decoded.user; //payload's user
    next();
  } catch (err) {
    res, status(401).json({ msg: "Token is Not valid " });
  }
};
