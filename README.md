# Online Ticket Reservation System

A full-stack web application for booking tickets for movies, concerts, sports events, and more. Built with React, Node.js, Express, and MongoDB.

## 🎯 Features

### User Features
- Browse available events/movies
- Interactive seat selection with real-time availability
- User registration and authentication
- Book tickets with multiple seat types (VIP, Premium, Regular)
- View booking history
- Cancel bookings

### Admin Features
- Admin dashboard with statistics
- Create, edit, and delete events
- View all bookings
- Revenue tracking
- Manage seat layouts and pricing

## 🛠️ Technology Stack

**Frontend:**
- React 18
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Lucide React for icons

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- VS Code or any code editor
- Git (optional)

## 🚀 Installation & Setup

### Step 1: Create Project Folder Structure

Create a main folder for your project:
```bash
mkdir online-ticket-reservation
cd online-ticket-reservation
```

### Step 2: Set Up Backend

1. Create backend folder and files:
```bash
mkdir backend
cd backend
```

2. Save all backend files in the following structure:
```
backend/
├── config/
│   └── db.js
├── models/
│   ├── User.js
│   ├── Event.js
│   └── Booking.js
├── routes/
│   ├── auth.js
│   ├── events.js
│   └── bookings.js
├── middleware/
│   └── auth.js
├── .env
├── server.js
└── package.json
```

3. Install backend dependencies:
```bash
npm install
```

4. Configure environment variables in `.env` file (already provided)

### Step 3: Set Up Frontend

1. Go back to main folder and create frontend:
```bash
cd ..
mkdir frontend
cd frontend
```

2. Save all frontend files in the following structure:
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── AdminDashboard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── EventDetails.jsx
│   │   ├── Booking.jsx
│   │   └── MyBookings.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

3. Install frontend dependencies:
```bash
npm install
```

### Step 4: Set Up MongoDB

**Option A: Local MongoDB**
1. Install MongoDB Community Edition
2. Start MongoDB service:
```bash
mongod
```
3. The connection string in `.env` is already set to: `mongodb://localhost:27017/ticket_reservation`

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `.env` file:
```
MONGODB_URI=your_atlas_connection_string
```

## 🏃‍♂️ Running the Application

### Start Backend Server
Open terminal in backend folder:
```bash
cd backend
npm start
```
Backend will run on: http://localhost:5000

### Start Frontend Development Server
Open another terminal in frontend folder:
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:3000

## 👤 Creating Admin User

To access admin features, you need to create an admin user manually in MongoDB:

1. Register a normal user through the application
2. Open MongoDB (using MongoDB Compass or command line)
3. Find your database: `ticket_reservation`
4. Find the `users` collection
5. Edit your user document and change `role` from `"user"` to `"admin"`

Or use MongoDB command:
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

## 📱 Using the Application

### For Users:
1. **Register/Login**: Create an account or login
2. **Browse Events**: View all available events on home page
3. **View Details**: Click on any event to see details
4. **Book Tickets**: 
   - Click "Book Now"
   - Select your preferred seats on the interactive seat map
   - Review booking summary
   - Confirm booking
5. **View Bookings**: Check "My Bookings" to see all your tickets
6. **Cancel Booking**: Cancel tickets if needed

### For Admins:
1. **Login** with admin account
2. **Access Dashboard**: Click "Admin" in navigation
3. **View Statistics**: See booking stats and revenue
4. **Manage Events**:
   - Click "Add Event" to create new event
   - Edit existing events using edit icon
   - Delete events using delete icon

## 🎨 Features Demonstration

### Seat Selection
- **VIP Seats** (Yellow): Rows A-B, Premium pricing
- **Premium Seats** (Blue): Rows C-E, Mid-range pricing  
- **Regular Seats** (Gray): Rows F-J, Standard pricing
- **Booked Seats** (Dark Gray): Cannot be selected
- **Selected Seats** (Green): Your current selection

### Pricing Example
- VIP: ₹500
- Premium: ₹300
- Regular: ₹150

## 🔒 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Role-based access control
- Input validation

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/stats/dashboard` - Get statistics (Admin only)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access (for Atlas)

### Port Already in Use
- Change PORT in backend `.env` file
- Change port in frontend `vite.config.js`

### CORS Errors
- Ensure backend is running
- Check proxy settings in `vite.config.js`

### Dependencies Not Installing
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Try `npm install --legacy-peer-deps`

## 📦 Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```
This creates a `dist` folder with production-ready files.

## 🎓 Project Structure Explanation

### Backend Structure
- **config/**: Database configuration
- **models/**: MongoDB schemas (User, Event, Booking)
- **routes/**: API endpoint handlers
- **middleware/**: Authentication middleware
- **server.js**: Main server file

### Frontend Structure
- **components/**: Reusable UI components
- **pages/**: Main page components
- **context/**: React Context for state management
- **App.jsx**: Main app component with routing

