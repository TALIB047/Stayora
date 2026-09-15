const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking");
const {isLoggedIn} = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

router.post(
    "/listings/:id/book",
    isLoggedIn,
    wrapAsync(bookingController.createBooking)
);

router.get(
    "/booking/:id/success",
    isLoggedIn,
    wrapAsync(bookingController.showBookingSuccess)
);


module.exports = router;