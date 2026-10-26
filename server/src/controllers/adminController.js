const Destination = require('../models/Destination');
const TourPackage = require('../models/TourPackage');
const Booking = require('../models/Booking');

// GET /api/v1/admin/dashboard/stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalDestinations = await Destination.countDocuments();
    const totalPackages = await TourPackage.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'Confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'Cancelled' });

    // Sum total demo revenue for confirmed bookings
    const revenueAggregation = await Booking.aggregate([
      { $match: { status: 'Confirmed' } },
      { $group: { _id: null, totalValue: { $sum: '$totalAmount' } } },
    ]);
    const totalDemoBookingValue = revenueAggregation.length > 0 ? revenueAggregation[0].totalValue : 0;

    // Recent 6 bookings
    const recentBookings = await Booking.find()
      .populate('package')
      .sort({ createdAt: -1 })
      .limit(6);

    // Breakdown for status chart
    const statusData = [
      { name: 'Confirmed', count: confirmedBookings, color: '#0d9488' },
      { name: 'Cancelled', count: cancelledBookings, color: '#f43f5e' },
    ];

    res.json({
      success: true,
      stats: {
        totalDestinations,
        totalPackages,
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        totalDemoBookingValue,
      },
      recentBookings,
      statusData,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/admin/bookings
exports.getAdminBookings = async (req, res, next) => {
  try {
    const { search, status, sort } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { bookingReference: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { packageTitleSnapshot: { $regex: search, $options: 'i' } },
        { destinationSnapshot: { $regex: search, $options: 'i' } },
      ];
    }

    let query = Booking.find(filter).populate('package');

    if (sort === 'date-asc') {
      query = query.sort({ createdAt: 1 });
    } else if (sort === 'amount-desc') {
      query = query.sort({ totalAmount: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const bookings = await query.exec();

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/admin/destinations
exports.getAdminDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/admin/packages
exports.getAdminPackages = async (req, res, next) => {
  try {
    const packages = await TourPackage.find().populate('destination').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: packages.length,
      data: packages,
    });
  } catch (error) {
    next(error);
  }
};
