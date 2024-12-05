const Joi = require("joi");

const { validateGenres, validateContentRating, validateSortBy, validateVideoId, validateVideoLink} = require("./custom.validations");

const getVideos = {

// Validation in video.validations.js:
// For GET requests, we allow optional query parameters, but if any are provided, they will be validated by the corresponding custom functions.
// Why .optional():
// Since we are handling a GET request, parameters are not always necessary. For example, a user may choose not to filter by contentRating or genres but could still want to sort by releaseDate.

    query: Joi.object().keys({
    // 'title' is a string that can be optionally included in the query
    title: Joi.string().optional(), // Optional because title may or may not be present in the query

    // 'genres' is a comma-separated list of genres that will be validated by the custom 'validateGenres' function
    genres: Joi.string().custom(validateGenres).optional(), // Optional and custom validation for genres

    // 'contentRating' is a string that will be validated by the custom 'validateContentRating' function
    contentRating: Joi.string().custom(validateContentRating).optional(), // Optional and custom validation for contentRating
    
    // 'sortBy' is a string that will be validated by the custom 'validateSortBy' function
    sortBy: Joi.string().custom(validateSortBy).optional() // Optional and custom validation for sortBy
    })
};


const getVideoWithId = {
    params: Joi.object().keys({
        videoId: Joi.string().custom(validateVideoId).required()
    })
};


const postVideo ={
    body: Joi.object().keys({
        videoLink: Joi.string().custom(validateVideoLink).required(),  // Validate videoLink
        title: Joi.string().required(),   // Required title
        genre: Joi.string().custom(validateGenres).required(),   // Validate genre
        contentRating: Joi.string().custom(validateContentRating).required(),   // Validate content rating
        releaseDate: Joi.string().required(),  // Required release date
        previewImage: Joi.string().uri().required()  //This adds a rule to validate that the string is a valid URI (Uniform Resource Identifier).
        // A URI can be a URL (e.g., http://example.com/image.jpg) or other types of URIs such as ftp://example.com depending on the input, but URLs are the most common use case.
    })
};


const patchVotes = {
        params: Joi.object().keys({
        // validate videoId in the route parameter
           videoId: Joi.string().custom(validateVideoId).required()
        }),
        body: Joi.object().keys({
        // Ensure "vote" field is one of ["upVote", "downVote"]
        vote: Joi.string().valid("upVote", "downVote").required(),

        // Ensure "change" field is one of ["increase", "decrease"]
        change: Joi.string().valid("increase", "decrease").required()
        })
};


const patchViews = {
   params: Joi.object().keys({
       videoId: Joi.string().custom(validateVideoId).required()
   })
};


module.exports = {
    getVideos,
    getVideoWithId,
    postVideo,
    patchVotes,
    patchViews
}