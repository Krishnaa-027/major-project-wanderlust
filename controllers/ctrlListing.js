const Listing = require("../models/listing.js");
// const { cloudinary, streamifier } = require("../cloudConfig.js");
const geocode = require("../utils/geocoding");


module.exports.index = async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("listing/index.ejs",{allListings});
};

module.exports.newFormRender = (req,res) =>{
    res.render("listing/new.ejs")
};

module.exports.showListing = async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    // here we use nested populate for author of our review
       .populate({path: "reviews", 
          populate: {
            path: "author",
          },
       })
       .populate("owner");

    if(!listing){
       req.flash("error", "Sorry, Your requested listing doesn't found!");
       return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listing/show.ejs",{listing})
};


// module.exports.createListing = async (req,res,next) =>{
//      try { 
//        let url = req.file.path;
//        let filename = req.file.filename;

//     //  for map coordinates (geocode the location user entered) 
//         const location = req.body.listing.location;
//         const coordinates = await geocode(location);

//         const newlisting = new Listing(req.body.listing );
//         newlisting.owner = req.user._id;
//         newlisting.image = {url,filename};

//           // if geocoding worked, store lat/lng
//             if (coordinates) {
//             newlisting.geometry = {
//                 type: "Point",
//                 coordinates: [coordinates.lng, coordinates.lat],
//             };
//             } else {
//             // default location (Delhi)
//             newlisting.geometry = {
//                 type: "Point",
//                 coordinates: [77.209, 28.6139],
//             };
//             }

//        await newlisting.save();
//        req.flash("success", "New Listing is Created!");
//        res.redirect("/listings");
//        } 
//         catch (err) {
//         console.error("Error creating listing:", err);
//         req.flash("error", "Something went wrong while creating the listing.");
//         res.redirect("/listings");
//   }
// };


module.exports.createListing = async (req,res,next) =>{
  try { 
    let url = req.file.path;
    let filename = req.file.filename;

    // 1️⃣ Get location from form
    // const location = req.body.listing.location;
    const fullLocation = `${req.body.listing.location}, ${req.body.listing.country}`;


    // 2️⃣ Geocode location
    const coordinates = await geocode(fullLocation);
    console.log("Geocode result:", coordinates); // ✅ Check API output

    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url, filename};

    // 3️⃣ Assign geometry
    newlisting.geometry = {
      type: "Point",
      coordinates: coordinates
        ? [coordinates.lng, coordinates.lat]
        : [77.209, 28.6139] // default Delhi
    };

    console.log("Listing geometry before save:", newlisting.geometry); // ✅ Confirm before saving

    // 4️⃣ Save to DB
    await newlisting.save();

    req.flash("success", "New Listing is Created!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error creating listing:", err);
    req.flash("error", "Something went wrong while creating the listing.");
    res.redirect("/listings");
  }
};







module.exports.editListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
       req.flash("error", "Sorry, Your requested listing doesn't found!");
       return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250/e_blur:100");
    res.render("listing/edit.ejs",{listing, originalImageUrl});
};


module.exports.updateListing = async(req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for Listing.");
    // }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    // for image upload
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    
    // res.redirect("/listings");
        req.flash("success", "This Listing is Updated Successfully!");
    res.redirect(`/listings/${id}`);
};


module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    let dltList = await Listing.findByIdAndDelete(id);
    req.flash("success", "Your Listing is Deleted Successfully!");
    console.log(dltList);
    res.redirect("/listings");
};