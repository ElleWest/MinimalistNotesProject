// Google Authentication Functions
let currentUser = null;

// This function handles the response from Google
function handleCredentialResponse(response) {
  // Decode the JWT token to get user info
  const userInfo = parseJwt(response.credential);

  currentUser = {
    id: userInfo.sub,
    name: userInfo.name,
    email: userInfo.email,
    picture: userInfo.picture,
  };

  console.log("User signed in:", currentUser);

  // Update the UI to show the user is signed in
  updateSignInUI();

  // Show welcome message
  alert(`Welcome, ${currentUser.name}!`);
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
    signInDiv.onclick = () => {
      if (window.google) {
        google.accounts.id.prompt();
      }
    };
    signInDiv.style.cursor = "pointer";
    signInDiv.title = "Sign in with Google";
  }
}

// Sign out function
function signOut() {
  currentUser = null;
  if (window.google) {
    google.accounts.id.disableAutoSelect();
  }
  updateSignInUI();
  console.log("User signed out successfully");
}

// Initialize Google Auth when page loads
function initializeGoogleAuth() {
  if (window.google) {
    google.accounts.id.initialize({
      client_id:
        "1038950117037-i0buqo6336f193107jlqbuk4egkn85pn.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    // Initialize the sign-in button
    updateSignInUI();

    // Hide any Google-generated elements that might appear
    setTimeout(() => {
      const googleElements = document.querySelectorAll(
        "[data-client_id], .g_id_signin"
      );
      googleElements.forEach((el) => {
        if (el.id !== "signinBtn") {
          el.style.display = "none";
        }
      });
    }, 500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
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
  // Placeholder texts
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

  createNoteBtn.addEventListener("click", () => {
    // Check if we've reached the maximum number of notes
    if (notesContainer.children.length >= MAX_NOTES) {
      return;
    }

    // Create note wrapper
    const noteWrapper = document.createElement("div");
    noteWrapper.className = "note-wrapper";

    // Create new note
    const note = document.createElement("textarea");
    note.className = "note";

    // Get the current number of notes (before adding the new one)
    const currentNoteCount = notesContainer.children.length;
    // Set the placeholder text based on the position
    note.placeholder = placeholderTexts[currentNoteCount];

    // Create delete button from scratch
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✖";
    deleteBtn.addEventListener("click", () => {
      noteWrapper.remove();
    });

    // Append elements to wrapper
    noteWrapper.appendChild(note);
    noteWrapper.appendChild(deleteBtn);

    // Add the new note at the beginning of the container
    notesContainer.insertBefore(noteWrapper, notesContainer.firstChild);

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

    const todoItem = document.createElement("div");
    todoItem.className = "todo-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", () => {
      textSpan.style.textDecoration = checkbox.checked
        ? "line-through"
        : "none";
    });

    const textSpan = document.createElement("span");
    textSpan.contentEditable = true;
    textSpan.textContent = "";
    textSpan.style.color = "#808080";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.onclick = () => todoItem.remove();

    // Append elements to todoItem in correct order
    todoItem.appendChild(checkbox);
    todoItem.appendChild(textSpan);
    todoItem.appendChild(deleteBtn);

    todoListContainer.appendChild(todoItem);
    textSpan.focus();

    // Add event listener to remove placeholder as soon as user types
    textSpan.addEventListener("input", () => {
      textSpan.style.color = document.body.classList.contains("dark-mode")
        ? "#ffffff"
        : "#000000";
    });

    // Reset color to grey if text is empty
    textSpan.addEventListener("blur", () => {
      if (textSpan.textContent.trim() === "") {
        textSpan.textContent = "";
        textSpan.style.color = "#808080";
      }
    });
  });

  // Timer Functionality
  const stopwatchHeading = document.querySelector(".stopwatch-heading");
  const timerContainer = document.querySelector(".timer-container");
  const MAX_TIMERS = 30;

  stopwatchHeading.addEventListener("click", () => {
    if (timerContainer.children.length >= MAX_TIMERS) {
      return;
    }

    const timerBox = document.createElement("div");
    timerBox.className = "timer-box";

    const timerTitle = document.createElement("input");
    timerTitle.className = "timer-title";
    timerTitle.type = "text";
    timerTitle.placeholder = "Task Title";
    timerTitle.value = "";
    timerTitle.style.color = "#808080";

    const timerDisplay = document.createElement("div");
    timerDisplay.className = "timer-display";
    timerDisplay.textContent = "00:00:00";

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
    deleteBtn.onclick = () => {
      clearInterval(timerBox._interval);
      timerBox.remove();
    };

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
    timerBox._elapsedTime = 0;

    function updateDisplay() {
      const hours = Math.floor(timerBox._elapsedTime / (1000 * 60 * 60));
      const minutes = Math.floor(
        (timerBox._elapsedTime % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timerBox._elapsedTime % (1000 * 60)) / 1000);
      timerDisplay.textContent = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    function startTimer() {
      if (!timerBox._interval) {
        timerBox._startTime = Date.now() - timerBox._elapsedTime;
        timerBox._interval = setInterval(() => {
          timerBox._elapsedTime = Date.now() - timerBox._startTime;
          updateDisplay();
        }, 10);
        startBtn.style.display = "none";
        pauseBtn.style.display = "block";
      }
    }

    function pauseTimer() {
      if (timerBox._interval) {
        clearInterval(timerBox._interval);
        timerBox._interval = null;
        startBtn.style.display = "block";
        pauseBtn.style.display = "none";
      }
    }

    function resetTimer() {
      if (timerBox._interval) {
        clearInterval(timerBox._interval);
        timerBox._interval = null;
      }
      timerBox._startTime = null;
      timerBox._elapsedTime = 0;
      timerDisplay.textContent = "00:00:00";
      startBtn.style.display = "block";
      pauseBtn.style.display = "none";
    }

    startBtn.onclick = startTimer;
    pauseBtn.onclick = pauseTimer;
    resetBtn.onclick = resetTimer;

    // Add event listener to remove placeholder as soon as user types
    timerTitle.addEventListener("input", () => {
      timerTitle.style.color = document.body.classList.contains("dark-mode")
        ? "#ffffff"
        : "#000000";
    });

    // Reset color to grey if text is empty
    timerTitle.addEventListener("blur", () => {
      if (timerTitle.value.trim() === "") {
        timerTitle.value = "";
        timerTitle.style.color = "#808080";
      }
    });
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
  tickerText.textContent = "Click 'Quote' to get inspired!";

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

    while (attempts < maxAttempts) {
      try {
        // Use ZenQuotes API - real quote API, completely free, no signup required
        const response = await fetch("https://zenquotes.io/api/random");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("ZenQuotes API Response:", data); // Debug log

        if (data && data.length > 0) {
          const quoteData = {
            quote: data[0].q,
            author: data[0].a,
          };

          // Check if quote is religious
          if (!isReligiousQuote(quoteData.quote, quoteData.author)) {
            return quoteData;
          } else {
            console.log("Filtered out religious quote, trying again...");
            attempts++;
            continue;
          }
        } else {
          throw new Error("No quote data received");
        }
      } catch (error) {
        console.error("ZenQuotes failed, trying backup:", error);
        break; // Exit loop and try backup API
      }
    }

    // Backup API - Quotable (real quote API)
    attempts = 0;
    while (attempts < maxAttempts) {
      try {
        const backupResponse = await fetch("https://api.quotable.io/random");
        if (!backupResponse.ok) {
          throw new Error(`Backup API error! status: ${backupResponse.status}`);
        }

        const backupData = await backupResponse.json();
        console.log("Quotable API Response:", backupData); // Debug log

        const quoteData = {
          quote: backupData.content,
          author: backupData.author,
        };

        // Check if quote is religious
        if (!isReligiousQuote(quoteData.quote, quoteData.author)) {
          return quoteData;
        } else {
          console.log(
            "Filtered out religious quote from backup, trying again..."
          );
          attempts++;
          continue;
        }
      } catch (backupError) {
        console.error("Backup API failed:", backupError);
        break; // Exit loop and use fallback quotes
      }
    }

    console.error(
      "All APIs failed or couldn't find non-religious quotes, using fallback"
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

    // Update text color based on current mode
    if (document.body.classList.contains("dark-mode")) {
      tickerText.style.color = "#ffffff";
      console.log("Set color to white (dark mode)");
    } else {
      tickerText.style.color = "#000000";
      console.log("Set color to black (light mode)");
    }

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
      tickerText.textContent = "Error loading quote. Try again!";
      tickerText.classList.remove("quote-scrolling", "static");
      tickerText.classList.add("static");
    }
  });
});
