const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Reviews = require("./review.js");

const listingSchema = new Schema({
    title:{ type: String, required: true},
    description:{type:String,},
    image: {
    // filename: { type: String },
    // url: {
    // type: String,
    // default: "https://images.unsplash.com/photo-1523191339508-68905a77d5e7?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // set: (v) =>
    //   v === ""
    //     ? "https://images.unsplash.com/photo-1523191339508-68905a77d5e7?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    //     : v,
    //   },
    url: {type: String },
    filename: { type: String },
    },
    price:{type:Number,},
    location:{type:String,},
    country:{type:String,},
    reviews:[
      {
        type: Schema.Types.ObjectId,
        ref:"Review",
      },
    ],
    owner:{
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    geometry:{
        type: {
            type: String,
            enum: ["Point"],
            required: true,
            default: "Point"
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true,
            default: [77.209, 28.6139] // Delhi default
        }
    }
});

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing){
    await Reviews.deleteMany({_id: {$in: listing.reviews}});
  }    
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;