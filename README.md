# MinimalistNotesProject

A full-stack minimalist note-taking web application built for IU's "Project: Java and Web Development (DLBCSPJWD01)" course. This project allows users to keep track of notes and time tasks with a clean, distraction-free interface.

## 🏗️ Project Structure

```
MinimalistNotesProject/
├── backend/          # Node.js + MongoDB backend
│   ├── server.js     # Main server file
│   └── .env          # Environment variables (not tracked)
├── frontend/         # HTML, CSS, JavaScript frontend
│   ├── index.html    # Main HTML file
│   ├── script.js     # Frontend JavaScript
│   ├── styles.css    # Styling
│   └── package.json  # Frontend dependencies
└── README.md         # This file
```

## 🔗 Live Demo

[Click here to view the frontend demo](https://ellewest.github.io/MinimalistNotesProject/)

## ✨ Features

- **Note Management**: Add and delete notes with persistent storage
- **Task Management**: Add tasks with to-do list functionality
- **Time Tracking**: Built-in stopwatch for timing tasks
- **Dashboard**: View date, time, and day progress
- **Weather Integration**: Monitor daily weather conditions
- **Full-Stack Architecture**: Backend API with MongoDB database
- **Clean UI**: Minimalist, distraction-free design

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Backend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ElleWest/MinimalistNotesProject.git
   cd MinimalistNotesProject/backend
   ```

2. **Install dependencies:**

   ```bash
   npm install dotenv mongodb
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `backend/` directory:

   ```
   MONGO_URI=your_mongodb_connection_string_here
   ```

4. **Run the backend:**
   ```bash
   node server.js
   ```

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd ../frontend
   ```

2. **Install frontend dependencies:**

   ```bash
   npm install
   ```

3. **Open in browser:**
   - Open `index.html` in your web browser
   - Or serve with a local development server

## 🛠️ Technology Stack

**Backend:**

- Node.js
- MongoDB (with MongoDB Atlas)
- dotenv for environment management

**Frontend:**

- HTML5
- CSS3
- Vanilla JavaScript
- Weather API integration

## 📝 Usage

1. **Start the backend server** to enable data persistence
2. **Open the frontend** in your browser
3. **Add notes** using the note interface
4. **Create tasks** and use the stopwatch for time tracking
5. **Monitor weather** and daily progress

## 🔒 Environment Configuration

The backend requires a MongoDB connection string. Make sure to:

- Set up a MongoDB Atlas cluster or local MongoDB instance
- Add your connection string to the `.env` file
- The `.env` file is excluded from version control for security

## ⚠️ API Key Note

This project uses a public, free weather API that does not require payment or authentication.

## 📄 License

This project was created as part of a student assignment. No license is attached.

## 👩‍💻 Author

Built by [ElleWest](https://github.com/ElleWest) as part of IU's Web Development course.
