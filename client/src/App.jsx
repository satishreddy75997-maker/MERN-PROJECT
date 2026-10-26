import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DemoUserProvider } from './context/DemoUserContext';
import RootLayout from './layouts/RootLayout';

// Public pages
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetails from './pages/DestinationDetails';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import About from './pages/About';
import Contact from './pages/Contact';

// User demo pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import TripPlanner from './pages/TripPlanner';
import TripNew from './pages/TripNew';
import TripDetail from './pages/TripDetail';
import MyBookings from './pages/MyBookings';

// Booking flow
import BookingFlow from './pages/BookingFlow';
import BookingConfirmation from './pages/BookingConfirmation';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDestinations from './pages/admin/AdminDestinations';
import AdminDestinationForm from './pages/admin/AdminDestinationForm';
import AdminPackages from './pages/admin/AdminPackages';
import AdminPackageForm from './pages/admin/AdminPackageForm';
import AdminBookings from './pages/admin/AdminBookings';

// Fallback
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <DemoUserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            {/* Public */}
            <Route index element={<Home />} />
            <Route path="destinations" element={<Destinations />} />
            <Route path="destinations/:slug" element={<DestinationDetails />} />
            <Route path="packages" element={<Packages />} />
            <Route path="packages/:slug" element={<PackageDetails />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />

            {/* Demo User */}
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="my-trips" element={<TripPlanner />} />
            <Route path="my-trips/new" element={<TripNew />} />
            <Route path="my-trips/:id" element={<TripDetail />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="my-bookings/:id" element={<BookingConfirmation />} />

            {/* Booking Flow */}
            <Route path="packages/:slug/book" element={<BookingFlow />} />
            <Route path="booking-confirmation/:bookingId" element={<BookingConfirmation />} />

            {/* Admin */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/destinations" element={<AdminDestinations />} />
            <Route path="admin/destinations/new" element={<AdminDestinationForm />} />
            <Route path="admin/destinations/:id/edit" element={<AdminDestinationForm />} />
            <Route path="admin/packages" element={<AdminPackages />} />
            <Route path="admin/packages/new" element={<AdminPackageForm />} />
            <Route path="admin/packages/:id/edit" element={<AdminPackageForm />} />
            <Route path="admin/bookings" element={<AdminBookings />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DemoUserProvider>
  );
}
