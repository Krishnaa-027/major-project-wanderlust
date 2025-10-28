const Reviews = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.postReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);  
// yaha pr abhi error aayga null ka because "/listing/:id" app.js tk hi ruk gyi h 
//  usko yaha pr merge krne k liye ham menthod use krenge   {mergeParams: true}

    let newReview = new Reviews(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    // console.log("new review saved");
    // res.send("new review saved");

        req.flash("success", "New review is Created!");
    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;

    // $PULL  Operator - It removes from an existing array all instances of a value or values that match a specified condition.
    
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});   //ye uss list se bhi delete krva dega
    await Reviews.findByIdAndDelete(reviewId);

    req.flash("success", "Your review is Deleted!");
    res.redirect(`/listings/${id}`);
};