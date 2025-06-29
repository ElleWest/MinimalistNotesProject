# MinimalistNotesProject

A full-stack minimalist note-taking web application built for IU's "Project: Java and Web Development (DLBCSPJWD01)" course. This project allows users to keep track of notes and time tasks with a clean, distraction-free interface.

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

- **📝 Note Management**: Create, edit, and delete notes with real-time auto-save
- **✅ Todo Management**: Add, complete, and delete todos with persistent storage
- **⏱️ Timer System**: Multiple named timers with start/pause/reset functionality
- **🔐 Google Authentication**: Secure user login with personalized data isolation
- **💬 Daily Quotes**: Inspirational quotes with religious content filtering
- **🌤️ Weather Integration**: Real-time weather updates for your location
- **📊 Dashboard**: Live date, time, and day progress tracking
- **☁️ Cloud Storage**: All data persisted to MongoDB with user-specific access
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🚀 Full-Stack Architecture**: Node.js/Express backend with REST API
- **🎨 Clean UI**: Minimalist, distraction-free design with NES style

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

1. **Sign in** with your Google account for personalized data
2. **Create notes** with auto-save functionality (1-second delay)
3. **Manage todos** with real-time persistence
4. **Use timers** for task tracking with custom names
5. **Get inspired** with daily quotes (click refresh for new quotes)
6. **Check weather** for current conditions
7. **Sign out** to clear local data and secure your session

## 🧪 Test Cases

### 1. Google Authentication

**Test Case 1: User can sign in with Google account**

- Navigate to the application homepage
- Click the "Sign in with Google" button
- Complete Google OAuth authentication
- **Expected:** User is signed in, welcome message displays user's name, and user data loads

**Test Case 2: User can sign out**

- Ensure you are signed in
- Click the "Sign Out" button
- **Expected:** User is signed out, data is cleared from interface, and sign-in button reappears

**Test Case 3: Authentication persists across sessions**

- Sign in with Google account
- Close the browser tab/window
- Reopen the application
- **Expected:** User remains signed in and their data is displayed

### 2. Notes Management

**Test Case 1: User can create a new note**

- Sign in to the application
- Type text in the notes textarea
- Wait 1 second for auto-save
- **Expected:** Note content is saved and persists after page refresh

**Test Case 2: User can edit existing notes**

- Create a note with some text
- Modify the text content
- Wait 1 second for auto-save
- **Expected:** Changes are saved automatically and persist after page refresh

**Test Case 3: Notes are user-specific**

- Sign in with one Google account and create notes
- Sign out and sign in with a different Google account
- **Expected:** Previous user's notes are not visible; each user sees only their own notes

### 3. Todo Management

**Test Case 1: User can add a new todo**

- Sign in to the application
- Click the "+" button in the todos section
- Enter "Test todo item" and press Enter
- **Expected:** New todo appears in the list with a checkbox

**Test Case 2: User can complete a todo**

- Add a todo item
- Click the checkbox next to the todo
- **Expected:** Todo is marked as completed (strikethrough text)

**Test Case 3: User can delete a todo**

- Add a todo item
- Click the "×" button next to the todo
- **Expected:** Todo is removed from the list

**Test Case 4: Todos persist across sessions**

- Add several todos and mark some as complete
- Sign out and sign back in
- **Expected:** All todos remain with their completion status preserved

### 4. Timer Functionality

**Test Case 1: User can start a timer**

- Sign in to the application
- Click the "+" button in timers section
- Enter "Work Session" as timer name and press Enter
- Click the "Start" button on the timer
- **Expected:** Timer starts counting up from 00:00:00

**Test Case 2: User can pause and resume a timer**

- Start a timer
- Click the "Pause" button
- Wait a few seconds
- Click "Resume" button
- **Expected:** Timer pauses and resumes correctly, maintaining elapsed time

**Test Case 3: User can reset a timer**

- Start a timer and let it run for a few seconds
- Click the "Reset" button
- **Expected:** Timer resets to 00:00:00

**Test Case 4: User can rename a timer**

- Create a timer with any name
- Click on the timer title
- Change the name to "New Timer Name" and press Enter
- **Expected:** Timer name is updated and persists after page refresh

**Test Case 5: User can delete a timer**

- Create a timer
- Click the "×" button next to the timer
- **Expected:** Timer is removed from the list

### 5. Quote Functionality

**Test Case 1: Application displays daily quotes**

- Navigate to the application
- **Expected:** A quote with author attribution is displayed

**Test Case 2: User can refresh quotes**

- Click the refresh button next to the quote
- **Expected:** A new quote appears (may take a moment to load)

**Test Case 3: Religious content filtering works**

- Refresh quotes multiple times
- **Expected:** No religious or explicitly spiritual quotes are displayed

**Test Case 4: Fallback system works when APIs fail**

- Check browser console for any API errors
- **Expected:** Even if external APIs fail, local fallback quotes are displayed

### 6. Weather Integration

**Test Case 1: Weather information displays**

- Navigate to the application
- **Expected:** Current weather information is displayed (temperature, description, location)

**Test Case 2: Weather updates periodically**

- Leave the application open for several minutes
- **Expected:** Weather information updates automatically

### 7. Data Persistence

**Test Case 1: All data persists after browser refresh**

- Sign in and create notes, todos, and timers
- Refresh the browser page
- **Expected:** All user data remains exactly as it was before refresh

**Test Case 2: Data is isolated between users**

- Sign in with User A, create some content
- Sign out and sign in with User B
- **Expected:** User B sees no content from User A; each user's data is completely separate

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

- **API Ninjas**: Primary quote service (requires free account at [api.api-ninjas.com](https://api.api-ninjas.com))
  - 10,000 free requests per day
  - CORS-friendly for browser usage

**For Development:**

- Weather API: No authentication required for basic usage
- Quote APIs: Automatic fallback system ensures functionality even if APIs fail
- Religious content filtering applied to all quote sources

## 📄 License

This project was created as part of a student assignment. No license is attached.

## 👩‍💻 Author

Built by [ElleWest](https://github.com/ElleWest) as part of IU's Web Development course.
