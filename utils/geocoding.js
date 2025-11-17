

// const axios = require("axios");

// async function geocode(location) {
//   const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         "User-Agent": "wanderlust-app/1.0 (your_email@example.com)"
//       }
//     });

//     if (response.data && response.data.length > 0) {
//       const { lat, lon } = response.data[0];
//       return { lat: parseFloat(lat), lng: parseFloat(lon) };
//     } else {
//       console.warn(`No results found for location: ${location}`);
//       return null;
//     }
//   } catch (err) {
//     console.error("Geocoding error:", err.message);
//     return null;
//   }
// }

// module.exports = geocode;

const axios = require("axios");

async function geocode(location) {
  //  CHANGE 1 — Using Photon API instead of Nominatim
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(location)}`;

  try {
    const response = await axios.get(url);

    //  CHANGE 2 — Extracting lat/lng from Photon response
    if (
      response.data &&
      response.data.features &&
      response.data.features.length > 0
    ) {
      const [lon, lat] = response.data.features[0].geometry.coordinates;
      return { lat, lng: lon };
    } else {
      console.log("No results for:", location);
      return null;
    }

  } catch (err) {
    console.error("Geocoding error:", err.message);
    return null;
  }
}

module.exports = geocode;

