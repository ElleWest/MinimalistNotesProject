# MinimalistNotesProject

A full-stack minimalist note-taking web application built for IU's "Project: Java and Web Development (DLBCSPJWD01)" course. This project allows users to keep track of notes and time tasks with a clean, distraction-free interface.

Note: If testing on GitHub pages please allow 60 seconds for the backend to spin up in Render's free tier (first sign in won't work but second sign in will once 60 seconds have passed).

## 🏗️ Project Structure

```
MinimalistNotesProject/
├── backend/          # Node.js + Express + MongoDB backend
│   ├── server.js     # Main server file with REST API
│   ├── package.json  # Backend dependencies
│   └── .env          # Environment variables (not tracked)
├── docs/             # Frontend (deployed via GitHub Pages)
│   ├── index.html    # Main HTML file
│   ├── script.js     # Frontend JavaScript with API integration
│   └── styles.css    # Styling
└── README.md         # This file
```

## 🔗 Live Demo

[Click here to view the frontend demo](https://ellewest.github.io/MinimalistNotesProject/)

## ✨ Features

- **📝 Note Management**: Create, edit, and delete notes 
- **✅ Todo Management**: Add, complete, and delete todos 
- **⏱️ Timer System**: Multiple named timers with start/pause/reset functionality
- **🔐 Authentication**: Google Sign-In and manual email/password registration 
- **💬 Daily Quotes**: Inspirational quotes from multiple API sources
- **🌤️ Weather Integration**: Real-time weather updates for your location
- **📊 Dashboard**: Live date, time, and day progress tracking
- **☁️ Cloud Storage**: All data kept in MongoDB with user-specific access
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🚀 Full-Stack Architecture**: Node.js/Express backend with REST API
- **🎨 Clean UI**: Minimalist design with NES style

## 🚀 Installation & Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js** v18.0.0 or higher
- **npm** v8.0.0 or higher
- **Git**
- **MongoDB Atlas account** (free tier available)

### 1. Clone the repository

```bash
git clone https://github.com/ElleWest/MinimalistNotesProject.git
cd MinimalistNotesProject
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `backend/` directory:

```bash
MONGO_URI=your_mongodb_connection_string_here
PORT=3000
```

**To get your MongoDB connection string:**

1. Sign up for [MongoDB Atlas](https://www.mongodb.com/atlas) (free)
2. Create a new cluster
3. Go to Database Access → Add Database User
4. Go to Network Access → Add IP Address (add `0.0.0.0/0` for all IPs)
5. Go to Clusters → Connect → Connect your application
6. Copy the connection string and replace `<password>` with your user password

👉 Reminder: Be sure to insert a valid MONGO_URI in your .env file, using your own MongoDB Atlas cluster or local database connection.

### 4. Start the Backend Server

```bash
node server.js
```

The backend will run at `http://localhost:3000`

### 5. Frontend Setup (Local Development)

```bash
cd ../docs
```

Open `index.html` in your web browser or serve with a local development server (e.g., Live Server extension in VS Code).

**Note:** The frontend is deployed live on GitHub Pages. Local setup is only needed for development.
⚠️ Note on Google Login (OAuth)

Google login is fully functional on the deployed frontend at:
https://ellewest.github.io/MinimalistNotesProject/

Due to Google OAuth restrictions, login may not work on localhost or unregistered domains.

👉 To test Google authentication, please use the live site instead of the local frontend.

### Production Deployment

- **Frontend**: Deployed on GitHub Pages at [https://ellewest.github.io/MinimalistNotesProject/](https://ellewest.github.io/MinimalistNotesProject/)
- **Backend**: Deployed on Render at [https://minimalist-notes-backend.onrender.com](https://minimalist-notes-backend.onrender.com)

Note: The backend is hosted on Render’s free tier, which may cause a delay of up to 60 seconds when loading the app for the first time after a period of inactivity.
Please wait a moment if the app seems slow initially.

## 🛠️ Technology Stack

**Backend:**

- Node.js with Express.js framework
- MongoDB Atlas for cloud database storage
- CORS for cross-origin resource sharing
- RESTful API architecture

**Frontend:**

- HTML5
- CSS3 with responsive design
- Vanilla JavaScript (ES6+)
- Google OAuth for authentication

**APIs & Services:**

- **MongoDB Atlas**: Cloud database hosting
- **Google OAuth 2.0**: User authentication
- **API Ninjas**: Primary quote service (10,000 requests/day)
- **DummyJSON**: Backup quote service
- **OpenWeatherMap**: Weather data integration
- **Render**: Backend hosting platform
- **GitHub Pages**: Frontend hosting

## 📝 Usage

### Live Application

- **Frontend**: [https://ellewest.github.io/MinimalistNotesProject/](https://ellewest.github.io/MinimalistNotesProject/)
- **Backend API**: [https://minimalist-notes-backend.onrender.com](https://minimalist-notes-backend.onrender.com)

### How to Use

1. **Sign in** with Google account or create a manual account with email/password
2. **Create notes** with auto-save functionality (1-second delay)
3. **Manage todos** with real-time persistence
4. **Use timers** for task tracking with custom names
5. **Get inspired** with daily quotes (click refresh for new quotes)
6. **Check weather** for current weather conditions
7. **Sign out** to clear local data and secure your session

## 🧪 Test Cases

### 1. Authentication

**Google Sign-In**

- Click "Sign In" → "Google Sign-In"
- Complete Google OAuth
- **Expected:** User signed in with welcome message

**Manual Sign-In**

- Click "Sign In" → Enter email/password → "Sign In"
- **Expected:** New users auto-registered, existing users logged in

**Sign Out**

- Click user name in header → confirm sign out
- **Expected:** User signed out, data cleared

### 2. Notes Management

**Create & Edit Notes**

- Click "Notes" button → type content in new note
- Edit existing notes by clicking and typing
- **Expected:** Notes are created & can be deleted (up to 15 notes max)

**Delete Notes**

- Click "×" button on any note
- **Expected:** Note deleted immediately and removed from backend

### 3. Todo Management

**Add & Manage Todos**

- Click "To-Do List" heading → type item → press Enter
- Click checkbox to mark complete/incomplete (strikethrough effect)
- Click "×" button to delete todos
- **Expected:** Todos can be created, striked through and deleted (30 max)

### 4. Timer/Stopwatch Functionality

**Create & Control Timers**

- Click "Stopwatch" heading → enter timer name → press Enter
- Use ▶️ (start), ⏸️ (pause), 🔄 (reset), ⏹️ (delete) buttons
- Edit timer names by clicking on title
- **Expected:** Multiple independent timers can be started, paused, reset and deleted (up to 30)

### 5. Quote API Integration

**Quote Retrieval**

- Click "Quote" button in header
- **Expected:** "Loading quote..." appears, then displays inspirational quote with author

### 6. Weather API Integration

**Location Weather Lookup**

- Click in weather location input field → type city name (e.g., "London")
- **Expected:** Real-time weather data updates after 500ms delay (debounced input)

**Weather Data Display**

- Enter valid city name
- **Expected:** Shows location, country, temperature (°C), air quality index, wind speed, rain probability, humidity

### 7. Flip Box Functionality

**Date/Time Container Toggle**

- Click on the date/time display container in header
- **Expected:** Container flips/toggles to show different view (Day Left)

**Flip Animation**

- Click date/time container
- **Expected:** Smooth flip transition between normal and flipped states

### 8. Dark Mode Toggle

**Dark Mode Activation**

- Click the dark mode toggle button (moon/sun icon) in header
- **Expected:** Page switches to dark theme with dark background and light text

**Dark Mode Deactivation**

- Click dark mode toggle again while in dark mode
- **Expected:** Page returns to light theme with light background and dark text

**Theme Consistency**

- Toggle dark mode and check all elements
- **Expected:** All components (notes, todos, timers, weather, buttons) switch consistently between themes

### 9. Desktop Header Behavior

**Header Auto-Hide on Scroll**

- On desktop, scroll down the page
- **Expected:** Header disappears; scroll up to show header again

### 10. Data Persistence

**User Data Isolation**

- Sign in as different users
- **Expected:** Each user sees only their own data

## 🔒 Environment Configuration

The backend requires a MongoDB connection string. Make sure to:

- Set up a MongoDB Atlas cluster or local MongoDB instance
- Add your connection string to the `.env` file
- The `.env` file is excluded from version control for security

## 🔑 API Configuration

This project integrates with several external services:

**Free APIs (No Key Required):**

- OpenWeatherMap (public endpoints)
- DummyJSON (backup quote service)
- Google OAuth (using public client ID)

**APIs Requiring Keys:**

- **API Ninjas**: Primary quote service (requires free account at [api-ninjas.com](https://api-ninjas.com/))
  - 10,000 free requests per day
  - CORS-friendly for browser usage

**For Development:**

- Weather API: No authentication required for basic usage
- Quote APIs: Automatic fallback system ensures functionality even if APIs fail

## 📄 License

This project was created as part of a student assignment. ISC license is attached.

## 👩‍💻 Author

Built by [ElleWest](https://github.com/ElleWest) as part of IU's Web Development course.
