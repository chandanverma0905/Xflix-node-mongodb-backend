const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError.js");
const catchAsync = require("../utils/catchAsync");
const videoService = require("../services/video.service.js");
const mongoose = require('mongoose');

// Controller to get all videos with filtering and sorting options
// const getVideos = catchAsync (async(req, res) => {

//       // Extract query parameters
//     const { title, genres, contentRating, sortBy } = req.query;
//     const title1 = title ? title : "";
//     const contentRating1 = contentRating ? contentRating : "All";
//     const genres1 = genres ? genres : ["All"];
//     const sortBy1 = sortBy ? sortBy : "releaseDate";
    
//       // Call service to fetch videos
//     const videosData = await videoService.getSearchedVideos(title1, genres1, contentRating1, sortBy1);

//     res.status(200).send({videosData});
//   }
// );

const getAllVideos = catchAsync(async (req, res) => {
  // Extract query parameters with default values
  const { title= "", genres= "", contentRating= "", sortBy= "releaseDate" } = req.query;

  try{
  // Call service to fetch videos
  const videos = await videoService.getSearchedVideos({ title, genres, contentRating, sortBy });

  // Send successful response with videos data
  res.status(200).send( { videos } );
  }
  catch(error){
     // Use a consistent error-handling structure
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
 

// Controller to get a specific video by its ID
const getVideoById = catchAsync(async (req, res, next) => {
  
  try {
      // Extract videoId from route parameters
      const { videoId } = req.params;
       
      // Call the service layer to fetch video details
      const video = await videoService.searchVideoById(videoId);

      // If video not found, return 404 response
      if (!video) {
        const error = new Error("Video not found");
            error.status = 404;
            throw error;
      }

       // Return the video details with a 200 status code
       res.status(200).json(video);
  }
  catch (error) {
    // Handle unexpected errors
 // Pass the error to the next middleware (error handler)
 next(error);
  }
  });
 




// Controller to create a new video or post a new video
const postVideos = catchAsync(async (req, res) => {

    // Extract video details from the request body
    const videoData = req.body;

    // Call the service function to create a new video
    const createdVideo = await videoService.createVideo(videoData);

    // Return a success response with the created video
    res.status(201).json(createdVideo);
   
  
  // catch (error) 
  // {
  //   // Handle validation or internal server errors
  //   if (error.isJoi) {
  //     // Joi validation error
  //     return res.status(httpStatus.BAD_REQUEST).json({
  //       code: httpStatus.BAD_REQUEST,
  //       message: error.details[0].message,
  //     });
  //   }
  //   // Generic server error
  //   return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
  //     code: httpStatus.INTERNAL_SERVER_ERROR,
  //     message: "Internal server error",
  //   });
  // }
});



// Controller to update votes (upvotes & downvotes) on a video (Note: a user can upvote and downvote a particular video many number of times as mentioned in API Contract )
const updateVotesCount = catchAsync(async (req, res) => {
  
   const {videoId} = req.params; // Extract videoId from the URL params
   const { vote, change } = req.body; // Extract vote and change from the request body

  // Call the video service to update votes
  const updatedVideo = await videoService.updateVotes(videoId, vote, change);

  // If no video found, return 404 Not Found
  if (!updatedVideo) {
    return res.status(404).send({
      code: 404,
      message: "Video not found",
    });
  }

  // On successful vote update, return 204 No Content
  return res.status(204).send();
  

  // catch(err){
  //   // Catch and pass to the error middleware
  //   next(err);
  // }
});



// Controller to increment view count for a video
const updateViewCount = catchAsync( async (req, res) => {
  
  const { videoId } = req.params;

  // Call the service to update the view count
  await videoService.incrementViewCount(videoId);

  // Send a 204 No Content response on success
  res.status(204).send();

})

module.exports = {getAllVideos, getVideoById, postVideos, updateVotesCount, updateViewCount};