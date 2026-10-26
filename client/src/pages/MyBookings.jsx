import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck2,
  Search,
  Filter,
  Calendar,
  Users,
  MapPin,
  AlertCircle,
  XCircle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { getBookings, cancelBooking } from '../services/api';
import { useDemoUser } from '../context/DemoUserContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

export default function MyBookings() {
  const { user, isAuthenticated, openLoginModal } = useDemoUser();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Cancel modal state
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    if (!isAuthenticated || !user?.email) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await getBookings(user.email);
      setBookings(res.data.data || []);
    } catch (err) {
      console.error('Error fetching bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [isAuthenticated, user?.email]);

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    try {
      setCancelling(true);
      await cancelBooking(cancelTarget._id);
      toast.success(`Booking ${cancelTarget.bookingReference} has been cancelled`);
      setCancelTarget(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4">
          <CalendarCheck2 className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Demo Session Required</h2>
        <p className="text-xs text-slate-500 mb-6">
          Enter an email address to view and manage your tour bookings.
        </p>
        <button
          onClick={() => openLoginModal()}
          className="py-3 px-6 rounded-xl font-bold text-xs text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
        >
          Sign in with Email
        </button>
      </div>
    );
  }

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.bookingReference.toLowerCase().includes(search.toLowerCase()) ||
      b.packageTitleSnapshot.toLowerCase().includes(search.toLowerCase()) ||
      b.destinationSnapshot.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ? true : b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600 mb-1">
            <CalendarCheck2 className="w-3.5 h-3.5" />
            <span>Reservations Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            My Booked Tours
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Logged in as <strong className="text-navy-900">{user.email}</strong>. View details or cancel reservations.
          </p>
        </div>

        <Link
          to="/packages"
          className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
        >
          <span>Book Another Tour</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by reference (e.g. TE-...) or title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-navy-900 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1">
            Status:
          </span>
          {['All', 'Confirmed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full font-semibold transition ${
                statusFilter === st
                  ? 'bg-navy-900 text-teal-300 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <LoadingSpinner message="Loading your tour bookings..." />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description="You haven't made any bookings yet or none match your search."
          actionLabel="Explore Tour Packages"
          onAction={() => window.location.assign('/packages')}
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Details */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-navy-900">
                    {b.bookingReference}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      b.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {b.status === 'Confirmed' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3 h-3 text-rose-600" />
                    )}
                    <span>{b.status}</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Booked on {new Date(b.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-navy-900">
                  {b.packageTitleSnapshot}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    {b.destinationSnapshot}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    Departs: {new Date(b.departureDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    {b.travelerCount} Traveler(s)
                  </span>
                </div>
              </div>

              {/* Right Price & Cancel Action */}
              <div className="flex sm:flex-row md:flex-col items-start md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-3">
                <div className="text-left md:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Total Amount
                  </span>
                  <span className="text-lg font-extrabold text-navy-900">
                    ₹{Number(b.totalAmount).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/booking-confirmation/${b._id}`}
                    className="py-1.5 px-3 rounded-lg text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 transition"
                  >
                    View Receipt
                  </Link>

                  {b.status === 'Confirmed' && (
                    <button
                      onClick={() => setCancelTarget(b)}
                      className="py-1.5 px-3 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
                    >
                      Cancel Tour
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-100 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-navy-900">
                Cancel Booking {cancelTarget.bookingReference}?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to cancel your reservation for{' '}
                <strong className="text-navy-900">{cancelTarget.packageTitleSnapshot}</strong>?
                This will release the reserved capacity back to the pool.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancelConfirm}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Tour'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
