const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  }, // We'll be using gavatar , that will link profile pic to your email
  date: {
    type: Date,
    default: Date.now,
  },
});
// Creating Schemas
//ModelName , Schema
User = mongoose.model("user", UserSchema);
module.exports = User;
