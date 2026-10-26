import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { getPackage, createBooking, getPackageAvailability } from '../services/api';
import { useDemoUser } from '../context/DemoUserContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function BookingFlow() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, openLoginModal } = useDemoUser();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [departureDate, setDepartureDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [availability, setAvailability] = useState(null);

  useEffect(() => {
    const loadPkg = async () => {
      try {
        setLoading(true);
        const res = await getPackage(slug);
        const data = res.data.data;
        setPkg(data);
        if (data.departureDates && data.departureDates.length > 0) {
          setDepartureDate(data.departureDates[0]);
        }
      } catch (err) {
        console.error('Error fetching package', err);
        toast.error('Tour package not found');
      } finally {
        setLoading(false);
      }
    };
    loadPkg();
  }, [slug]);

  useEffect(() => {
    if (pkg?._id && departureDate) {
      getPackageAvailability(pkg._id, departureDate)
        .then((res) => setAvailability(res.data))
        .catch(() => setAvailability(null));
    }
  }, [pkg?._id, departureDate]);

  const handleConfirm = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      openLoginModal(() => handleConfirm(e));
      return;
    }

    if (!departureDate) {
      toast.error('Please choose a departure date');
      return;
    }

    try {
      setSubmitting(true);
      const res = await createBooking({
        packageId: pkg._id,
        email: user.email,
        departureDate,
        travelerCount: travelers,
      });

      toast.success('Booking confirmed successfully!');
      navigate(`/booking-confirmation/${res.data.data._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to complete booking';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading checkout details..." />;
  if (!pkg) return null;

  const price = pkg.pricePerTraveler || 0;
  const totalPrice = price * travelers;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back button */}
      <Link
        to={`/packages/${pkg.slug || pkg._id}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-navy-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Package Details
      </Link>

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Review & Confirm Your Booking
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review tour summary and confirm your demo reservation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Form: Traveler selection & Contact */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleConfirm} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            {/* Identity Banner */}
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider block">
                  Booking Contact Email
                </span>
                <span className="text-xs font-bold text-navy-900">
                  {user?.email || 'traveler@travelease.com'}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-teal-600 bg-teal-100/70 px-2.5 py-1 rounded-full">
                Demo Session Active
              </span>
            </div>

            {/* Date selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Departure Date
              </label>
              <select
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-navy-900 bg-white focus:border-teal-500"
                required
              >
                {pkg.departureDates?.map((d) => (
                  <option key={d} value={d}>
                    {new Date(d).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </option>
                ))}
              </select>

              {availability && (
                <p className="text-[11px] text-teal-700 font-medium mt-2">
                  ✓ {availability.availableSpots} of {availability.capacity} seats currently available for this departure.
                </p>
              )}
            </div>

            {/* Traveler Count */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Number of Travelers
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  className="w-11 h-11 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-lg text-navy-900 flex items-center justify-center transition"
                >
                  -
                </button>
                <div className="flex-1 py-2.5 rounded-xl border border-slate-200 text-center font-bold text-sm text-navy-900 bg-slate-50">
                  {travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const maxLimit = availability?.availableSpots || 20;
                    if (travelers < maxLimit) setTravelers(travelers + 1);
                    else toast.error(`Maximum available spots: ${maxLimit}`);
                  }}
                  className="w-11 h-11 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-lg text-navy-900 flex items-center justify-center transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Special Requests or Dietary Preferences (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Vegetarian meals preferred, ground floor room request..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-medium text-navy-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{submitting ? 'Confirming...' : 'Confirm Demo Reservation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Summary Card */}
        <div>
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5 sticky top-24">
            <h3 className="font-bold text-sm text-navy-900 border-b border-slate-100 pb-3">
              Tour Summary
            </h3>

            <div className="space-y-3">
              <h4 className="font-extrabold text-base text-navy-900 leading-snug">
                {pkg.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>{pkg.destination?.name || 'Top Destination'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>{pkg.durationDays} Days / {pkg.durationNights || pkg.durationDays - 1} Nights</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Rate per traveler</span>
                <span className="font-semibold text-navy-900">₹{Number(price).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Number of travelers</span>
                <span className="font-semibold text-navy-900">× {travelers}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Taxes & charges</span>
                <span className="text-teal-600 font-semibold">Included</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between font-extrabold text-navy-900 text-sm">
                <span>Grand Total</span>
                <span className="text-teal-700 text-base">₹{Number(totalPrice).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 space-y-1">
              <span className="font-bold text-navy-900 block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                Instant Demo Guarantee
              </span>
              <span>No credit card or payments required. Saved directly to MongoDB.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
