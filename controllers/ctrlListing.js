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


module.exports.createListing = async (req, res, next) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;

    // 1️⃣ Build full location string
    const fullLocation = `${req.body.listing.location}, ${req.body.listing.country}`;
    console.log("Full Location:", fullLocation);

    // 2️⃣ Get coordinates using geocode.js
    const coordinates = await geocode(fullLocation);
    console.log("Coordinates:", coordinates);

    // 3️⃣ Create listing
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };

    // 4️⃣ Save geometry (fallback if null)
    newlisting.geometry = {
      type: "Point",
      coordinates: coordinates
        ? [coordinates.lng, coordinates.lat]
        : [77.2090, 28.6139] // default Delhi
    };

    console.log("Geometry before Save:", newlisting.geometry);

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



// module.exports.updateListing = async (req, res) => {
//   try {
//     let { id } = req.params;

//     // STEP 1: Remove extra spaces
//     req.body.listing.location = req.body.listing.location.trim();
//     req.body.listing.country = req.body.listing.country.trim();

//     // STEP 2: Update listing basic fields
//     let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

//     //  STEP 3: Update geometry
//     const fullLocation = `${req.body.listing.location}, ${req.body.listing.country}`;
//     const coordinates = await geocode(fullLocation);

//     if (coordinates) {
//       listing.geometry = {
//         type: "Point",
//         coordinates: [coordinates.lng, coordinates.lat],
//       };
//     }

//     //  STEP 4: Update image if new file uploaded
//     if (typeof req.file !== "undefined") {
//       let url = req.file.path;
//       let filename = req.file.filename;
//       listing.image = { url, filename };
//     }

//     await listing.save();
//     req.flash("success", "This Listing is Updated Successfully!");
//     res.redirect(`/listings/${id}`);
//   } catch (err) {
//     console.error("Error updating listing:", err);
//     req.flash("error", "Something went wrong while updating the listing.");
//     res.redirect("/listings");
//   }
// };

module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Clean inputs
    req.body.listing.location = req.body.listing.location.trim();
    req.body.listing.country = req.body.listing.country.trim();

    // 2️⃣ Update basic fields first
    let listing = await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { new: true }
    );

    // 3️⃣ Prepare location for geocoding
    const fullLocation = `${req.body.listing.location}, ${req.body.listing.country}`;

    console.log("UPDATE FORM DATA:", req.body.listing);
    console.log("FULL LOCATION SENT TO API:", fullLocation);

    // 4️⃣ Try to geocode new location
    const coordinates = await geocode(fullLocation);
    console.log("Geocode result:", coordinates);

    // 5️⃣ Update geometry
    listing.geometry = {
      type: "Point",
      coordinates: coordinates
        ? [coordinates.lng, coordinates.lat] // correct order: lng, lat
        : [77.209, 28.6139] // fallback: Delhi
    };

    // 6️⃣ Update image (if new uploaded)
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    // 7️⃣ Save updated listing
    await listing.save();

    req.flash("success", "This Listing is Updated Successfully!");
    res.redirect(`/listings/${id}`);

  } catch (err) {
    console.error("Error updating listing:", err);
    req.flash("error", "Something went wrong while updating the listing.");
    res.redirect("/listings");
  }
};



module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    let dltList = await Listing.findByIdAndDelete(id);
    req.flash("success", "Your Listing is Deleted Successfully!");
    console.log(dltList);
    res.redirect("/listings");
};