const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviews = require("./Review.js"); 

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: String,
    },
    description: String,
    price: Number,
    location: String,
    country: String,
    reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
        if(listing) {
            await reviews.deleteMany({ _id: {$in: listing.reviews }});
        }
    
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
