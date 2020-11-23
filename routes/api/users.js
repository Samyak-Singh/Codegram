// We have created seperate file for all the route
//users.js will be for  Registering users , handling users
// We could have done all these(routes) in a server.js file , but since this will be large application
// therefore , we have broken down it into , different resources (files)

const express = require("express");
const router = express.Router(); // To use the express Router
const { check, validationResult } = require("express-validator");
// for validation on server side

const User = require("../../models/User");

const gravatar = require("gravatar");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const config = require("config");
//@route POST api/users
//@desc  Register User
//@access Public

//We need Token For access Authorised Route
router.post(
  "/",
  [
    //Format -> (Field , Custom Error message ). Rule ()
    check("name", "Name is Required").not().isEmpty(),
    check("email", "Please include a valid email ").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters "
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    //console.log(req.body); // req.body is the object of data that will be sent to this route
    // We will get data in the req.body ....to allow to do this function , we need to initiallize middleware in server.js
    // To catch the data sent to this route

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // if there are any errors ..the response will be ...
      // 400 means bad request , when the checks are not fulfilled
      //.json( method to print errors );
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body; //We are doing this step so that we, do not need to do req,body , again and again ...

    //since findOne  returns a promise ....we are using async before the function, and therefore by convention we need to report error using try catch block

    try {
      //see if user exists
      let user = await User.findOne({ email }); // Grabbing the user
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "user Already Exists " }] }); // To Get the same funcitonality on the client side ..like above on the checks ..we are passing the array
      }

      //Gets User Avatar
      const avatar = gravatar.url(email, {
        s: "200", //string of length 200
        r: "pg", // no naked
        d: "mm", //default avatar
      });

      //creating the new instances of the user , this doesnt save details ...
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //Encrypting Password
      const salt = await bcrypt.genSalt(10); // hash function
      user.password = await bcrypt.hash(password, salt); // create the hash ..and put it in the password
      console.log(user.password);
      await user.save(); // Anything that returns a promise , we put await in front of him

      const payload = {
        user: {
          id: user.id, //MongoDB has _id but Mongoose has abstraction so we can use (Dot) Version
        },
      };

      jwt.sign(
        // we are signing the token
        payload, // Passing the Payload
        config.get("jwtSecret"), // Passing the secret , that we have in default .json()
        {
          expiresIn: 360000, //optional
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
); //Callback arrow Function  ..This function will hit when we go to "/" using get request

module.exports = router;
