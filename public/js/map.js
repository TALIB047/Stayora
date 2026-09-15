const key = mapKey;

// Coordinates check: agar coordinates valid array hain aur 2 numbers hain toh wahi lo, warna default Delhi lo
let coordinates = [77.2090, 28.6139]; // Default [lng, lat]

if (
  listing &&
  listing.geometry &&
  Array.isArray(listing.geometry.coordinates) &&
  listing.geometry.coordinates.length === 2 &&
   typeof listing.geometry.coordinates[0] === "number" &&
   typeof listing.geometry.coordinates[1] === "number"
) {
  coordinates = listing.geometry.coordinates;
}

// Map initialize
const map = new maplibregl.Map({
  container: "map",
  style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`,
  center: coordinates,
  zoom: 9,
});

// Zoom and rotation controls
map.addControl(new maplibregl.NavigationControl(), "top-right");

// Marker + Popup
const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
 `<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`
);

new maplibregl.Marker({ color: "#fe424d" })
  .setLngLat(coordinates)
  .setPopup(popup)
  .addTo(map);