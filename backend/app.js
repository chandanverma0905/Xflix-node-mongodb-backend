const express = require("express");
const httpStatus = require("http-status");
const videoRoutes = require("./routes/v1");
const cors = require("cors");
const ApiError = require("./utils/ApiError.js");
const { errorHandler } = require("./middlewares/error.js");

const app = express();

//parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options("*", cors());


// Reroute all API request starting with "v1" route
app.use("/v1", videoRoutes);

// send back a 404 error for any unknown api request
app.use((req, res, next)=>{
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
})


app.use(errorHandler);
module.exports = app;