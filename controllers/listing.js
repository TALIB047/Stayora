const Listing = require("../models/listing");
const maptilerClient = require("@maptiler/client");

// MapTiler config
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
  const { category, search } = req.query;

  let allListings;

  // Search Listing
    if (search) {
    const searchTerm = search.trim();

    allListings = await Listing.find({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { location: { $regex: searchTerm, $options: "i" } },
        { country: { $regex: searchTerm, $options: "i" } }
      ]
    });


    // No search results
    if (allListings.length === 0) {
      req.flash("error", `No listings found for "${searchTerm}".`);
      return res.redirect("/listings");
    }

  // Category Filter
  } else if (category === "Trending") {
    // Show all listings
    allListings = await Listing.find({});
  } else if (category) {
    // Show only listings of selected category
    allListings = await Listing.find({category: category});
  } else {
    // Default Show all listinga
    allListings = await Listing.find({});
  }
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  // 1. Forward geocode using MapTiler
  const response = await maptilerClient.geocoding.forward(
    req.body.listing.location,
    { limit: 1 }
  );

  console.log("--- GEODATA RESULT ---");
  console.log(response.features[0].geometry);

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  // Handle uploaded image file if present
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { url, filename };
  }

  // 2. Assign the GeoJSON geometry object to the listing
  newListing.geometry = response.features[0].geometry;

  let savedListing = await newListing.save();
  console.log(savedListing);

  req.flash("success", "New Listing Created!");
  // Redirect with backticks template literals
  res.redirect(`/listings/${savedListing._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  // Re-geocode if the location was updated in the form
  const response = await maptilerClient.geocoding.forward(
    req.body.listing.location,
    { limit: 1 }
  );

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // Update geometry with the new coordinates
  listing.geometry = response.features[0].geometry;

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }

  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);

  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};