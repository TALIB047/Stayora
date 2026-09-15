const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.createBooking = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    const { checkIn, checkOut, guests } = req.body;

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    // Calculate number of nights
    const nights = Math.ceil(
        (endDate - startDate) / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) {
        req.flash("error", "Check-out date must be after check-in date!");
        return res.redirect(`/listings/${id}`);
    }

    const totalPrice = nights * listing.price;

    const booking = new Booking({
        listing: listing._id,
        user: req.user._id,
        checkIn: startDate,
        checkOut: endDate,
        guests: guests,
        totalPrice: totalPrice,
    });

    await booking.save();

    req.flash("success", "Booking confirmed successfully!");

    res.redirect(`/booking/${booking._id}/success`);
};


module.exports.showBookingSuccess = async (req, res) => {
    const { id } = req.params;

    const booking = await Booking.findById(id)
        .populate("listing")
        .populate("user");

    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/listings");
    }

    res.render("listings/booking-success.ejs", { booking });
};