const {Video} = require("../models/video.model");
const ApiError = require("../utils/ApiError.js");
const httpStatus = require("http-status");
const mongoose = require('mongoose');


// function to get videos based on query parameters
const getSearchedVideos = async({title, genres, contentRating, sortBy}) =>{

  // Step 1: Define a filter object to build dynamic query conditions for MongoDB
 const filter = {};
// Step 2: Define a sortOptions object to dynamically control the sorting order
 const sortOptions = {};
   
// Step 3: Add a filter for title, if provided
//Using a case-insensitive regular expression to search for videos with 'title' in their title
if(title){
// Use a case-insensitive regular expression to match the title
    filter.title = {$regex : new RegExp(title, "i")};  // "i" makes it case-insensitive
}
 
// Step 4: Add a filter for genres, if provided
if(genres)
{
// Split the genres string into an array, trimming extra spaces    
const genreList = genres.split(",").map(genre=>genre.trim());

// Add a condition to match videos whose genres are in the provided genre list
filter.genre = { $in: genreList }; // $in matches any value from the array    
}    


// Step 5: Add a filter for contentRating, if provided
 if (contentRating) {
    // Define valid content ratings in a specific order (from least restrictive to most restrictive)
    const validRatings = ["Anyone", "7+", "12+", "16+", "18+"];

    // Determine the allowed ratings based on the provided contentRating
    // Slice the array to include ratings up to and including the specified rating
    const allowedRatings = validRatings.slice(0, validRatings.indexOf(contentRating) + 1);

    // Add a condition to match videos with one of the allowed ratings
    filter.contentRating = { $in: allowedRatings }; // Matches any rating in the allowed list
  }


// Step 6: Add sorting options based on the sortBy parameter

    if (sortBy === "releaseDate") {
      // Sort by releaseDate in descending order (latest first)
      sortOptions.releaseDate = -1;
    }
     
    else if (sortBy === "viewCount") {
      // Sort by viewCount in descending order (highest views first)
      sortOptions.viewCount = -1;
    } 
  
   else {
    // Default sorting is by releaseDate in descending order
    sortOptions.releaseDate = -1;
  }




// Step 7: Query the MongoDB collection using the filter and sortOptions
const videos = await Video.find(filter).sort(sortOptions);

// Step 8: Return the resulting list of videos
return videos;
};



const searchVideoById= async(videoId)=>{
     // Step 1: Check if the videoId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `"${videoId}" is not a valid MongoDB ObjectId`);
  }
    try {
        // Use the Mongoose model to find the video by its ID
        // .lean() converts the Mongoose document into a plain JavaScript object for better performance.
        const video = await Video.findById(videoId).lean();
    
        // Return the video document (or null if not found)
        return video;
      } 
      
    catch (error) {
        // If an invalid ID format is passed, return null
        // The videoId is invalid (e.g., not a valid MongoDB ObjectId).
        // This triggers a specific error in Mongoose called CastError.
        if (error.name === "CastError") 
        {
          return null;
        }
        // Unexpected errors (e.g., database connectivity issues or other bugs).
        // These are rethrown to ensure they propagate to the controller for further handling.
        throw error; // Rethrow unexpected errors
      }

}


const createVideo = async(videoData) =>{

  try{

  // Initialize default fields to the req body sent by user
  const defaultFields = {
    votes: { upVotes: "0", downVotes: "0" },
    viewCount: "0",
  };


  // Merge provided video data with default fields
  const completeVideoData = { ...videoData, ...defaultFields };


  // Create and save the video in the database
  const createdVideo = await Video.create(completeVideoData);


  // Transform the response to include "id" instead of "_id"
  // createdVideo.toObject(): Converts the Mongoose document (createdVideo) into a plain JavaScript object.
// This is necessary because Mongoose documents contain additional methods and metadata that are not part of the raw data.
// const { _id, ...videoDetails } = createdVideo.toObject();
// Extracts the _id field from the object.
// The ...videoDetails syntax collects all other fields into a new object called videoDetails.
  const { _id, ...videoDetails } = createdVideo.toObject();

// Renaming _id to id  
  return { id: _id, ...videoDetails };

}
catch(error){
  throw new ApiError(500, 'Failed to create video');
}
}


const updateVotes = async(videoId, vote, change) =>{

//     // Validate input values for 'vote' and 'change'
//   if (!["upVote", "downVote"].includes(vote) || !["increase", "decrease"].includes(change)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Invalid vote or change type");
// }

   // Find the video by its ID
  const video = await Video.findById(videoId);
  
  // If the video doesnot exist, return null
  if(!video){
    throw new ApiError(httpStatus.NOT_FOUND, "Video not Found");
  }

  // Determine which vote to update: upVotes or downVotes
  if (vote === "upVote" && change === "increase") {
    video.votes.upVotes += 1;
  } 
  else if (vote === "upVote" && change === "decrease") {
    video.votes.upVotes = Math.max(video.votes.upVotes - 1, 0); // Ensure no negative votes
  } 
  else if (vote === "downVote" && change === "increase") {
    video.votes.downVotes += 1;
  } 
  else if (vote === "downVote" && change === "decrease") {
    video.votes.downVotes = Math.max(video.votes.downVotes - 1, 0); // Ensure no negative votes
  } 
  else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid vote or change type");
  }

  
  await video.save();
  return video;

}


const incrementViewCount = async(videoId) =>{

  const video = await Video.findById(videoId);
  
  // If the video is not found, throw an error
  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, "Video not found");
  }

  video.viewCount += 1;

  // Save the updated video
  await video.save();

}

module.exports={getSearchedVideos, searchVideoById, createVideo, updateVotes, incrementViewCount}
