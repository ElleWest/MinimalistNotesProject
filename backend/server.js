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
      "GET /api/todos - Get all todos",
      "POST /api/todos - Create a todo",
      "PUT /api/todos/:id - Update a todo",
      "DELETE /api/todos/:id - Delete a todo",
      "GET /api/timers - Get all timers",
      "POST /api/timers - Create a timer",
      "PUT /api/timers/:id - Update a timer",
      "DELETE /api/timers/:id - Delete a timer",
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
    const { userId } = req.query;

    // For now, if no userId provided, return all notes (for backward compatibility)
    const query = userId ? { userId } : {};
    const notes = await db.collection("notes").find(query).toArray();
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const note = {
      title: title || "Note",
      content,
      userId: userId || null, // Associate note with user
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

// API Routes for Todos
app.get("/api/todos", async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const todos = await db.collection("todos").find(query).toArray();
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

app.post("/api/todos", async (req, res) => {
  try {
    const { text, completed, userId } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const todo = {
      text,
      completed: completed || false,
      userId: userId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("todos").insertOne(todo);
    res.status(201).json({ ...todo, _id: result.insertedId });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

app.put("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid todo ID" });
    }

    const updateData = {
      ...(text !== undefined && { text }),
      ...(completed !== undefined && { completed }),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("todos")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo updated successfully" });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid todo ID" });
    }

    const result = await db
      .collection("todos")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// API Routes for Timers
app.get("/api/timers", async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const timers = await db.collection("timers").find(query).toArray();
    res.json(timers);
  } catch (error) {
    console.error("Error fetching timers:", error);
    res.status(500).json({ error: "Failed to fetch timers" });
  }
});

app.post("/api/timers", async (req, res) => {
  try {
    const { title, elapsedTime, userId } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const timer = {
      title,
      elapsedTime: elapsedTime || 0,
      isRunning: false, // Always save as stopped
      userId: userId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("timers").insertOne(timer);
    res.status(201).json({ ...timer, _id: result.insertedId });
  } catch (error) {
    console.error("Error creating timer:", error);
    res.status(500).json({ error: "Failed to create timer" });
  }
});

app.put("/api/timers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, elapsedTime } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid timer ID" });
    }

    const updateData = {
      ...(title !== undefined && { title }),
      ...(elapsedTime !== undefined && { elapsedTime }),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("timers")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Timer not found" });
    }

    res.json({ message: "Timer updated successfully" });
  } catch (error) {
    console.error("Error updating timer:", error);
    res.status(500).json({ error: "Failed to update timer" });
  }
});

app.delete("/api/timers/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid timer ID" });
    }

    const result = await db
      .collection("timers")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Timer not found" });
    }

    res.json({ message: "Timer deleted successfully" });
  } catch (error) {
    console.error("Error deleting timer:", error);
    res.status(500).json({ error: "Failed to delete timer" });
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
