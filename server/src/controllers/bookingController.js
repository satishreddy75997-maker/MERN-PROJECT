const crypto = require('crypto');
const Booking = require('../models/Booking');
const TourPackage = require('../models/TourPackage');

// Helper to generate unique booking reference
const generateBookingRef = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'TE-';
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
};

// GET /api/v1/bookings?email=...
exports.getBookings = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required',
      });
    }

    const bookings = await Booking.find({ email: email.toLowerCase().trim() })
      .populate('package')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/bookings/:id
exports.getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let booking;

    if (id.startsWith('TE-')) {
      booking = await Booking.findOne({ bookingReference: id }).populate('package');
    } else {
      booking = await Booking.findById(id).populate('package');
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/bookings
exports.createBooking = async (req, res, next) => {
  try {
    const { packageId, email, departureDate, travelerCount } = req.body;

    if (!packageId || !email || !departureDate || !travelerCount) {
      return res.status(400).json({
        success: false,
        message: 'Package, email, departure date, and traveler count are required',
      });
    }

    const count = parseInt(travelerCount, 10);
    if (isNaN(count) || count < 1) {
      return res.status(400).json({
        success: false,
        message: 'Traveler count must be at least 1',
      });
    }

    const tourPackage = await TourPackage.findById(packageId).populate('destination');
    if (!tourPackage) {
      return res.status(404).json({
        success: false,
        message: 'Tour package not found',
      });
    }

    const depDate = new Date(departureDate);
    if (isNaN(depDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid departure date provided',
      });
    }

    // Capacity checking
    const startOfDay = new Date(depDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(depDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
      package: tourPackage._id,
      status: 'Confirmed',
      departureDate: { $gte: startOfDay, $lte: endOfDay },
    });

    const bookedCount = existingBookings.reduce((sum, b) => sum + b.travelerCount, 0);
    const capacity = tourPackage.capacity || 20;
    const availableSpots = capacity - bookedCount;

    if (count > availableSpots) {
      return res.status(400).json({
        success: false,
        message: `Only ${Math.max(0, availableSpots)} spot(s) remaining for this departure date. Requested: ${count}`,
      });
    }

    // SERVER-SIDE price recalculation
    const pricePerTraveler = tourPackage.pricePerTraveler;
    const totalAmount = pricePerTraveler * count;

    // Generate unique reference
    let bookingReference = generateBookingRef();
    let collision = await Booking.findOne({ bookingReference });
    while (collision) {
      bookingReference = generateBookingRef();
      collision = await Booking.findOne({ bookingReference });
    }

    const destinationName = tourPackage.destination?.name || 'Popular Destination';

    const booking = await Booking.create({
      bookingReference,
      email: email.toLowerCase().trim(),
      package: tourPackage._id,
      packageTitleSnapshot: tourPackage.title,
      destinationSnapshot: destinationName,
      departureDate: depDate,
      travelerCount: count,
      pricePerTraveler,
      totalAmount,
      currency: tourPackage.currency || 'INR',
      status: 'Confirmed',
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking confirmed successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/bookings/:id/cancel
exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled',
      });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};
