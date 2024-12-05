const express = require("express");
const router = express.Router();
// const { getAllVideos, getVideoById, createVideo, updateVotes, incrementViewCount} = require("../controllers/video.controller.js");

const videoController = require("../../controllers/video.controller.js"); 
const validate = require("../../middlewares/validate.js");
const videoValidation = require("../../validations/video.validations.js");

console.log("your are in router layer");

router.get("/", validate(videoValidation.getVideos), videoController.getAllVideos);

router.get("/:videoId", validate(videoValidation.getVideoWithId), videoController.getVideoById);

router.post("/", validate(videoValidation.postVideo), videoController.postVideos);

router.patch("/:videoId/votes", validate(videoValidation.patchVotes), videoController.updateVotesCount);

router.patch("/:videoId/views", validate(videoValidation.patchViews), videoController.updateViewCount);

module.exports = router;