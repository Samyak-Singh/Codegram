const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true, // to get rid of server depricating warning
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }); // since mongoose.connect returns a promise .... thats why adding await
    console.log("connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1); //exit process with failure
  } // while connecting to mongoose , error might occur ..... that's why putting code inside try catch block
}; // creating a async arrow function 'connectDB' so that , we can call this function in server.js

module.exports = connectDB;
//'module' is a variable that represents the current module, and 'exports' is an object that will be exposed as a module.
