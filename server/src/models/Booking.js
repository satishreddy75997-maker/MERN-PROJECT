const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'User email is required'],
      lowercase: true,
      trim: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TourPackage',
      required: [true, 'Tour package reference is required'],
    },
    packageTitleSnapshot: {
      type: String,
      required: true,
    },
    destinationSnapshot: {
      type: String,
      required: true,
    },
    departureDate: {
      type: Date,
      required: [true, 'Departure date is required'],
    },
    travelerCount: {
      type: Number,
      required: [true, 'Traveler count is required'],
      min: [1, 'At least 1 traveler required'],
    },
    pricePerTraveler: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Cancelled'],
      default: 'Confirmed',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
