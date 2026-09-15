const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const maptilerClient = require("@maptiler/client");

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; // DB name verify kar lena

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");
}

const initDB = async () => {
  await main();
  await Listing.deleteMany({});
  console.log("Old data deleted...");

  const updatedData = [];

  for (let obj of initData.data) {
    try {
      const response = await maptilerClient.geocoding.forward(
        `${obj.location}, ${obj.country}`,
        { limit: 1 }
      );

      let geometry = {
        type: "Point",
        coordinates: [77.209, 28.6139], // default Delhi fallback agar na mile
      };

      if (response.features && response.features.length > 0) {
        geometry = response.features[0].geometry;
      }

      updatedData.push({
        ...obj,
        owner: "685251d2f24326c0afd12acc", // aapki owner ID
        geometry: geometry,
      });

      console.log`(Geocoded: ${obj.title})`;
    } catch (err) {
      console.log`(Failed for ${obj.title}:, err.message)`;
    }
  }

  await Listing.insertMany(updatedData);
  console.log("Data initialized successfully with full Map coordinates!");
  await mongoose.connection.close();
};

initDB();
