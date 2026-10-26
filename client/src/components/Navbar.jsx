import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDemoUser } from '../context/DemoUserContext';
import {
  Compass,
  MapPin,
  Package,
  CalendarCheck2,
  Heart,
  CalendarDays,
  User,
  LogOut,
  LogIn,
  ShieldCheck,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, isAuthenticated, logout, openLoginModal } = useDemoUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdown(false);
    toast.success('Signed out of demo session');
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'text-teal-600 bg-teal-50/80 font-semibold'
        : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-navy-900">
                Travel<span className="text-teal-600">Ease</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase text-slate-400 font-semibold -mt-1">
                Tour Planner
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/destinations" className={navClass}>
              <MapPin className="w-4 h-4 text-teal-600" />
              Destinations
            </NavLink>
            <NavLink to="/packages" className={navClass}>
              <Package className="w-4 h-4 text-teal-600" />
              Tour Packages
            </NavLink>
            <NavLink to="/my-trips" className={navClass}>
              <CalendarDays className="w-4 h-4 text-teal-600" />
              Plan a Trip
            </NavLink>
            <NavLink to="/my-bookings" className={navClass}>
              <CalendarCheck2 className="w-4 h-4 text-teal-600" />
              My Bookings
            </NavLink>
            <NavLink to="/favorites" className={navClass}>
              <Heart className="w-4 h-4 text-rose-500" />
              Favorites
            </NavLink>
          </nav>

          {/* Right Actions: Admin Entry & Demo User */}
          <div className="hidden md:flex items-center gap-3">
            {/* Admin Demo Entry Button */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-navy-900 text-teal-300 hover:bg-navy-800 border border-teal-500/30 transition shadow-sm"
              title="Demo Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Admin Demo</span>
            </Link>

            {/* User Profile / Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-medium text-navy-900 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[110px] truncate">{user.name || user.email}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-100 py-1.5 text-xs text-slate-700 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-semibold text-navy-900">{user.name}</p>
                      <p className="text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/my-trips"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 transition"
                    >
                      <CalendarDays className="w-4 h-4 text-teal-600" />
                      My Planned Trips
                    </Link>
                    <Link
                      to="/my-bookings"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 transition"
                    >
                      <CalendarCheck2 className="w-4 h-4 text-teal-600" />
                      My Bookings
                    </Link>
                    <Link
                      to="/favorites"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 transition"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      Saved Favorites
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openLoginModal()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                Demo Login
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/admin"
              className="p-1.5 rounded-lg bg-navy-900 text-teal-300 text-xs font-medium"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </NavLink>
          <NavLink
            to="/destinations"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Destinations
          </NavLink>
          <NavLink
            to="/packages"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Tour Packages
          </NavLink>
          <NavLink
            to="/my-trips"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Plan a Trip
          </NavLink>
          <NavLink
            to="/my-bookings"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            My Bookings
          </NavLink>
          <NavLink
            to="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Favorites
          </NavLink>
          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-slate-500 font-medium truncate">{user.email}</span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLoginModal();
                }}
                className="w-full py-2 text-center rounded-lg bg-teal-600 text-white text-xs font-semibold"
              >
                Demo Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
