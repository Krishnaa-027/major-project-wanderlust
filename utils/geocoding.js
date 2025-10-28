const axios = require("axios");

async function geocode(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    } else {
      return null;
    }
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
}

module.exports = geocode;
