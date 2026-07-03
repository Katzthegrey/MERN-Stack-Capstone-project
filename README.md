#  KatzBnB - My Airbnb Clone

I built this full-stack Airbnb clone using the MERN stack (MongoDB, Express, React, Node.js) as my capstone project. Users can browse my accommodations, make reservations, leave reviews, and I can manage everything through my admin panel.

---

##  Tech Stack I Used

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express, MongoDB, Mongoose |
| Frontend | React, React Router, Tailwind CSS |
| Admin Panel | React, React Router, Tailwind CSS |
| Authentication | JWT (JSON Web Tokens) |
| File Upload | Multer, Cloudinary |
| Icons | FontAwesome |
| Notifications | React Toastify |

---

##  My Project Structure

My project is organized into three main parts inside the AirbnbClone folder:

- **Backend** - My Express API server with controllers, models, routes, and middleware
- **Frontend** - My main React application that guests use to browse and book
- **AdminYesMe** - My separate React admin panel for managing listings and reservations

---

##  How I Set This Up

### What You Need
- A MongoDB Atlas account (I use the free tier)
- A Cloudinary account (I use the free tier for image hosting)

### 1. Clone My Repository
Download my project from GitHub and navigate into the AirbnbClone directory.

### 2. My Backend Setup
Navigate to the Backend folder and install dependencies with npm. Create a `.env` file with your own MongoDB connection string, Cloudinary credentials, and a JWT secret. My server runs on port 4000 by default.

### 3. My Frontend Setup
Navigate to the frontend folder and install dependencies. Create a `.env` file pointing to my backend API URL and admin panel URL. My frontend runs on port 5173.

### 4. My Admin Panel Setup
Navigate to the AdminYesMe folder and install dependencies. Create a `.env` file pointing to my backend URL. My admin panel runs on port 5174.

---

##  My Default Admin Credentials

I created an admin account for testing and managing the platform:

| Field | Value |
|-------|-------|
| Email | admin@katz.com |
| Password | admin123 |
| Role | host |

> The admin user must have the host role to access the admin panel. If this user doesn't exist yet, I register with these credentials and select the host role during signup.

---

##  Features I Built

###  For Guests (My Frontend)

**Browse Listings** - I display accommodations by location with a full image gallery. Users can scroll through multiple images with thumbnail navigation.

**Search & Filter** - I built a search bar where guests can filter by province, select check-in and check-out dates with a date picker, and choose the number of guests. A search icon appears when all fields are filled.

**Cost Calculator** - My dynamic pricing calculator factors in the nightly rate multiplied by the number of nights, weekly discounts for stays of 7+ nights, cleaning fees, service fees, and occupancy taxes. The total updates in real-time as dates change.

**Make Reservations** - Guests can book stays directly from the accommodation details page. I validate dates to prevent past dates and ensure check-out is after check-in.

**View My Bookings** - I show all reservations with their status: confirmed (blue), completed (green), or cancelled (red). Each booking displays the accommodation image, title, location, dates, guest count, and total price.

**Checkout & Rate** - After a stay, guests click "Checkout" to complete their booking. My rating modal appears automatically, letting them rate 1-5 stars with FontAwesome star icons and write a text review.

**Experiences Page** - I filter my listings by keywords: holiday, lodge, villa, and vacation. The filter is case-insensitive and searches titles, descriptions, and property types.

**Dark Mode** - I added a theme toggle in the navigation menu that switches between light and dark mode across the entire application.

**Nearby Stays** - Using the browser's geolocation API, I show accommodations near the user's current location with a silent fallback if permission is denied.

### 🏢 For Me as Host (My Admin Panel)

**Create Listings** - I built a form where I can add new accommodations with title, description, location (city, province, country), pricing, amenities, guest capacity, and upload multiple images to Cloudinary.

**View My Listings** - All my properties appear in a table with images, titles, locations, prices, and action buttons.

**Update Listings** - I can edit any of my existing listings with a pre-filled form that loads the current data.

**Delete Listings** - I can remove properties I no longer offer.

**View Reservations** - My dashboard shows all bookings in a table with guest names, emails, accommodation details, dates, guest counts, totals, and status badges.

**Manage Bookings** - I can complete or cancel confirmed reservations directly from the table.

**Rating Dashboard** - I display an average rating summary with yellow stars at the top. Each rated reservation has an expandable detail section showing the star rating, written review, and date submitted.

**Guest Favorites** - I can toggle a "Guest Favorite" badge on any of my listings to highlight them.

###  Listing Features I Implemented

**Image Gallery** - Each accommodation has a main image with four thumbnail images that guests can click to view.

**Host Details** - I show the host's name, avatar, superhost badge (if applicable), response rate, and response time.

**Sleeping Arrangements** - I display each room and its bed configuration in cards.

**Specific Ratings** - I show six rating categories with progress bars: cleanliness, communication, check-in experience, accuracy of listing, location, and value for money.

**Guest Reviews** - Written reviews appear with the reviewer's avatar, name, date, star rating, and comment text.

**Weekly Discounts** - I automatically calculate and display savings for stays of 7 nights or more.

**7 Nights Pricing** - A dedicated section shows the estimated cost for a week-long stay.

**Enhanced Cleaning Badge** - A cleaning icon appears for properties with enhanced cleaning protocols.

**Self Check-in Badge** - A key icon indicates keyless entry is available.

###  Home Page Sections

**Hero Banner** - A full-width hero section welcomes users to the platform.

**Location Inspiration** - I show 10 South African locations as clickable cards with scrollable sections for featured homes, location-based groupings, and guest favorites.

**Discover Airbnb Experiences** - Two large cards link to my experiences page: "Things to do on your trip" and "Things to do from home" with background images.

**Shop Airbnb Gift Cards** - A promotional section with a gradient gift card display.

**Inspiration for Future Getaways** - Tabbed navigation (Destinations, Beach, Mountains, Countryside, Amazing pools, Islands, Cabins) filters a grid of destinations with real images from Unsplash, showing each location's name, province, and distance.

---

##  My API Endpoints

### Users
- **POST /api/users/register** - Register a new user (public)
- **POST /api/users/login** - Login and receive a JWT token (public)
- **GET /api/users/profile** - Get the current user's profile (requires auth)

### Accommodations
- **GET /api/accommodations** - Get all listings with optional filters for city, province, guests, price range, type, and sorting (public)
- **GET /api/accommodations/nearby** - Get listings near coordinates using geospatial queries (public)
- **GET /api/accommodations/:id** - Get a single listing by ID (public)
- **POST /api/accommodations** - Create a new listing with Cloudinary image upload (requires host role)
- **PUT /api/accommodations/:id** - Update an existing listing (requires host role and ownership)
- **DELETE /api/accommodations/:id** - Delete a listing (requires host role and ownership)
- **PATCH /api/accommodations/:id/favorite** - Toggle guest favorite badge (requires host role)

### Reservations
- **POST /api/reservations** - Create a new booking with date validation and guest capacity checks (requires auth)
- **GET /api/reservations/user** - Get all bookings for the logged-in guest (requires auth)
- **GET /api/reservations/host** - Get all bookings for the host's listings (requires auth)
- **GET /api/reservations/all** - Get all reservations with optional status filtering (requires auth)
- **GET /api/reservations/:id** - Get a single reservation (requires auth and ownership)
- **PATCH /api/reservations/:id/complete** - Mark a booking as completed, then the guest can rate (requires auth and ownership)
- **PATCH /api/reservations/:id/cancel** - Cancel a booking (requires auth and ownership by guest or host)
- **PATCH /api/reservations/:id/rate** - Submit a star rating and written review for a completed stay, updates the accommodation's average rating (requires auth and ownership)
- **PATCH /api/reservations/:id/status** - Update booking status (requires host role)
- **DELETE /api/reservations/:id** - Delete a reservation (requires auth and ownership)

---

##  My Database Models

### User
I store usernames, emails, and bcrypt-hashed passwords. Each user has a role (user or host), optional avatar and phone number, host verification status, account active status, and references to their listings, wishlists, and bookings.

### Accommodation
I store the title, description, and location (with city, province, country, and GPS coordinates). Each listing has bedroom/bathroom/guest counts, property type, nightly price, an array of amenities, and multiple images. I track pricing details like weekly discounts, cleaning fees, service fees, and occupancy taxes. Host information is stored both as a reference ID and as embedded details (name, avatar, response rate/time, superhost status, join date). I maintain overall ratings and review counts, plus detailed specific ratings for cleanliness, communication, check-in, accuracy, location, and value. I also store sleeping arrangements per room, enhanced cleaning and self check-in flags, a guest favorite toggle, and a list of individual reviews with user names, avatars, star ratings, dates, and comments.

### Reservation
I store references to the listing, guest, and host. Each reservation has check-in/check-out dates, number of guests, total price, and status (confirmed, completed, or cancelled). I also store the guest's name, email, and phone, plus a snapshot of the accommodation's title, location, and main image. For rated stays, I store the star rating, written review, and the date it was submitted.

---

##  Custom Hooks I Created

**useCostCalculator** - I built this to handle all the dynamic pricing logic. It manages check-in/check-out state, validates dates (no past dates, checkout must be after checkin), calculates the number of nights, applies weekly discounts for stays over 7 nights, adds cleaning fees, calculates service fees and occupancy taxes, and returns a total. It also formats currency and provides min/max date constraints for the date pickers.

**useGeolocation** - I wrapped the browser's geolocation API to get the user's current position with error handling for permission denial, loading states, and a retry function.

**useNearbyAccommodations** - I filter my accommodations array to find listings within a specified radius of the user's location using the Haversine formula for distance calculation.

**useExperiencesFilter** - I filter accommodations by keywords (holiday, lodge, villa, vacation) with case-insensitive matching across the title, description, and property type fields. It returns both the filtered list and keyword counts for displaying in the filter buttons.

---

##  How I Deploy

### My Backend on Render (Free Tier)
I push my code to GitHub, connect my repository on Render.com, set my environment variables (MongoDB URI, Cloudinary credentials, JWT secret), and deploy. Render automatically builds and runs my Node.js server.

### My Frontend and Admin on Render (Free Tier)
I push my code to GitHub, import each project on Render.com, set the environment variables pointing to my Render backend URL, and deploy. Render handles the React build process and serves the static files on a global CDN.

---

##  How I Use This App

### As a Guest
I start by browsing the home page where I see featured listings, location inspiration, and destination tabs. I can search using the navigation bar by selecting a province, check-in/check-out dates, and number of guests. When I find an accommodation I like, I click to view its full details - images, description, amenities, host info, sleeping arrangements, and reviews. I use the cost calculator to select my dates and see the total price with all fees. When ready, I click Reserve (logging in if needed). After booking, I can view all my reservations in the dropdown menu under "View Reservations". After my stay, I click "Checkout" to complete the booking, which opens a rating modal where I can give 1-5 stars and write a review. My rating updates the accommodation's overall score.

### As a Host (Admin)
I open my admin panel and log in with my host credentials. From the sidebar, I can create new listings with images, pricing, and amenities. I view all my properties in the listings table. When guests book my properties, I see their reservations in the dashboard with all details. I can complete bookings when guests check out or cancel if needed. I monitor guest ratings and reviews in the expandable detail rows to see feedback on my properties. I can also mark any listing as a guest favorite to highlight it.

---

##  Security Measures I Took

- I hash all passwords with bcrypt before storing them
- I use JWT tokens for authentication on all protected routes
- My auth middleware verifies tokens and attaches user info to requests
- I have a separate hostAuth middleware that restricts admin functions to host users only
- I configured CORS to only allow requests from my frontend and admin domains
- I store all sensitive credentials (database URI, API keys, secrets) in environment variables
- I never commit .env files to my repository

---

##  About Me

I'm **Katz** - I built this Airbnb clone as my capstone project to demonstrate my full-stack development skills using MongoDB, Express, React, and Node.js. This project showcases user authentication, CRUD operations, file uploads, geolocation features, dynamic pricing, and a complete reservation system with ratings and reviews.

---

##  Credits

- Airbnb for the design inspiration I followed
- Unsplash for the beautiful placeholder images I used throughout
- FontAwesome for the icons in my navigation, buttons, and star ratings
- MongoDB Atlas for hosting my database on their free tier
- Cloudinary for hosting and transforming my listing images
- React Toastify for the toast notifications I use for feedback
