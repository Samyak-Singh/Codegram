import { verify } from "jsonwebtoken";
import { get } from "config"; //We need to get the JwtSecret

export default function (req, res, next) {
  // next is like the callback...

  //Get token from the header
  const token = req.header("x-auth-token"); //x-auth-token ..key that we want to send the token in

  //check if no token
  if (!token) {
    return res.status(401).json({ msg: "No Token , Authorization Denied" });
  }

  //Verify Token
  try {
    const decoded = verify(token, get("jwtSecret")); // this will decode the token
    req.user = decoded.user; //payload's user
    next();
  } catch (err) {
    res, status(401).json({ msg: "Token is Not valid " });
  }
};
