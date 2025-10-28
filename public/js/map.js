const map = L.map('map').setView([listingData.lat, listingData.lng], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


// For Red marker icon
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.marker([listingData.lat, listingData.lng], { icon: redIcon })
  .addTo(map)
  .bindPopup(
    `<b style="font-size:14px">${listingData.title}</b><br><small>Exact location will be provided after booking</small>`
  )
  marker.on('mouseover', () => marker.openPopup())
      .on('mouseout', () => marker.closePopup());