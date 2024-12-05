const httpStatus = require("http-status");
const config = require("../config/config.js");
const ApiError = require("../utils/ApiError.js");
const mongoose = require('mongoose');

// Send response on errors
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    console.log('Error object:', err); // This will help to debug the actual error structure
    
    // Set default status code to 500 if it's undefined
    const statusCode = err.statusCode || 500;
    
    // Prepare the response body
    const response = {
        code: statusCode,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };
    res.status(statusCode).json(response);
};

module.exports = {
    errorHandler
};