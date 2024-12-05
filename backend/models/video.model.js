const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    videoLink: {
        type: String,
        required: true,
        trim: true
    },

    title:{
        type: String,
        required: true
    },
    genre:{
        type: String,
        required: true
    },
    contentRating:{
        type: String,
        required: true,
        trim: true
    },
    releaseDate: {
        type: Date,
        required: true,
        default: Date.now()

    },
    previewImage: {
        type: String,
        required: true,
        trim: true
    },
    votes:{
        upVotes:{
            type: Number,
            default: 0
        },
        downVotes:{
            type: Number,
            default: 0
        }
    },
    viewCount:{
        type: Number,
        default: 0
    }
},

{
   timestamps: false
});



/**
 * Check if title is taken
 * @param {string} ttile - The title of video
 * @returns {Promise<boolean>}
 */

//this.findOne({ title }): Searches for a document in the Video collection where the title matches the provided value.
// return !!video: Converts the result into a boolean:
// !!video returns true if a matching document is found.
// Otherwise, it returns false.
// Promise-based Method:
// Since database operations are asynchronous, the method is an async function, returning a Promise<boolean>:
// true: The title is already taken.
// false: The title is not taken.
 videoSchema.static.isTitleTaken = async (title) => {
    const video = await this.findOne({ title });
    return !!video;
}

/*
 * Create a Mongoose model out of videoSchema and export the model as "Video"
 * Note: The model should be accessible in a different module when imported like below
 * const Video = require("<video.model file path>").Video;
 */

/**
 * @typedef Video
 */
const Video = mongoose.model("Video", videoSchema);

module.exports = {Video};