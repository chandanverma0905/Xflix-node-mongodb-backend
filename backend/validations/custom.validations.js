// Import Mongoose to validate ObjectId
const mongoose = require("mongoose");
const validGenres = ["Education", "Sports", "Movies", "Comedy", "Lifestyle", "All" ];
const validRatings = ["Anyone", "7+", "12+", "16+", "18+"];
const validSortByOptions = ["viewCount", "releaseDate"];

/**
 * Custom validation for videoLink to check if it follows the required format.
 * Example of valid format: "youtube.com/embed/<video-id>"
 */
 const validateVideoLink = (value, helpers) => {
  // const regex = /^youtube\.com\/embed\/[\w-]+$/; // Regex for validating videoLink format
  // or you can write
  const regex = /^youtube\.com\/embed\/[a-zA-Z0-9_-]+$/;
  if (!regex.test(value)) {
    return helpers.message(
      "\"videoLink\" must be in the format: 'youtube.com/embed/<video-id>'"
    );
  }
  return value; // Return the valid value
};


/**
 * Validate genres
 * @param {string} value
 * @param {*} helpers
 */
// Custom validation function for 'genres'
// This checks if the genre is one of the allowed genres.
const validateGenres = (value, helpers) => {

  const genreList = value.split(","); // genres can be a comma-separated string
  
// Check if all provided genres are valid
const invalidGenres = [];
for (let i = 0; i < genreList.length; i++) {

  const genre = genreList[i].trim(); // Remove any extra spaces

  if (!validGenres.includes(genre)) { // Check if the genre is not valid
    invalidGenres.push(genre); // Add the invalid genre to the invalidGenres array
  }
}

if (invalidGenres.length > 0) {
  // Throw an error if any invalid genre is found
  return helpers.message(`"Genres" must be one of [${validGenres.join(",")}]`);
}
return value; // Return the original value if validation passes

};
  

// Custom validation function for 'contentRating'
// It checks if the content rating is one of the valid ratings.
const validateContentRating = (value, helpers) => {
  if (!validRatings.includes(value)) {
    // If content rating is invalid, throw an error
    return helpers.message(`"contentRating" must be one of [${validRatings.join(",")}]`);
  }
  return value;
};


// Custom validation function for 'sortBy'
// It checks if the sorting field is valid (either "releaseDate" or "viewCount").
const validateSortBy = (value, helpers) => {
  if (!validSortByOptions.includes(value)) {
    // If sortBy is invalid, throw an error
    return helpers.message(`"sortBy" must be one of [${validSortByOptions.join(",")}]`);
  }
  return value;
};


// Custom validation for videoId
const validateVideoId = (value, helpers) => {

  // Check if the value is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(value)) {
    // Throw an error if it's invalid
    return helpers.message("\"videoId\" must be a valid MongoDB ObjectId");
  }
  // Return the value if validation passes
  return value;
};


module.exports={validateGenres, validateContentRating, validateSortBy, validateVideoId, validateVideoLink}

