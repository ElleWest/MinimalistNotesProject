require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

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
const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

let db;

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoClient.connect();
    db = mongoClient.db("minimalist-notes");
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
      "POST /auth/signin - Sign in (auto-registers new users)",
      "POST /auth/verify - Verify JWT token for session persistence",
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

// JWT secret key (in production, use environment variable)
const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

// Generate JWT token
function generateToken(userId, username) {
  return jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: "30d" });
}

// Authentication middleware (optional - for protected routes)
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

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

// Authentication Routes
app.post("/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const emailLower = email.toLowerCase();

    // Check for existing user with any auth method
    let existingUser = await db.collection("users").findOne({
      email: emailLower,
    });

    if (existingUser) {
      // User exists - check auth method
      if (
        existingUser.authMethods &&
        existingUser.authMethods.includes("google")
      ) {
        // Email is registered with Google
        return res.status(409).json({
          success: false,
          message:
            "Email registered with Google Sign-In. Use Google Sign-In instead.",
          isGoogleAccount: true,
        });
      } else if (
        existingUser.authMethods &&
        existingUser.authMethods.includes("manual")
      ) {
        // Email is registered with manual auth - verify password
        const isValidPassword = await bcrypt.compare(
          password,
          existingUser.password
        );

        if (!isValidPassword) {
          return res.status(401).json({
            success: false,
            message: "Invalid email or password",
          });
        }

        // Valid manual login
        await db
          .collection("users")
          .updateOne(
            { _id: existingUser._id },
            { $set: { lastLogin: new Date() } }
          );

        const token = generateToken(
          existingUser._id.toString(),
          existingUser.name
        );

        console.log(
          `✅ Existing manual user signed in: ${
            existingUser.displayEmail || existingUser.email
          }`
        );

        return res.json({
          success: true,
          message: "Sign-in successful",
          isNewUser: false,
          token,
          user: {
            id: existingUser._id,
            email: existingUser.displayEmail || existingUser.email,
            name: existingUser.name,
          },
        });
      }
    }

    // No existing user - create new manual account
    console.log(`🆕 Creating new manual account for: ${email}`);

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      email: emailLower,
      displayEmail: email, // Keep original case for display
      name: email.split("@")[0], // Use part before @ as display name
      password: hashedPassword,
      authMethods: ["manual"], // Track auth methods used
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);
    const user = { ...newUser, _id: result.insertedId };

    console.log(`✅ New manual user created: ${email}`);

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.name);

    res.json({
      success: true,
      message: "Account created and signed in successfully",
      isNewUser: true,
      token,
      user: {
        id: user._id,
        email: user.displayEmail || user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("❌ Signin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during sign-in",
    });
  }
});

// JWT Token Verification endpoint for session persistence
app.post("/auth/verify", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database to ensure they still exist
    const user = await db.collection("users").findOne({
      _id: new ObjectId(decoded.userId),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Return user info for session restoration
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.displayEmail || user.email,
        name: user.name,
      },
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    } else {
      console.error("❌ Token verification error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error during verification",
      });
    }
  }
});

app.post("/auth/google", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "ID token is required",
      });
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Could not retrieve email from Google account",
      });
    }

    const emailLower = email.toLowerCase();

    // Check for existing user with any auth method
    let existingUser = await db.collection("users").findOne({
      email: emailLower,
    });

    if (existingUser) {
      // User exists - check auth method
      if (
        existingUser.authMethods &&
        existingUser.authMethods.includes("manual")
      ) {
        // Email is registered with manual auth
        return res.status(409).json({
          success: false,
          message:
            "Email already registered with manual sign-in. Use email/password instead.",
          isManualAccount: true,
        });
      } else if (
        existingUser.authMethods &&
        existingUser.authMethods.includes("google")
      ) {
        // Existing Google user - sign them in
        await db.collection("users").updateOne(
          { _id: existingUser._id },
          {
            $set: {
              lastLogin: new Date(),
              picture: picture, // Update picture in case it changed
            },
          }
        );

        console.log(`✅ Existing Google user signed in: ${existingUser.email}`);

        return res.json({
          success: true,
          message: "Google sign-in successful",
          isNewUser: false,
          user: {
            id: existingUser._id,
            email: existingUser.email,
            name: existingUser.name,
            picture: picture,
            googleId: existingUser.googleId,
          },
        });
      }
    }

    // No existing user - create new Google account
    console.log(`🆕 Creating new Google account for: ${email}`);

    const newUser = {
      email: emailLower,
      name: name,
      picture: picture,
      googleId: googleId,
      authMethods: ["google"], // Track auth methods used
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);
    const user = { ...newUser, _id: result.insertedId };

    console.log(`✅ New Google user created: ${email}`);

    res.json({
      success: true,
      message: "Google account created and signed in successfully",
      isNewUser: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        googleId: user.googleId,
      },
    });
  } catch (error) {
    console.error("❌ Google auth error:", error);
    res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
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
  if (mongoClient) {
    await mongoClient.close();
  }
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
