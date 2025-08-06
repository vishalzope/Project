const Listing = require("../models/listing");



module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
  };

module.exports.showListings = async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
   if(!listing) {
    req.flash("error", "This listing are does not exist");
     return res.redirect("/listings");
  };
  // console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const listingData = req.body.listing;
    const newListing = new Listing(listingData);
    newListing.owner = req.user._id; 
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  };

module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
   if(!listing) {
    req.flash("error", "This listing are does not exist");
     return res.redirect("/listings");
  };

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250,");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });
  if(typeof req.file !== "undefined") {
     let url = req.file.path;
     let filename = req.file.filename;
     listing.image = { url, filename };
     await listing.save();
  }
 

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteListing = async (req, res) => {
  const deletedListing = await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
