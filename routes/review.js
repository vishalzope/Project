const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/Review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn,isReviewAuthor } = require("../middleware.js");
const reviewsController = require("../controllers/reviews.js");



// ✅ Create a Review (POST)
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewsController.createReview));

// ✅ Delete a Review
router.delete("/:reviewid", isLoggedIn, isReviewAuthor, wrapAsync(reviewsController.deleteReview));

module.exports = router;
