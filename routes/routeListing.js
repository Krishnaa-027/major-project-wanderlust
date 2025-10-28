const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isloggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/ctrlListing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
// const upload = multer({ dest: 'uploads/' })  
const upload = multer({ storage })





// Because this file is create under route folder so, all the path can be written as "../" inplace of "./"




// app.js   direct cut paste kiya hamne routes ko


// app.get("/testlisting",(req,res)=>{
//      let sampleListing = new Listing({
//         title:"My new villa",
//         description: "By the beach",
//         price:1200,
//         location:"goa",
//         country:"india"
//      });

//     sampleListing.save().then((savedDoc)=>{
//         console.log("sample was saved",savedDoc);
//         res.send("successful testing");
//     }).catch((err)=>{
//         console.log(err);
//     });
// });



router.route("/")
// index route
 .get(validateListing ,wrapAsync(listingController.index))
// CREATE  ROUTE  WITH  error handling by joi.dev
 .post( isloggedIn, upload.single("listing[image][url]"), validateListing , wrapAsync(listingController.createListing));






// // CREATE route
// app.post("/listings",async (req,res,next) =>{
//     // let {title,description,image,price,location,country} = req.body;
//     try{
//        const newlisting = new Listing(req.body.listing);
//        await newlisting.save();
//        res.redirect("/listings");
//     }catch(err){
//        next(err);
//     };
// });

// CREATE  ROUTE  WITH  CUSTOM  ERROR  HANDLING(wrapasync function)
// app.post("/listings", wrapAsync(async (req,res,next) =>{
//        if(!req.body.listing){
//         throw new ExpressError(400,"Send valid data for Listing.");
//        }
//        const newlisting = new Listing(req.body.listing );
//        if(!newlisting.title){
//         throw new ExpressError(400,"Title is missing!");
//        }
//        if(!newlisting.description){
//         throw new ExpressError(400,"Description is missing!");
//        }
//        if(!newlisting.location){
//         throw new ExpressError(400,"Location is missing!");
//        }
//        await newlisting.save();
//        res.redirect("/listings");
//       })
// );




// NEW route
router.get("/new", isloggedIn, listingController.newFormRender);



// EDIT route
router.get("/:id/edit", isloggedIn, isOwner, validateListing , wrapAsync(listingController.editListing));



router.route("/:id")
// show route
  .get(validateListing ,wrapAsync(listingController.showListing))
// UPDATE route
  .put(isloggedIn, isOwner, upload.single("listing[image][url]"), validateListing , wrapAsync(listingController.updateListing))
// DELETE route
  .delete( isloggedIn, isOwner, wrapAsync(listingController.deleteListing));





module.exports = router;