# TravelEase – Travel & Tour Planning Platform (MERN Stack)

A complete, production-grade travel and tour planning web platform built with MongoDB, Express.js, React.js (Vite), and Node.js. TravelEase enables users to discover holiday destinations, browse and filter tour packages, create day-by-day personal trip itineraries with budget tracking, bookmark favorites, make demo reservations with live capacity checks, and manage resources via an Admin portal.

---

## 🌟 Key Features & Recent Enhancements

1. **Interactive Itinerary Builder**
   - **Day-by-Day & Chronological Timeline Views**: Toggle seamlessly between grouped day cards and a continuous vertical chronological timeline.
   - **Activity Management**: Add, edit, and delete activities with title, location, description, estimated cost (INR), scheduled date, and optional time.
   - **Activity Date Validation**: Strict server-side and client-side validation ensuring activity dates strictly fall between the trip's start and end dates.
   - **Reordering**: Reorder activities up and down within any day with real-time persistence.
   - **Activity Budget Aggregation**: Live calculation of total activity costs with a one-click "Sync to Budget" option.

2. **Trip Budget Calculator**
   - **Dedicated Budget Tab**: Full financial breakdown across 6 distinct categories: Transportation, Accommodation, Food, Activities, Shopping, and Other.
   - **Authoritative Server Calculations**: Backend calculates total planned expenses, remaining balance, and budget utilization percentage to prevent floating-point inaccuracies.
   - **Expense Breakdown Chart**: Color-coded visual breakdown bars showing each category's share of overall expenses.
   - **Per-Traveler Cost**: Real-time per-traveler estimated cost calculation based on squad size.
   - **Linked Tour Package Separation**: Displays linked package bookings as paid separately to completely eliminate double counting.

3. **Trip Travel Checklist**
   - **Trip-Independent Checklists**: Every trip maintains its own distinct checklist stored in MongoDB.
   - **Pre-populated Essentials**: Automatically populated with 7 essential travel tasks (ID documents, packing, toiletries, transport, bookings, chargers, itinerary review).
   - **Custom Tasks & Filtering**: Add custom checklist items, filter by 'All', 'Pending', or 'Completed', and edit/delete tasks on the fly.
   - **Real-Time Progress**: Dynamic completion percentage bar and completed vs. remaining item counters.

4. **Enhanced Personal Dashboard (`/dashboard`)**
   - **Real Database Statistics**: Live metrics aggregating planned trips, confirmed vs. cancelled bookings, total trip spending, and average budget utilization.
   - **Upcoming Departure Countdowns**: Visual badges displaying "Departs in X days" or "Ongoing Now" for scheduled trips.
   - **Cross-Trip Actionables**: Highlights next scheduled itinerary activities and incomplete checklist tasks directly on the dashboard.
   - **Quick Actions & Empty States**: Polished empty states for new demo accounts with shortcuts to create trips, explore destinations, or view bookings.

5. **Destination & Package Comparison**
   - **Side-by-Side Comparison**: Select up to 3 destinations or packages on their respective listing pages.
   - **Floating Comparison Bar**: Floating tray displaying selected items with quick launch to the comparison modal.
   - **Accurate Attribute Comparison**: Compares location, category, suggested duration, estimated daily budget, top attractions, and best time to visit for destinations; compares price per traveler, duration, destination, rating/reviews, next departure date, inclusions, and exclusions for tour packages without invented data.

6. **Modern Homepage & Showcase**
   - High-impact Hero section with real travel imagery, instant search, and quick destination tags.
   - Popular destinations cards (Ooty, Manali, Goa, Jaipur, Kerala, Bali, Kashmir, Singapore).
   - Curated tour packages with live pricing in INR, star ratings, and review counts.
   - Travel categories (Hill Station, Beaches, Cultural, Nature, Family, Adventure).

7. **Tour Packages & Live Capacity Reservations**
   - Search, destination filter, duration filter (short/medium/extended), and price slider.
   - Package detail views with day-by-day itinerary accordions, inclusions, and exclusions.
   - Live date availability check querying MongoDB confirmed bookings against maximum traveler capacity.
   - Server-side price recalculation before saving bookings to MongoDB.

8. **Admin Management Portal**
   - Real-time overview metrics: total destinations, packages, bookings, and gross demo revenue.
   - Reservation status visual distribution (Confirmed vs. Cancelled).
   - Full CRUD management for Destinations (create, edit, delete, publish/unpublish).
   - Full CRUD management for Tour Packages with day-by-day itinerary builder.
   - Customer booking inspector with administrative cancellation controls.

9. **Lightweight Demo Authentication**
   - Instant sign-in with any valid email address; no passwords, OTPs, or external verification required.
   - Saved to browser `localStorage` and automatically restored across page refreshes.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React, React Hot Toast |
| **Backend** | Node.js, Express.js, Mongoose, CORS, Morgan, Dotenv |
| **Database** | MongoDB (v8.0+ / Community Edition / Atlas) |
| **Orchestration** | npm, concurrently |

---

## 📁 Project Structure

```
MERN/
├── client/                     # Vite React Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, DestinationCard, PackageCard, LoadingSpinner, etc.
│   │   ├── context/            # DemoUserContext (email session & modal state)
│   │   ├── layouts/            # RootLayout (Navbar, Outlet, Footer, Toaster)
│   │   ├── pages/              # Home, Destinations, DestinationDetails, Packages,
│   │   │                       # PackageDetails, BookingFlow, BookingConfirmation,
│   │   │                       # MyBookings, Favorites, TripPlanner, TripNew, TripDetail,
│   │   │                       # Login, Dashboard, About, Contact, NotFound
│   │   │   └── admin/          # AdminDashboard, AdminDestinations, AdminDestinationForm,
│   │   │                       # AdminPackages, AdminPackageForm, AdminBookings
│   │   ├── services/           # api.js (Axios API client)
│   │   ├── App.jsx             # React Router route registry
│   │   ├── main.jsx            # Entrypoint
│   │   └── index.css           # Tailwind CSS directives & custom styles
│   ├── index.html              # HTML shell with fonts and metadata
│   ├── tailwind.config.js      # Custom theme colors (teal, navy)
│   ├── vite.config.js          # Vite configuration
│   └── package.json
│
├── server/                     # Express & Node Backend
│   ├── src/
│   │   ├── config/             # db.js (Mongoose connection)
│   │   ├── models/             # Destination, TourPackage, Trip, Favorite, Booking
│   │   ├── controllers/        # destinationController, packageController, tripController,
│   │   │                       # favoriteController, bookingController, adminController
│   │   ├── routes/             # REST endpoints mounted under /api/v1
│   │   ├── middleware/         # errorHandler.js
│   │   ├── seed/               # seedData.js, seed.js (idempotent seeder)
│   │   ├── app.js              # Express app definition
│   │   └── server.js           # Server bootstrap
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root orchestration scripts
└── README.md                   # Full documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22+ recommended)
- **MongoDB**: Local MongoDB instance running on port 27017 or a MongoDB Atlas connection string.

### 1. Installation
Clone or navigate to the project directory and install all dependencies:
```bash
# From workspace root
npm run install:all
```
*(Or navigate into `client` and `server` folders and run `npm install` in each).*

### 2. Environment Configuration
**Backend (`server/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/travelease
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend (`client/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### 3. Seed the Database
Populate MongoDB with 8+ detailed holiday destinations and 12+ tour packages:
```bash
npm run seed
# or
cd server && npm run seed
```

### 4. Running the Application

You can launch both server and client concurrently using:
```bash
npm run dev
```

Or run them individually in separate terminals:
```bash
# Terminal 1 - Backend API Server (http://localhost:5000)
cd server
npm run dev

# Terminal 2 - Frontend Client (http://localhost:5173)
cd client
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 📡 REST API Summary (`/api/v1`)

| Resource | Method | Endpoint | Description |
|---|---|---|---|
| **Health** | `GET` | `/health` | Server heartbeat & status |
| **Destinations** | `GET` | `/destinations` | List destinations (search, category, sort) |
| | `GET` | `/destinations/featured` | Top 6 destinations for homepage |
| | `GET` | `/destinations/:idOrSlug` | Destination details + related packages |
| | `POST` | `/destinations` | Create destination (Admin) |
| | `PATCH` | `/destinations/:id` | Update destination (Admin) |
| | `DELETE` | `/destinations/:id` | Delete destination (Admin) |
| **Packages** | `GET` | `/packages` | List packages (search, destination, price, duration) |
| | `GET` | `/packages/:idOrSlug` | Package details with day-by-day itinerary |
| | `GET` | `/packages/:idOrSlug/availability` | Check remaining seats on departure date |
| | `POST` | `/packages` | Create package (Admin) |
| | `PATCH` | `/packages/:id` | Update package (Admin) |
| | `DELETE` | `/packages/:id` | Delete / unpublish package (Admin) |
| **Trips** | `GET` | `/trips?email=...` | List trips for demo user |
| | `POST` | `/trips` | Create custom trip itinerary |
| | `GET` | `/trips/:id` | Trip details and activities |
| | `PATCH` | `/trips/:id` | Update trip activities, dates, or notes |
| | `DELETE` | `/trips/:id` | Delete trip |
| **Bookings** | `GET` | `/bookings?email=...` | Get user bookings |
| | `POST` | `/bookings` | Create confirmed demo booking |
| | `GET` | `/bookings/:id` | Retrieve booking confirmation |
| | `PATCH` | `/bookings/:id/cancel` | Cancel booking & release capacity |
| **Favorites** | `GET` | `/favorites?email=...` | Get bookmarked destinations |
| | `POST` | `/favorites` | Bookmark destination |
| | `DELETE` | `/favorites/:id` | Remove bookmark |
| **Admin** | `GET` | `/admin/dashboard/stats` | Aggregated analytics & gross demo revenue |
| | `GET` | `/admin/bookings` | All guest bookings with filters |
| | `GET` | `/admin/destinations` | All destinations (including drafts) |
| | `GET` | `/admin/packages` | All tour packages (including drafts) |

---

## 🎓 Demonstration Guide for Presentation

When demonstrating TravelEase to evaluators:

1. **Homepage Walkthrough**:
   - Show the dynamic hero search with quick tags like `Ooty`, `Manali`, `Goa`.
   - Scroll through popular destinations, categories, and featured tour packages.
2. **Destination Exploration**:
   - Click **Destinations** in the navbar.
   - Filter by `Hill Station` or `Beaches`. Sort by budget.
   - Click into **Ooty** to show attractions, travel tips, and related packages.
3. **Demo User Sign-In**:
   - Click **Demo Login** in the navbar. Enter `student@college.edu` and submit.
   - Notice the persistent avatar badge and user dropdown.
4. **Tour Booking Flow**:
   - Open **Ooty Nilgiri Tea & Heritage Escape**.
   - Select a departure date and change travelers to `2`.
   - Point out live capacity checking and server-side price calculation.
   - Click **Confirm Demo Booking** to generate a unique `TE-XXXXXX` reference code.
5. **My Bookings & Cancellation**:
   - Open **My Bookings** to view the live reservation.
   - Test canceling the booking to demonstrate status updates and capacity release.
6. **Personal Trip Planner**:
   - Click **Plan a Trip** -> **Create New Trip**.
   - Name it `Ooty Friends Reunion`, set 3 travelers, budget ₹40,000.
   - Add activities like `Botanical Garden Stroll` (₹600) and `Toy Train Ride` (₹1,200).
   - Point out the visual budget tracker progress bar showing remaining funds.
7. **Admin Management Console**:
   - Click **Admin Demo** in the top navigation bar.
   - Review metrics cards, confirmed gross revenue, and status breakdown chart.
   - Demonstrate adding or editing a destination or tour package.

---

## 💡 Notes & Known Limitations

- **Demo Identity**: This application intentionally implements a lightweight demo identity based on user-entered email addresses stored in `localStorage` without passwords or JWT tokens, as specified for rapid demonstration.
- **Mock Payments**: Booking confirmations simulate reservations directly into MongoDB without collecting actual credit card data.
