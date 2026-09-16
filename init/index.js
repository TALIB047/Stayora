const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../.env")
});

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const maptilerClient = require("@maptiler/client");

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

const MONGO_URL = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB Atlas");
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
        coordinates: [77.209, 28.6139]
      };

      if (response.features && response.features.length > 0) {
        geometry = response.features[0].geometry;
      }

      updatedData.push({
        ...obj,
        owner: "6aa8c0705bf87030696cce9d",
        geometry: geometry
      });

      console.log(`Geocoded: ${obj.title}`);

    } catch (err) {
      console.log(`Failed for ${obj.title}: ${err.message}`);
    }
  }

  await Listing.insertMany(updatedData);

  console.log("Data initialized successfully!");

  await mongoose.connection.close();
};

initDB();