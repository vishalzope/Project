const Listing = require("../models/listing.js");
const Review = require("../models/Review.js");



module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id; // Associate the review with the logged-in user
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Created");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewid } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};