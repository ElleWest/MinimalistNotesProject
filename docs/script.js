// Google Authentication Functions
let currentUser = null;

// Backend API Configuration
const API_BASE_URL = "https://minimalist-notes-backend.onrender.com";

// API Functions for Backend Integration
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

// Load user's notes from backend
async function loadUserNotes() {
  if (!currentUser) {
    console.log("❌ No user logged in, skipping notes load");
    return;
  }

  console.log("📝 Loading notes for user:", currentUser.id);

  try {
    const url = `/api/notes?userId=${currentUser.id}`;
    console.log("🌐 Fetching notes from:", API_BASE_URL + url);

    const notes = await apiRequest(url);
    console.log("📦 Received notes:", notes);

    // Clear existing notes in UI
    const notesContainer = document.getElementById("notesContainer");
    notesContainer.innerHTML = "";

    // Display notes from backend
    notes.forEach((noteData, index) => {
      console.log(`📝 Creating note ${index + 1}:`, noteData);
      createNoteElement(noteData.title, noteData.content, noteData._id);
    });

    console.log(`✅ Notes loaded successfully: ${notes.length} notes`);
  } catch (error) {
    console.error("❌ Failed to load notes:", error);
  }
}

// Save note to backend
async function saveNoteToBackend(title, content, noteId = null) {
  if (!currentUser) {
    console.log("❌ No user logged in, cannot save note");
    return null;
  }

  console.log("💾 Saving note:", {
    title,
    content: content.substring(0, 50) + "...",
    noteId,
    userId: currentUser.id,
  });

  try {
    if (noteId) {
      // Update existing note
      console.log("🔄 Updating existing note:", noteId);
      await apiRequest(`/api/notes/${noteId}`, {
        method: "PUT",
        body: JSON.stringify({ title, content }),
      });
      console.log("✅ Note updated successfully");
      return noteId;
    } else {
      // Create new note
      console.log("➕ Creating new note");
      const response = await apiRequest("/api/notes", {
        method: "POST",
        body: JSON.stringify({
          title,
          content,
          userId: currentUser.id,
        }),
      });
      console.log("✅ Note created successfully:", response._id);
      return response._id;
    }
  } catch (error) {
    console.error("❌ Failed to save note:", error);
    return null;
  }
}

// Delete note from backend
async function deleteNoteFromBackend(noteId) {
  if (!currentUser || !noteId) return;

  try {
    await apiRequest(`/api/notes/${noteId}`, {
      method: "DELETE",
    });
    console.log("Note deleted successfully");
  } catch (error) {
    console.error("Failed to delete note:", error);
  }
}

// Todo API Functions
async function loadUserTodos() {
  if (!currentUser) {
    console.log("❌ No user logged in, skipping todos load");
    return;
  }

  console.log("✅ Loading todos for user:", currentUser.id);

  try {
    const url = `/api/todos?userId=${currentUser.id}`;
    console.log("🌐 Fetching todos from:", API_BASE_URL + url);

    const todos = await apiRequest(url);
    console.log("📦 Received todos:", todos);

    // Clear existing todos in UI
    const todoListContainer = document.querySelector(".todo-list-container");
    todoListContainer.innerHTML = "";

    // Display todos from backend
    todos.forEach((todoData, index) => {
      console.log(`✅ Creating todo ${index + 1}:`, todoData);
      createTodoElement(todoData.text, todoData.completed, todoData._id);
    });

    console.log(`✅ Todos loaded successfully: ${todos.length} todos`);
  } catch (error) {
    console.error("❌ Failed to load todos:", error);
  }
}

async function saveTodoToBackend(text, completed = false, todoId = null) {
  if (!currentUser) return null;

  try {
    if (todoId) {
      // Update existing todo
      await apiRequest(`/api/todos/${todoId}`, {
        method: "PUT",
        body: JSON.stringify({ text, completed }),
      });
      return todoId;
    } else {
      // Create new todo
      const response = await apiRequest("/api/todos", {
        method: "POST",
        body: JSON.stringify({
          text,
          completed,
          userId: currentUser.id,
        }),
      });
      return response._id;
    }
  } catch (error) {
    console.error("Failed to save todo:", error);
    return null;
  }
}

async function deleteTodoFromBackend(todoId) {
  if (!currentUser || !todoId) return;

  try {
    await apiRequest(`/api/todos/${todoId}`, {
      method: "DELETE",
    });
    console.log("Todo deleted successfully");
  } catch (error) {
    console.error("Failed to delete todo:", error);
  }
}

// Timer API Functions
async function loadUserTimers() {
  if (!currentUser) {
    console.log("❌ No user logged in, skipping timers load");
    return;
  }

  console.log("⏱️ Loading timers for user:", currentUser.id);

  try {
    const url = `/api/timers?userId=${currentUser.id}`;
    console.log("🌐 Fetching timers from:", API_BASE_URL + url);

    const timers = await apiRequest(url);
    console.log("📦 Received timers:", timers);

    // Clear existing timers in UI
    const timerContainer = document.querySelector(".timer-container");
    timerContainer.innerHTML = "";

    // Display timers from backend
    timers.forEach((timerData, index) => {
      console.log(`⏱️ Creating timer ${index + 1}:`, timerData);
      createTimerElement(timerData.title, timerData.elapsedTime, timerData._id);
    });

    console.log(`✅ Timers loaded successfully: ${timers.length} timers`);
  } catch (error) {
    console.error("❌ Failed to load timers:", error);
  }
}

console.log("✅ Load functions defined");

async function saveTimerToBackend(title, elapsedTime, timerId = null) {
  if (!currentUser) return null;

  try {
    if (timerId) {
      // Update existing timer
      await apiRequest(`/api/timers/${timerId}`, {
        method: "PUT",
        body: JSON.stringify({ title, elapsedTime }),
      });
      return timerId;
    } else {
      // Create new timer
      const response = await apiRequest("/api/timers", {
        method: "POST",
        body: JSON.stringify({
          title,
          elapsedTime,
          userId: currentUser.id,
        }),
      });
      return response._id;
    }
  } catch (error) {
    console.error("Failed to save timer:", error);
    return null;
  }
}

// Delete timer from backend
async function deleteTimerFromBackend(timerId) {
  if (!currentUser || !timerId) return;

  try {
    await apiRequest(`/api/timers/${timerId}`, {
      method: "DELETE",
    });
    console.log("Timer deleted successfully");
  } catch (error) {
    console.error("Failed to delete timer:", error);
  }
}

// Global helper functions for creating UI elements
// Placeholder texts for notes
const placeholderTexts = [
  "Nota Bene",
  "Memento Scribere",
  "Scriptum Est",
  "Cogita et Crea",
  "Verba Volant",
  "Carpe Verbum",
  "Lumen Mentis",
  "Vox Silens",
  "Capere Vacuum",
  "Inscribe Mens",
  "Congela Fluxum",
  "Pensara Ignis",
  "Echo Scribit",
  "Sequere Pulsus",
  "Semper Scribe",
];

// Helper function to create note elements (used for both new notes and loaded notes)
function createNoteElement(title = "", content = "", noteId = null) {
  const notesContainer = document.getElementById("notesContainer");

  // Create note wrapper
  const noteWrapper = document.createElement("div");
  noteWrapper.className = "note-wrapper";
  noteWrapper.dataset.noteId = noteId; // Store backend ID

  // Create new note
  const note = document.createElement("textarea");
  note.className = "note";
  note.value = content;

  // Get the current number of notes (before adding the new one)
  const currentNoteCount = notesContainer.children.length;
  // Set the placeholder text based on the position
  note.placeholder = placeholderTexts[currentNoteCount] || "Note";

  // Auto-save functionality
  let saveTimeout;
  note.addEventListener("input", () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      if (currentUser && note.value.trim()) {
        const savedNoteId = await saveNoteToBackend("Note", note.value, noteId);
        if (savedNoteId && !noteId) {
          // Update the wrapper with the new ID for future updates
          noteWrapper.dataset.noteId = savedNoteId;
          noteId = savedNoteId;
        }
      }
    }, 1000); // Save after 1 second of no typing
  });

  // Create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "✖";
  deleteBtn.addEventListener("click", async () => {
    if (noteId) {
      await deleteNoteFromBackend(noteId);
    }
    noteWrapper.remove();
  });

  // Append elements to wrapper
  noteWrapper.appendChild(note);
  noteWrapper.appendChild(deleteBtn);

  // Add the new note at the beginning of the container
  notesContainer.insertBefore(noteWrapper, notesContainer.firstChild);

  return { noteWrapper, note };
}

console.log("✅ createNoteElement function defined");

// Helper function to create todo elements
function createTodoElement(text = "", completed = false, todoId = null) {
  const todoListContainer = document.querySelector(".todo-list-container");

  const todoItem = document.createElement("div");
  todoItem.className = "todo-item";
  todoItem.dataset.todoId = todoId; // Store backend ID

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;

  const textSpan = document.createElement("span");
  textSpan.contentEditable = true;
  textSpan.textContent = text;
  textSpan.style.color = text
    ? document.body.classList.contains("dark-mode")
      ? "#ffffff"
      : "#000000"
    : "#808080";
  textSpan.style.textDecoration = completed ? "line-through" : "none";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✖";

  // Auto-save functionality for todos
  let todoSaveTimeout;
  const saveTodo = async () => {
    if (currentUser && textSpan.textContent.trim()) {
      const savedTodoId = await saveTodoToBackend(
        textSpan.textContent.trim(),
        checkbox.checked,
        todoId
      );
      if (savedTodoId && !todoId) {
        todoItem.dataset.todoId = savedTodoId;
        todoId = savedTodoId;
      }
    }
  };

  checkbox.addEventListener("change", () => {
    textSpan.style.textDecoration = checkbox.checked ? "line-through" : "none";
    clearTimeout(todoSaveTimeout);
    todoSaveTimeout = setTimeout(saveTodo, 500);
  });

  textSpan.addEventListener("input", () => {
    textSpan.style.color = document.body.classList.contains("dark-mode")
      ? "#ffffff"
      : "#000000";
    clearTimeout(todoSaveTimeout);
    todoSaveTimeout = setTimeout(saveTodo, 1000);
  });

  textSpan.addEventListener("blur", () => {
    if (textSpan.textContent.trim() === "") {
      textSpan.textContent = "";
      textSpan.style.color = "#808080";
    }
  });

  deleteBtn.onclick = async () => {
    if (todoId) {
      await deleteTodoFromBackend(todoId);
    }
    todoItem.remove();
  };

  // Append elements to todoItem in correct order
  todoItem.appendChild(checkbox);
  todoItem.appendChild(textSpan);
  todoItem.appendChild(deleteBtn);

  todoListContainer.appendChild(todoItem);

  if (!text) {
    textSpan.focus();
  }

  return { todoItem, textSpan };
}

console.log("✅ createTodoElement function defined");

// Helper function to create timer elements
function createTimerElement(title = "", elapsedTime = 0, timerId = null) {
  const timerContainer = document.querySelector(".timer-container");

  const timerBox = document.createElement("div");
  timerBox.className = "timer-box";
  timerBox.dataset.timerId = timerId; // Store backend ID

  const timerTitle = document.createElement("input");
  timerTitle.className = "timer-title";
  timerTitle.type = "text";
  timerTitle.placeholder = "Task Title";
  timerTitle.value = title;
  timerTitle.style.color = title
    ? document.body.classList.contains("dark-mode")
      ? "#ffffff"
      : "#000000"
    : "#808080";

  const timerDisplay = document.createElement("div");
  timerDisplay.className = "timer-display";

  const timerControls = document.createElement("div");
  timerControls.className = "timer-controls";

  const startBtn = document.createElement("button");
  startBtn.textContent = "▶️";

  const pauseBtn = document.createElement("button");
  pauseBtn.textContent = "⏸️";
  pauseBtn.style.display = "none";

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "🔄";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "⏹️";

  timerControls.appendChild(startBtn);
  timerControls.appendChild(pauseBtn);
  timerControls.appendChild(resetBtn);
  timerControls.appendChild(deleteBtn);

  timerBox.appendChild(timerTitle);
  timerBox.appendChild(timerDisplay);
  timerBox.appendChild(timerControls);

  timerContainer.appendChild(timerBox);

  // Independent timer state
  timerBox._interval = null;
  timerBox._startTime = null;
  timerBox._elapsedTime = elapsedTime;

  // Auto-save functionality for timers
  let timerSaveTimeout;
  const saveTimer = async () => {
    if (currentUser && timerTitle.value.trim()) {
      const savedTimerId = await saveTimerToBackend(
        timerTitle.value.trim(),
        timerBox._elapsedTime,
        timerId
      );
      if (savedTimerId && !timerId) {
        timerBox.dataset.timerId = savedTimerId;
        timerId = savedTimerId;
      }
    }
  };

  timerTitle.addEventListener("input", () => {
    timerTitle.style.color = document.body.classList.contains("dark-mode")
      ? "#ffffff"
      : "#000000";
    clearTimeout(timerSaveTimeout);
    timerSaveTimeout = setTimeout(saveTimer, 1000);
  });

  function updateDisplay() {
    const totalSeconds = Math.floor(timerBox._elapsedTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    timerDisplay.textContent = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  function startTimer() {
    if (timerBox._interval) return; // Already running

    timerBox._startTime = Date.now() - timerBox._elapsedTime;
    timerBox._interval = setInterval(() => {
      timerBox._elapsedTime = Date.now() - timerBox._startTime;
      updateDisplay();
    }, 1000);

    startBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
  }

  function pauseTimer() {
    if (timerBox._interval) {
      clearInterval(timerBox._interval);
      timerBox._interval = null;
      saveTimer(); // Save when paused
    }

    startBtn.style.display = "inline-block";
    pauseBtn.style.display = "none";
  }

  function resetTimer() {
    if (timerBox._interval) {
      clearInterval(timerBox._interval);
      timerBox._interval = null;
    }

    timerBox._elapsedTime = 0;
    timerBox._startTime = null;
    updateDisplay();
    saveTimer(); // Save when reset

    startBtn.style.display = "inline-block";
    pauseBtn.style.display = "none";
  }

  // Event listeners
  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);
  deleteBtn.addEventListener("click", async () => {
    if (timerBox._interval) {
      clearInterval(timerBox._interval);
    }
    if (timerId) {
      await deleteTimerFromBackend(timerId);
    }
    timerBox.remove();
  });

  // Initialize display
  updateDisplay();

  if (!title) {
    timerTitle.focus();
  }

  return { timerBox, timerTitle };
}

console.log("✅ createTimerElement function defined");
console.log("✅ ALL UI HELPER FUNCTIONS LOADED!");

// This function handles the response from Google
async function handleCredentialResponse(response) {
  console.log("🔐 Google sign-in response received");
  showGreyNotification("Verifying Google account...");

  try {
    // Send Google token to backend for verification
    const apiResponse = await apiRequest("/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken: response.credential }),
    });

    if (apiResponse.success) {
      // Store Google token for session persistence
      localStorage.setItem("googleToken", response.credential);
      localStorage.setItem("authType", "google");
      console.log("🔐 Google token stored for session persistence");

      currentUser = {
        id: apiResponse.user.id,
        name: apiResponse.user.name,
        email: apiResponse.user.email,
        picture: apiResponse.user.picture,
        googleId: apiResponse.user.googleId,
      };

      console.log("👤 User signed in:", currentUser);
      closeSignInModal();
      updateSignInUI();

      // Load user data
      loadUserNotes();
      loadUserTodos();
      loadUserTimers();

      const welcomeMessage = apiResponse.isNewUser
        ? `Welcome ${currentUser.name}! Google account created successfully.`
        : `Welcome back, ${currentUser.name}!`;

      showNotification(welcomeMessage, "success");
    } else {
      // Check for specific error types and show appropriate notifications
      if (apiResponse.isManualAccount) {
        // Email is registered with manual auth
        showErrorNotification(
          "Email already registered with manual sign-in. Use email/password instead."
        );
      } else {
        // Other errors
        showNotification(
          apiResponse.message || "Google sign-in failed",
          "error"
        );
      }
    }
  } catch (error) {
    console.error("❌ Google authentication failed:", error);
    showNotification("Google sign-in failed. Please try again.", "error");
  }
}

// Helper function to decode JWT token
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

// Update UI when user signs in/out
function updateSignInUI() {
  const signInDiv = document.getElementById("signinBtn");

  // Clear any existing content and event listeners
  signInDiv.innerHTML = "";
  signInDiv.onclick = null;
  signInDiv.style.cssText = ""; // Reset any inline styles

  if (currentUser) {
    // User is signed in - show their name only, click to sign out
    signInDiv.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.65rem; width: 100%; height: 100%;">
        <img src="${
          currentUser.picture
        }" alt="Profile" style="width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;">
        <span style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-shrink: 1;">${
          currentUser.name.split(" ")[0]
        }</span>
      </div>
    `;

    // Make the entire button clickable to sign out
    signInDiv.onclick = () => {
      if (confirm(`Sign out ${currentUser.name.split(" ")[0]}?`)) {
        signOut();
      }
    };

    // Add hover effect to indicate it's clickable
    signInDiv.style.cursor = "pointer";
    signInDiv.title = "Click to sign out";
  } else {
    // User is signed out - show Google sign in button
    signInDiv.innerHTML = "Sign In";
    signInDiv.onclick = handleSignInClick;
    signInDiv.style.cursor = "pointer";
    signInDiv.title = "Sign in with Google";
  }
}

// Robust sign-in handler - now shows popup menu
async function handleSignInClick() {
  console.log("🔐 Sign-in button clicked");
  showSignInModal();
}

// Show sign-in modal with multiple options
function showSignInModal() {
  // Remove any existing modal
  const existingModal = document.querySelector(".signin-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal backdrop with blur
  const modalBackdrop = document.createElement("div");
  modalBackdrop.className = "signin-modal";
  modalBackdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    font-family: "Press Start 2P", monospace;
  `;

  // Create modal content
  const modalContent = document.createElement("div");
  modalContent.style.cssText = `
    background: white;
    color: #000000;
    border: 3px solid #000000;
    border-radius: 8px;
    padding: 2rem;
    max-width: 400px;
    width: 90vw;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 8px 8px 0 #000000;
    position: relative;
  `;

  modalContent.innerHTML = `
    <div class="signin-header" style="text-align: center; margin-bottom: 1.5rem; position: relative;">
      <button class="close-modal" style="
        position: absolute;
        top: -0.5rem;
        right: -0.5rem;
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: #000000;
        font-family: 'Press Start 2P', monospace;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">✕</button>
      <h2 style="margin: 0; font-size: 1rem; color: #000000;">Sign In</h2>
    </div>

    <div class="signin-options">
      <!-- Google Sign-In Option -->
      <div class="signin-option" style="margin-bottom: 1.5rem;">
        <button id="googleSignInBtn" style="
          width: 100%;
          padding: 1rem;
          background: #4285f4;
          color: white;
          border: 2px solid #4285f4;
          border-radius: 4px;
          font-family: 'Press Start 2P', monospace;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
        ">🔍 Google Sign-In</button>
      </div>

      <div style="text-align: center; margin: 1rem 0; font-size: 0.6rem; color: #000000;">
        - OR -
      </div>

      <!-- Manual Sign-In Option -->
      <div class="signin-option">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-size: 0.6rem; color: #000000;">Email:</label>
          <input type="email" id="manualEmail" style="
            width: 100%;
            padding: 0.8rem;
            border: 2px solid #000000;
            border-radius: 4px;
            background: white;
            color: #000000;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.6rem;
            box-sizing: border-box;
          " placeholder="Enter your email">
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-size: 0.6rem; color: #000000;">Password:</label>
          <input type="password" id="manualPassword" style="
            width: 100%;
            padding: 0.8rem;
            border: 2px solid #000000;
            border-radius: 4px;
            background: white;
            color: #000000;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.6rem;
            box-sizing: border-box;
          " placeholder="Enter password">
        </div>

        <div style="display: flex; justify-content: center;">
          <button id="manualSignInBtn" style="
            width: 100%;
            max-width: 250px;
            padding: 1rem;
            background: #4CAF50;
            color: white;
            border: 2px solid #4CAF50;
            border-radius: 4px;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.7rem;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
          ">Sign In</button>
        </div>
        
        <div style="text-align: center; margin-top: 1rem; font-size: 0.5rem; color: #666;">
          New users will be automatically registered
        </div>
      </div>
    </div>
  `;

  modalBackdrop.appendChild(modalContent);
  document.body.appendChild(modalBackdrop);

  // Add event listeners
  setupModalEventListeners(modalBackdrop);
}

// Setup event listeners for the modal
function setupModalEventListeners(modal) {
  // Close modal on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeSignInModal();
    }
  });

  // Close button
  const closeBtn = modal.querySelector(".close-modal");
  closeBtn.addEventListener("click", closeSignInModal);

  // Google sign-in button
  const googleBtn = modal.querySelector("#googleSignInBtn");
  googleBtn.addEventListener("click", () => {
    closeSignInModal();
    handleGoogleSignIn();
  });

  // Manual sign-in button
  const manualSignInBtn = modal.querySelector("#manualSignInBtn");
  manualSignInBtn.addEventListener("click", handleManualSignIn);

  // Enter key support
  const emailInput = modal.querySelector("#manualEmail");
  const passwordInput = modal.querySelector("#manualPassword");

  [emailInput, passwordInput].forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleManualSignIn();
      }
    });
  });

  // Hover effects for buttons
  const buttons = modal.querySelectorAll('button[style*="box-shadow"]');
  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translate(-2px, -2px)";
      btn.style.boxShadow = "6px 6px 0 rgba(0,0,0,0.3)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
      btn.style.boxShadow = "4px 4px 0 rgba(0,0,0,0.2)";
    });
  });
}

// Close sign-in modal
function closeSignInModal() {
  const modal = document.querySelector(".signin-modal");
  if (modal) {
    modal.remove();
  }
}

// Handle Google sign-in (original logic)
async function handleGoogleSignIn() {
  console.log("🔐 Google sign-in selected");
  console.log("📱 User agent:", navigator.userAgent);
  console.log("📺 Screen size:", window.innerWidth + "x" + window.innerHeight);

  if (!window.google) {
    console.error("❌ Google Auth library not loaded");
    showGreyNotification("Loading auth... Using redirect method");
    setTimeout(() => tryRedirectSignIn(), 1000);
    return;
  }

  // Skip One Tap and Popup on mobile - go straight to redirect
  if (window.innerWidth <= 768) {
    console.log("📱 Mobile detected - using redirect method directly");
    showGreyNotification("Mobile sign-in: Redirecting to Google...");
    setTimeout(() => tryRedirectSignIn(), 1500);
    return;
  }

  try {
    // Method 1: Try One Tap first (desktop only)
    console.log("🔄 Trying One Tap sign-in...");
    showGreyNotification("Attempting Google sign-in...");

    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        console.log("⚠️ One Tap not available, trying popup...");
        setTimeout(() => tryPopupSignIn(), 500);
      }
    });
  } catch (error) {
    console.error("❌ One Tap failed:", error);
    tryPopupSignIn();
  }
}

// Handle manual sign-in with auto-registration
async function handleManualSignIn() {
  const email = document.querySelector("#manualEmail").value.trim();
  const password = document.querySelector("#manualPassword").value;

  if (!email || !password) {
    showNotification("Please enter both email and password", "error");
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification("Please enter a valid email address", "error");
    return;
  }

  if (password.length < 6) {
    showNotification("Password must be at least 6 characters", "error");
    return;
  }

  console.log("🔐 Manual sign-in attempt for:", email);
  showGreyNotification("Signing in...");

  try {
    const response = await apiRequest("/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.success) {
      // Store JWT token for session persistence
      if (response.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("authType", "manual");
        console.log("🔐 JWT token stored for session persistence");
      }

      currentUser = {
        id: response.user.id,
        name: response.user.name || response.user.email.split("@")[0],
        email: response.user.email,
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          response.user.email.split("@")[0]
        )}&background=random`,
        isManual: true,
      };

      console.log("👤 User signed in:", currentUser);
      closeSignInModal();
      updateSignInUI();

      // Load user data
      loadUserNotes();
      loadUserTodos();
      loadUserTimers();

      const welcomeMessage = response.isNewUser
        ? `Welcome ${currentUser.name}! Account created successfully.`
        : `Welcome back, ${currentUser.name}!`;

      showNotification(welcomeMessage, "success");
    } else {
      // Check for specific error types and show appropriate notifications
      if (response.isGoogleAccount) {
        showNotification(
          "This email is registered with Google. Please use Google Sign-In instead.",
          "error"
        );
      } else if (!response.success && response.message.includes("Invalid")) {
        showNotification("Wrong password. Please try again.", "error");
      } else {
        showNotification(response.message || "Sign-in failed", "error");
      }
    }
  } catch (error) {
    console.error("❌ Manual sign-in failed:", error);
    showNotification("Login error. Please try again.", "error");
  }
}

// Method 2: Popup sign-in fallback
function tryPopupSignIn() {
  console.log("🔄 Trying popup sign-in...");

  try {
    // Create a hidden Google Sign-In button to trigger popup
    const tempDiv = document.createElement("div");
    tempDiv.style.display = "none";
    document.body.appendChild(tempDiv);

    google.accounts.id.renderButton(tempDiv, {
      theme: "outline",
      size: "large",
      click_listener: () => {
        console.log("🪟 Popup sign-in initiated");
      },
    });

    // Simulate click on the Google button
    setTimeout(() => {
      const googleBtn = tempDiv.querySelector("iframe");
      if (googleBtn) {
        googleBtn.click();
      } else {
        console.log("⚠️ Popup not available, trying redirect...");
        tryRedirectSignIn();
      }
      // Clean up
      document.body.removeChild(tempDiv);
    }, 100);
  } catch (error) {
    console.error("❌ Popup sign-in failed:", error);
    tryRedirectSignIn();
  }
}

// Method 3: Redirect sign-in (final fallback - works in all browsers)
function tryRedirectSignIn() {
  console.log("🔄 Using redirect sign-in (Brave browser compatible)...");

  const clientId =
    "1038950117037-i0buqo6336f193107jlqbuk4egkn85pn.apps.googleusercontent.com";
  // Use exact URL without any manipulation
  const redirectUri = encodeURIComponent(
    "https://ellewest.github.io/MinimalistNotesProject/"
  );
  const scope = "openid profile email";
  const responseType = "id_token"; // Changed to just id_token for simpler flow
  const state = Math.random().toString(36).substring(2, 15);

  // Store state for verification
  sessionStorage.setItem("oauth_state", state);

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectUri}&` +
    `scope=${scope}&` +
    `response_type=${responseType}&` +
    `state=${state}&` +
    `nonce=${Math.random().toString(36).substring(2, 15)}&` +
    `prompt=select_account`;

  console.log("🌐 Redirecting to Google OAuth...");
  window.location.href = authUrl;
}

// Handle OAuth redirect response
function handleOAuthRedirect() {
  // Check for both authorization code and ID token responses
  const urlParams = new URLSearchParams(
    window.location.hash.substring(1) || window.location.search
  );
  const idToken = urlParams.get("id_token");
  const state = urlParams.get("state");
  const error = urlParams.get("error");

  if (error) {
    console.error("❌ OAuth error:", error);
    showNotification("Sign-in failed. Please try again.", "error");
    return;
  }

  if (idToken) {
    const storedState = sessionStorage.getItem("oauth_state");
    if (state && state !== storedState) {
      console.error("❌ OAuth state mismatch");
      showNotification(
        "Security verification failed. Please try again.",
        "error"
      );
      return;
    }

    // Process the ID token
    handleCredentialResponse({ credential: idToken });

    // Clean the URL and state
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    sessionStorage.removeItem("oauth_state");
  }
}

// Show notifications with proper styling
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animate in
  requestAnimationFrame(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateX(-50%) translateY(0)";
  });

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(-50%) translateY(-100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Show error notifications with grey background center top
function showErrorNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification error-grey";
  notification.innerHTML = `<span>⚠️ ${message}</span>`;

  document.body.appendChild(notification);

  // Animate in
  requestAnimationFrame(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateX(-50%) translateY(0)";
  });

  // Auto-remove after 7 seconds (longer for error messages)
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(-50%) translateY(-100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 7000);
}

// Show grey info notifications for auth processes
function showGreyNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification info-grey";
  notification.innerHTML = `<span>🔐 ${message}</span>`;

  document.body.appendChild(notification);

  // Animate in
  requestAnimationFrame(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateX(-50%) translateY(0)";
  });

  // Auto-remove after 4 seconds (shorter for info messages)
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(-50%) translateY(-100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Sign out function
function signOut() {
  console.log("🚪 Starting sign out process...");
  currentUser = null;

  // Clear stored tokens for session persistence
  localStorage.removeItem("authToken");
  localStorage.removeItem("googleToken");
  localStorage.removeItem("authType");
  console.log("🗑️ Cleared stored authentication tokens");

  // Clear all user data when signing out
  const notesContainer = document.getElementById("notesContainer");
  if (notesContainer) {
    notesContainer.innerHTML = "";
  }

  const todoListContainer = document.querySelector(".todo-list-container");
  if (todoListContainer) {
    todoListContainer.innerHTML = "";
  }

  const timerContainer = document.querySelector(".timer-container");
  if (timerContainer) {
    timerContainer.innerHTML = "";
  }

  // Properly reset Google Sign-In
  if (window.google) {
    google.accounts.id.disableAutoSelect();
    // Re-initialize Google Auth to make sign-in work again
    setTimeout(() => {
      console.log("🔄 Re-initializing Google Auth...");
      google.accounts.id.initialize({
        client_id:
          "1038950117037-i0buqo6336f193107jlqbuk4egkn85pn.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });
    }, 100);
  }

  updateSignInUI();
  console.log("✅ User signed out successfully");
}

// Auto-login check for session persistence
async function checkExistingSession() {
  console.log("🔍 Checking for existing session...");

  const authToken = localStorage.getItem("authToken");
  const googleToken = localStorage.getItem("googleToken");
  const authType = localStorage.getItem("authType");

  if (authType === "manual" && authToken) {
    console.log("🔐 Found manual auth token, validating...");
    try {
      // Validate JWT token with backend
      const response = await apiRequest("/auth/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.success) {
        currentUser = {
          id: response.user.id,
          name: response.user.name || response.user.email.split("@")[0],
          email: response.user.email,
          picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            response.user.email.split("@")[0]
          )}&background=random`,
          isManual: true,
        };

        console.log("✅ Manual session restored:", currentUser);
        updateSignInUI();
        loadUserNotes();
        loadUserTodos();
        loadUserTimers();
        showNotification(`Welcome back, ${currentUser.name}!`, "success");
        return;
      } else {
        console.log("❌ Manual token invalid, clearing...");
        localStorage.removeItem("authToken");
        localStorage.removeItem("authType");
      }
    } catch (error) {
      console.error("❌ Manual token validation failed:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("authType");
    }
  }

  if (authType === "google" && googleToken) {
    console.log("🔐 Found Google token, validating...");
    try {
      // Validate Google token
      const userInfo = parseJwt(googleToken);
      const tokenExpiry = userInfo.exp * 1000; // Convert to milliseconds

      if (Date.now() < tokenExpiry) {
        currentUser = {
          id: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
        };

        console.log("✅ Google session restored:", currentUser);
        updateSignInUI();
        loadUserNotes();
        loadUserTodos();
        loadUserTimers();
        showNotification(`Welcome back, ${currentUser.name}!`, "success");
        return;
      } else {
        console.log("❌ Google token expired, clearing...");
        localStorage.removeItem("googleToken");
        localStorage.removeItem("authType");
      }
    } catch (error) {
      console.error("❌ Google token validation failed:", error);
      localStorage.removeItem("googleToken");
      localStorage.removeItem("authType");
    }
  }

  console.log("ℹ️ No valid session found");
}

// Initialize Google Auth when page loads
function initializeGoogleAuth() {
  // First check if we're returning from OAuth redirect
  handleOAuthRedirect();

  if (window.google) {
    try {
      google.accounts.id.initialize({
        client_id:
          "1038950117037-i0buqo6336f193107jlqbuk4egkn85pn.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: false,
      });

      // Initialize the sign-in button
      updateSignInUI();

      console.log("✅ Google Auth initialized successfully");
    } catch (error) {
      console.error("❌ Google Auth initialization failed:", error);
      console.log("📋 Redirect sign-in will be used as fallback");
    }
  } else {
    console.warn(
      "⚠️ Google Auth library not loaded, redirect method will be used"
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Check for existing session first (before Google Auth init)
  checkExistingSession();

  // Initialize Google Auth with a small delay to ensure Google library loads
  setTimeout(initializeGoogleAuth, 1000);

  // Date and Time Functionality
  const dateDisplay = document.getElementById("dateDisplay");
  const timeDisplay = document.getElementById("timeDisplay");
  const dayProgressBar = document.getElementById("dayProgressBar");
  const dayProgressValue = document.getElementById("dayProgressValue");

  function updateDateTime() {
    const now = new Date();

    // Format date (e.g., "Monday, March 18")
    const dateOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    dateDisplay.textContent = now.toLocaleDateString(undefined, dateOptions);

    // Format time (e.g., "14:30")
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    timeDisplay.textContent = now.toLocaleTimeString(undefined, timeOptions);

    // Calculate time left
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const totalSecondsInDay = 24 * 60 * 60;
    const currentSeconds = hours * 60 * 60 + minutes * 60 + seconds;
    const remainingSeconds = totalSecondsInDay - currentSeconds;
    const remainingPercentage = (remainingSeconds / totalSecondsInDay) * 100;

    // Update progress bar and value
    dayProgressBar.style.setProperty("--progress", `${remainingPercentage}%`);
    dayProgressValue.textContent = `${Math.round(remainingPercentage)}%`;
  }

  // Update immediately and then every second
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Create note button
  const createNoteBtn = document.getElementById("createNoteBtn");
  // Container for all notes
  const notesContainer = document.getElementById("notesContainer");
  // Maximum number of notes
  const MAX_NOTES = 15;

  createNoteBtn.addEventListener("click", () => {
    // Check if we've reached the maximum number of notes
    if (notesContainer.children.length >= MAX_NOTES) {
      return;
    }

    // Create new note using our backend-integrated function
    const { note } = createNoteElement();

    // Focus the new note
    note.focus();
  });

  // Todo List Functionality
  const todoHeading = document.querySelector(".todo-heading");
  const todoListContainer = document.querySelector(".todo-list-container");
  const MAX_TODOS = 30;

  todoHeading.addEventListener("click", () => {
    // Check the maximum number of todos
    if (todoListContainer.children.length >= MAX_TODOS) {
      return;
    }

    // Create new todo using our backend-integrated function
    createTodoElement();
  });

  // Timer Functionality
  const stopwatchHeading = document.querySelector(".stopwatch-heading");
  const timerContainer = document.querySelector(".timer-container");
  const MAX_TIMERS = 30;

  stopwatchHeading.addEventListener("click", () => {
    if (timerContainer.children.length >= MAX_TIMERS) {
      return;
    }

    // Create new timer using our backend-integrated function
    createTimerElement();
  });

  // Weather Functionality
  const locationInput = document.getElementById("locationInput");
  const locationElement = document.getElementById("location");
  const countryElement = document.getElementById("country");
  const temperatureElement = document.getElementById("temperature");
  const aqiElement = document.getElementById("aqi");
  const windSpeedElement = document.getElementById("windSpeed");
  const rainChanceElement = document.getElementById("rainChance");
  const humidityElement = document.getElementById("humidity");

  const API_KEY = "53874b70595011991cf452a78ce2eea5";
  const BASE_URL = "https://api.openweathermap.org/data/2.5";

  let weatherDebounceTimer;

  // Add minimize button functionality
  const weatherHeading = document.querySelector(".weather-heading");
  const weatherContainer = document.querySelector(".weather-container");
  let isMinimized = true; // Set to true by default

  // Initialize weather container as minimized
  weatherContainer.classList.add("minimized");

  weatherHeading.addEventListener("click", () => {
    isMinimized = !isMinimized;
    weatherContainer.classList.toggle("minimized", isMinimized);
  });

  async function getWeatherData(location) {
    try {
      // Get current weather data
      const weatherResponse = await fetch(
        `${BASE_URL}/weather?q=${location}&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherResponse.json();

      // Get air quality data
      const aqiResponse = await fetch(
        `${BASE_URL}/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${API_KEY}`
      );
      const aqiData = await aqiResponse.json();

      // Get forecast data for rain probability
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${location}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastResponse.json();

      // Calculate rain probability from forecast
      const rainProbability = calculateRainProbability(forecastData.list);

      // Update UI with weather data
      locationElement.textContent = weatherData.name;
      countryElement.textContent = weatherData.sys.country;
      temperatureElement.textContent = `${Math.round(weatherData.main.temp)}°C`;
      aqiElement.textContent = `${aqiData.list[0].main.aqi}`;
      windSpeedElement.textContent = `${Math.round(
        weatherData.wind.speed
      )} km/h`;
      rainChanceElement.textContent = `${rainProbability}%`;
      humidityElement.textContent = `${weatherData.main.humidity}%`;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      // Reset values on error
      locationElement.textContent = "--";
      countryElement.textContent = "--";
      temperatureElement.textContent = "--°C";
      aqiElement.textContent = "--";
      windSpeedElement.textContent = "-- km/h";
      rainChanceElement.textContent = "--%";
      humidityElement.textContent = "--%";
    }
  }

  function calculateRainProbability(forecastList) {
    // Calculate probability based on next 24 hours of forecast
    const next24Hours = forecastList.slice(0, 8); // 3-hour intervals for 24 hours
    const rainCount = next24Hours.filter(
      (item) => item.weather[0].main === "Rain"
    ).length;
    return Math.round((rainCount / 8) * 100);
  }

  // Add event listener for location input with debounce
  locationInput.addEventListener("input", (e) => {
    clearTimeout(weatherDebounceTimer);
    const location = e.target.value.trim();

    if (location.length >= 2) {
      // Only fetch if at least 2 characters are entered
      weatherDebounceTimer = setTimeout(() => {
        getWeatherData(location);
      }, 500); // Wait 500ms after typing stops before fetching
    }
  });

  // Dark mode functionality
  const darkModeToggle = document.getElementById("darkModeToggle");

  // Check for saved dark mode preference
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "enabled") {
    document.body.classList.add("dark-mode");
  }

  // Toggle dark mode
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Save preference
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.setItem("darkMode", "disabled");
    }
  });

  // Flip box functionality for date/time
  const dateTimeContainer = document.querySelector(".date-time-container");
  dateTimeContainer.addEventListener("click", () => {
    dateTimeContainer.classList.toggle("flipped");
  });

  // Header hide/show on scroll functionality
  let lastScrollTop = 0;
  const header = document.querySelector(".main-header");
  const h1Element = document.querySelector("h1");

  function getHeaderHeight() {
    // Get current screen width and return appropriate header height
    const width = window.innerWidth;
    if (width <= 480) return 140; // Mobile header height
    if (width <= 768) return 120; // Tablet header height
    if (width <= 1024) return 100; // Small desktop header height
    return 80;
  }

  window.addEventListener("scroll", () => {
    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;
    const headerHeight = getHeaderHeight();
    const h1Position = h1Element.offsetTop - headerHeight;

    // Much more aggressive hiding on mobile/tablet with different thresholds
    let scrollThreshold;
    if (window.innerWidth <= 1024) {
      // DISABLE header hiding on mobile and tablet
      return;
    } else {
      scrollThreshold = h1Position; // Normal behavior on desktop only
    }

    if (currentScroll > lastScrollTop && currentScroll >= scrollThreshold) {
      // Scrolling down and past threshold
      header.classList.add("hidden");
    } else if (currentScroll <= 5) {
      // Only show header when at the very top (within 5px tolerance)
      header.classList.remove("hidden");
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });

  // Also listen for window resize to recalculate on orientation change
  window.addEventListener("resize", () => {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
      // Force recalculation on next scroll
      lastScrollTop = -1;
      // Update quote default text for screen size
      updateQuoteDefaultText();
    }, 100);
  });

  // Quotes API Functionality
  const quoteBtn = document.getElementById("quoteBtn");
  const blankBox = document.querySelector(".header-blank-box");

  // Create ticker container
  const tickerContainer = document.createElement("div");
  tickerContainer.className = "quote-ticker-container";
  tickerContainer.style.cssText = `
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    box-sizing: border-box;
  `;

  // Create ticker text element
  const tickerText = document.createElement("div");
  tickerText.className = "quote-ticker-text static";
  tickerText.style.cssText = `
    font-family: "Press Start 2P", monospace;
    font-size: 0.7rem;
    color: #000000;
    text-align: center;
    line-height: 1.5;
    word-wrap: break-word;
    overflow-wrap: break-word;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  // Set different default text based on screen size
  function updateQuoteDefaultText() {
    // Only update if showing default text (not a fetched quote)
    if (tickerText.classList.contains("static")) {
      if (window.innerWidth <= 1024) {
        // Mobile and tablet
        tickerText.textContent = "Click Quote";
      } else {
        // Desktop
        tickerText.textContent = "Click 'Quote' to get inspired!";
      }
    }
  }

  // Set initial text
  updateQuoteDefaultText();

  tickerContainer.appendChild(tickerText);
  blankBox.appendChild(tickerContainer);

  // Track animation state
  let isAnimationPaused = false;

  // Make quote box clickable to pause/resume animation at current position
  blankBox.addEventListener("click", () => {
    if (tickerText.classList.contains("quote-scrolling")) {
      if (isAnimationPaused) {
        // Resume animation from current position
        tickerText.classList.remove("paused");
        isAnimationPaused = false;
        console.log("Quote scrolling resumed from current position");
      } else {
        // Pause animation at current position
        tickerText.classList.add("paused");
        isAnimationPaused = true;
        console.log("Quote scrolling paused at current position");
      }
    }
  });

  // Double-click to clear quote and restore default text
  blankBox.addEventListener("dblclick", () => {
    console.log("Quote box double-clicked - clearing quote");
    tickerText.classList.remove("quote-scrolling", "paused");
    tickerText.classList.add("static");
    isAnimationPaused = false;
    updateQuoteDefaultText();
    console.log("Quote cleared, default text restored");
  });

  // Function to check if a quote contains religious content
  function isReligiousQuote(quote, author) {
    const religiousKeywords = [
      "god",
      "jesus",
      "christ",
      "christian",
      "bible",
      "biblical",
      "lord",
      "heaven",
      "hell",
      "prayer",
      "pray",
      "faith",
      "divine",
      "holy",
      "sacred",
      "blessed",
      "blessing",
      "soul",
      "salvation",
      "sin",
      "church",
      "gospel",
      "scripture",
      "spiritual",
      "allah",
      "islam",
      "muslim",
      "quran",
      "buddha",
      "buddhist",
      "hindu",
      "hinduism",
      "meditation",
      "karma",
      "nirvana",
      "enlightenment",
      "temple",
      "monastery",
      "prophet",
      "apostle",
      "disciple",
      "resurrection",
      "crucifixion",
      "trinity",
      "virgin mary",
      "moses",
      "abraham",
      "noah",
    ];

    const religiousAuthors = [
      "jesus",
      "buddha",
      "confucius",
      "lao tzu",
      "rumi",
      "mother teresa",
      "dalai lama",
      "thomas aquinas",
      "augustine",
      "francis of assisi",
      "teresa of avila",
      "john wesley",
      "martin luther",
      "pope",
      "saint",
      "st.",
      "rabbi",
      "imam",
      "pastor",
      "reverend",
    ];

    const quoteText = quote.toLowerCase();
    const authorName = author.toLowerCase();

    // Check if quote contains religious keywords
    const hasReligiousContent = religiousKeywords.some(
      (keyword) => quoteText.includes(keyword) || authorName.includes(keyword)
    );

    // Check if author is known religious figure
    const isReligiousAuthor = religiousAuthors.some((name) =>
      authorName.includes(name)
    );

    return hasReligiousContent || isReligiousAuthor;
  }

  // Function to fetch quote from API
  async function fetchQuote() {
    let attempts = 0;
    const maxAttempts = 5; // Try up to 5 times to get a non-religious quote

    // Primary API - API Ninjas (CORS-friendly, reliable)
    while (attempts < maxAttempts) {
      try {
        console.log("🥇 Trying API Ninjas...");
        const response = await fetch("https://api.api-ninjas.com/v1/quotes", {
          headers: {
            "X-Api-Key": "GXdPnIpfRKklijz1mQjfgQ==3nh9RkJNYIAMXmg3",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ API Ninjas Response:", data);

        if (data && data.length > 0) {
          const quoteData = {
            quote: data[0].quote,
            author: data[0].author,
          };

          // Check if quote is religious
          if (!isReligiousQuote(quoteData.quote, quoteData.author)) {
            console.log("🎯 Found good quote from API Ninjas!");
            return quoteData;
          } else {
            console.log("⚠️ Filtered out religious quote, trying again...");
            attempts++;
            continue;
          }
        } else {
          throw new Error("No quote data received from API Ninjas");
        }
      } catch (error) {
        console.error("❌ API Ninjas failed:", error);
        break; // Exit loop and try backup API
      }
    }

    // Backup API - DummyJSON (CORS-friendly, no key needed)
    attempts = 0;
    while (attempts < maxAttempts) {
      try {
        console.log("🥈 Trying DummyJSON backup...");
        const backupResponse = await fetch(
          "https://dummyjson.com/quotes/random"
        );

        if (!backupResponse.ok) {
          throw new Error(`Backup API error! status: ${backupResponse.status}`);
        }

        const backupData = await backupResponse.json();
        console.log("✅ DummyJSON Response:", backupData);

        const quoteData = {
          quote: backupData.quote,
          author: backupData.author,
        };

        // Check if quote is religious
        if (!isReligiousQuote(quoteData.quote, quoteData.author)) {
          console.log("🎯 Found good quote from DummyJSON!");
          return quoteData;
        } else {
          console.log(
            "⚠️ Filtered out religious quote from backup, trying again..."
          );
          attempts++;
          continue;
        }
      } catch (backupError) {
        console.error("❌ DummyJSON backup failed:", backupError);
        break; // Exit loop and use fallback quotes
      }
    }

    console.warn(
      "⚠️ All APIs failed or couldn't find non-religious quotes, using fallback"
    );

    // Local fallback quotes (non-religious) - only as last resort
    const fallbackQuotes = [
      {
        quote: "The best way to predict the future is to create it.",
        author: "Peter Drucker",
      },
      {
        quote:
          "Life is what happens to you while you're busy making other plans.",
        author: "John Lennon",
      },
      {
        quote:
          "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
      },
      {
        quote:
          "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
      },
      {
        quote: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs",
      },
      {
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
      },
      {
        quote: "Be yourself; everyone else is already taken.",
        author: "Oscar Wilde",
      },
      {
        quote:
          "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
        author: "Albert Einstein",
      },
    ];

    const randomQuote =
      fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    return randomQuote;
  }

  // Function to display quote with gentle scrolling for readability
  function displayQuote(quoteData, isLoading = false) {
    console.log("Displaying quote:", quoteData); // Debug log
    const quoteText = `"${quoteData.quote}" - ${quoteData.author}`;
    console.log("Quote text:", quoteText); // Debug log

    tickerText.textContent = quoteText;

    // Remove any inline color styles to let CSS handle colors
    tickerText.style.removeProperty("color");
    console.log(
      "Removed inline color styling - CSS will handle colors based on dark/light mode"
    );

    // Remove any existing animation
    tickerText.classList.remove("quote-scrolling", "paused", "static");

    // Reset animation state
    isAnimationPaused = false;

    // Add appropriate class based on quote length and loading state
    if (!isLoading && quoteText.length > 50) {
      // Long quotes: start scrolling immediately
      tickerText.classList.add("quote-scrolling");
      console.log("Added immediate scrolling for long quote");
    } else {
      // Short quotes or loading: show statically
      tickerText.classList.add("static");
      console.log("Added static display for short quote or loading");
    }

    console.log("Quote displayed in box!"); // Debug log
  }

  // Quote button click handler
  quoteBtn.addEventListener("click", async () => {
    console.log("Quote button clicked!"); // Debug log

    // Show loading state
    tickerText.textContent = "Loading quote...";
    tickerText.classList.remove("quote-scrolling", "paused", "static");
    tickerText.classList.add("static");

    try {
      const quoteData = await fetchQuote();
      displayQuote(quoteData, false); // false = not loading, so enable scrolling
    } catch (error) {
      // On error, restore appropriate default text for screen size
      tickerText.classList.remove("quote-scrolling", "paused");
      tickerText.classList.add("static");
      updateQuoteDefaultText();
      console.log("Error loading quote, restored default text");
    }
  });
});

console.log("✅ Google Auth functions defined");
