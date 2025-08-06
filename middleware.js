const Listing = require("./models/listing");
const Review = require("./models/Review.js");

const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
   req.flash("error", "You must be logged in to create a listing");
   return res.redirect("/login");
  }
   next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the owner of this listing");
      return res.redirect(`/listings/${req.params.id}`);
    }

    next();
  };

  module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewid } = req.params;
    let review = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }

    next();
  };

  module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      const message = error.details.map(el => el.message).join(",");
      throw new ExpressError(400, message);
    }
    next();
  };

  module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details.map(el => el.message).join(",");
      throw new ExpressError(400, errorMessage);
    } else {
      next();
    }
  };