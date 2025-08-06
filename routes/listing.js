const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});


// ✅ New Route
router.get("/new", isLoggedIn,listingController.renderNewForm );


router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single('listing[image]'),
    wrapAsync(listingController.createListing)
  );

router.route("/:id")
.get( wrapAsync(listingController.showListings))
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));


// ✅ Edit
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;
