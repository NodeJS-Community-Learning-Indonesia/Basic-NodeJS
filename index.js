const express = require("express");
require("colors");
require("dotenv").config();
const connectDB = require("./config/db");

// initialize express
const app = express();

// connect db
connectDB();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/users", require("./routes/usersRoute"));
app.use("/todos", require("./routes/todosRoute"));

// running the server
app.listen(process.env.PORT || 8080, () => {
    console.log(`Server Running on ${process.env.PORT}`.blue.underline);
});
