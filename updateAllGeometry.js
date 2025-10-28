// updateAllGeometry.js
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const geocode = require("./utils/geocoding");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB connection error:", err));

async function updateAllListings() {
  const listings = await Listing.find({});
  console.log(`Found ${listings.length} listings.`);

  for (let listing of listings) {
    try {
      const fullLocation = `${listing.location}, ${listing.country}`;
      const coords = await geocode(fullLocation);

      if (coords) {
        listing.geometry = {
          type: "Point",
          coordinates: [coords.lng, coords.lat]
        };
        await listing.save();
        console.log(`Updated: ${listing.title} -> [${coords.lat}, ${coords.lng}]`);
      } else {
        console.log(`No coordinates found for: ${listing.title}, keeping default.`);
      }
    } catch (err) {
      console.log(`Error updating ${listing.title}:`, err);
    }
  }

  console.log("All listings updated!");
  mongoose.connection.close();
}

updateAllListings();
