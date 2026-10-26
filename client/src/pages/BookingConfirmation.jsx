import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  Clock,
  Printer,
  ArrowRight,
  ShieldCheck,
  Package
} from 'lucide-react';
import { getBooking } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooking(bookingId)
      .then((res) => {
        setBooking(res.data.data);
      })
      .catch((err) => {
        console.error('Error loading booking', err);
      })
      .finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) return <LoadingSpinner message="Retrieving booking receipt..." />;

  if (!booking) {
    return (
      <div className="py-24 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-navy-900 mb-2">Booking Not Found</h2>
        <Link
          to="/my-bookings"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600"
        >
          Go to My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-fadeIn">
      
      {/* Top Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
          Demo Booking Confirmed!
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Your tour reservation has been registered and persisted directly into the database.
        </p>
      </div>

      {/* Confirmation Ticket Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden print:border-none print:shadow-none">
        
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-950 p-6 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-400 tracking-widest block">
              Booking Reference
            </span>
            <span className="text-2xl font-black tracking-wider text-white">
              {booking.bookingReference}
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{booking.status}</span>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="p-6 sm:p-8 space-y-6 text-xs">
          
          {/* Tour info */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Selected Tour Package
            </span>
            <h3 className="text-lg font-bold text-navy-900">
              {booking.packageTitleSnapshot}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>{booking.destinationSnapshot}</span>
            </div>
          </div>

          {/* Dates & Travelers Grid */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
            <div>
              <span className="text-slate-400 block font-medium mb-1">Departure Date</span>
              <span className="font-bold text-navy-900 text-sm flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600" />
                {new Date(booking.departureDate).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium mb-1">Traveler Count</span>
              <span className="font-bold text-navy-900 text-sm flex items-center gap-1.5">
                <Users className="w-4 h-4 text-teal-600" />
                {booking.travelerCount} Person(s)
              </span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between text-slate-500">
              <span>Rate per person</span>
              <span className="font-semibold text-navy-900">
                ₹{Number(booking.pricePerTraveler).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Number of travelers</span>
              <span className="font-semibold text-navy-900">
                × {booking.travelerCount}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-navy-900">
              <span>Total Price Paid (Demo)</span>
              <span className="text-teal-700 text-base">
                ₹{Number(booking.totalAmount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* User metadata */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
            <span>Customer: {booking.email}</span>
            <span>Created: {new Date(booking.createdAt).toLocaleDateString()}</span>
          </div>

        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={() => window.print()}
          className="flex-1 py-3 px-4 rounded-xl font-bold text-xs text-navy-900 bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2 transition"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>Print Demo Receipt</span>
        </button>

        <Link
          to="/my-bookings"
          className="flex-1 py-3 px-4 rounded-xl font-bold text-xs text-white bg-teal-600 hover:bg-teal-700 flex items-center justify-center gap-2 shadow-md transition"
        >
          <span>View In My Bookings</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
