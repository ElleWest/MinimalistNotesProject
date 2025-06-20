document.addEventListener("DOMContentLoaded", () => {
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
});
