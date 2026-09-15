const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const Listing = require("../models/listing");
const maptilerClient = require("@maptiler/client");

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; // DB name check kar lena

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");
}

const updateOldListings = async () => {
  await main();

  // Wo saari listings dhoondho jisme geometry nahi hai YA coordinates khaali hain
  const listings = await Listing.find({
    $or: [
      { geometry: { $exists: false } },
      { geometry: null },
      { "geometry.coordinates": { $size: 0 } },
      { "geometry.coordinates": { $exists: false } },
    ],
  });

  console.log(`Updating ${listings.length} old listings...`);

  for (let listing of listings) {
    if (listing.location) {
      try {
        const query = `${listing.location}, ${listing.country || ""}`;
        const response = await maptilerClient.geocoding.forward(query, {
          limit: 1,
        });

        if (response.features && response.features.length > 0) {
          listing.geometry = response.features[0].geometry;
          await listing.save();
          console.log(`Updated: ${listing.title} ->`, listing.geometry.coordinates);
        } else {
          console.log(`No coordinates found for: ${listing.title} (${query})`);
        }
      } catch (err) {
        console.error(`Failed for ${listing.title}:`, err.message);
      }
    }
  }

  console.log("All old listings updated successfully!");
  await mongoose.connection.close();
};

updateOldListings();