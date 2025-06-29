require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      "https://ellewest.github.io",
      "http://localhost:3000",
      "http://127.0.0.1:5500",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Create MongoDB client
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    db = client.db("minimalist-notes");
    console.log("✅ Successfully connected to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "MinimalistNotes API is running!",
    version: "1.0.0",
    endpoints: [
      "GET /health - Health check",
      "GET /api/notes - Get all notes",
      "POST /api/notes - Create a note",
      "PUT /api/notes/:id - Update a note",
      "DELETE /api/notes/:id - Delete a note",
    ],
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: db ? "connected" : "disconnected",
  });
});

// API Routes for Notes
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await db.collection("notes").find({}).toArray();
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const note = {
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("notes").insertOne(note);
    res.status(201).json({ ...note, _id: result.insertedId });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
});

app.put("/api/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }

    const updateData = {
      ...(title && { title }),
      ...(content && { content }),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("notes")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note updated successfully" });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }

    const result = await db
      .collection("notes")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

// API Routes for Tasks (future expansion)
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await db.collection("tasks").find({}).toArray();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  if (client) {
    await client.close();
  }
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
