const express = require("express");
const connectDB = require("./config/db"); //We will be using this ...when we need to connect to database
const app = express();

const path = require('path'); 
// Connect to Database
connectDB(); // Calling the function we created in db,js ....to connect to database ..as this will be the file that will run when server will start

// Earlier We need to include body parser to use req.body
// But now it , comes with express by default
// Init Middleware
app.use(express.json({ extended: false }));


// Define routes
app.use("/api/users", require("./routes/api/users"));
//make api/users ...pertain to , get in users.js
//Using restful Api

app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));




if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client', 'build')));
  
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    });
    
  }
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server Started On " + PORT));

// To run the server , Type npm run server in the terminal
