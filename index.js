const express = require("express");
const morgan = require("morgan");
require("colors");
require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");

// initialize express
const app = express();

// connect db
connectDB();

// morgan
app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
);

// cors
const corsOption = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOption));

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
