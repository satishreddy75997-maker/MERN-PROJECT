import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ExternalLink,
  ShieldAlert,
  Calendar,
  IndianRupee,
  Users
} from 'lucide-react';
import { getAdminBookings, cancelBooking } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('date-desc');

  // Cancel target
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (status && status !== 'All') params.status = status;
      if (sort) params.sort = sort;

      const res = await getAdminBookings(params);
      setBookings(res.data.data || []);
    } catch (err) {
      console.error('Error fetching admin bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [status, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    try {
      setCancelling(true);
      await cancelBooking(cancelTarget._id);
      toast.success(`Booking ${cancelTarget.bookingReference} cancelled`);
      setCancelTarget(null);
      fetchBookings();
    } catch {
      toast.error('Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const totalValue = bookings
    .filter((b) => b.status === 'Confirmed')
    .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/admin" className="hover:text-teal-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Admin Overview
        </Link>
        <span>/</span>
        <span className="text-navy-900 font-bold">All Bookings</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Customer Bookings Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track all guest reservations, revenue figures, and cancellation operations.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-navy-900 bg-teal-50 px-4 py-2 rounded-2xl border border-teal-100">
          <span>Confirmed Gross Value:</span>
          <span className="text-teal-700 text-sm">₹{totalValue.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ref, email or destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-navy-900 focus:outline-none focus:border-teal-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          
          {/* Status buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Status:</span>
            {['All', 'Confirmed', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatus(st)}
                className={`px-3 py-1 rounded-full font-semibold transition ${
                  status === st
                    ? 'bg-navy-900 text-teal-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-navy-900 focus:border-teal-500"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
          </select>

        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner message="Retrieving booking records..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Ref Code</th>
                  <th className="py-3.5 px-4">Guest Email</th>
                  <th className="py-3.5 px-4">Tour Package</th>
                  <th className="py-3.5 px-4">Departure</th>
                  <th className="py-3.5 px-4">Travelers</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy-900">
                      {b.bookingReference}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-[150px]">
                      {b.email}
                    </td>

                    <td className="py-3.5 px-4 text-navy-900 font-semibold truncate max-w-[200px]">
                      <div>{b.packageTitleSnapshot}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {b.destinationSnapshot}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {new Date(b.departureDate).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {b.travelerCount} Person(s)
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-navy-900">
                      ₹{Number(b.totalAmount).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/booking-confirmation/${b._id}`}
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-100 transition"
                          title="View Receipt"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {b.status === 'Confirmed' && (
                          <button
                            onClick={() => setCancelTarget(b)}
                            className="py-1 px-2 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                Confirm administrative cancellation of booking for guest{' '}
                <strong className="text-navy-900">{cancelTarget.email}</strong>.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Dismiss
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancelConfirm}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
