/**
 * facilities.js - Recycling Facilities Directory Logic
 * ----------------------------------------------------
 * Loads data/facilities.json, extracts unique cities to populate the dropdown,
 * handles instant filter changes, and updates the facility cards list and count.
 */

document.addEventListener("DOMContentLoaded", () => {
  initFacilitiesPage();
});

/**
 * Main coordinator function for the facilities directory page.
 * Loads the facilities data and binds the city dropdown events.
 */
async function initFacilitiesPage() {
  const container = document.getElementById("facilities-container");
  const citySelect = document.getElementById("city-filter");
  const countDisplay = document.getElementById("facility-count");

  if (!container || !citySelect || !countDisplay) {
    return;
  }

  container.innerHTML = "<p class='text-center'>Loading facilities...</p>";

  try {
    const response = await fetch("data/facilities.json");
    if (!response.ok) {
      throw new Error(`Failed to load facilities data (HTTP ${response.status})`);
    }

    const facilities = await response.json();

    // Populate the dropdown with unique cities
    populateCityDropdown(facilities, citySelect);

    // Initial render of all facilities
    renderFilteredFacilities(facilities, "All", container, countDisplay);

    // Filter immediately when user changes the dropdown option (no submit button needed)
    citySelect.addEventListener("change", () => {
      const selectedCity = citySelect.value;
      renderFilteredFacilities(facilities, selectedCity, container, countDisplay);
    });

  } catch (error) {
    console.error("Error loading facilities:", error);
    container.innerHTML = `
      <div class="message-box">
        <h3>Unable to load facilities</h3>
        <p>Could not fetch data. Please ensure the website is served via a local web server (such as Live Server).</p>
      </div>
    `;
    countDisplay.textContent = "Showing 0 facilities";
  }
}

/**
 * Extracts unique city names from facilities data and adds option elements to the select.
 * 
 * @param {Array} facilities - Array of facility objects
 * @param {HTMLSelectElement} selectElement - The city dropdown element
 */
function populateCityDropdown(facilities, selectElement) {
  // Collect unique city names
  const cities = [];
  facilities.forEach((facility) => {
    if (facility.city && !cities.includes(facility.city)) {
      cities.push(facility.city);
    }
  });

  // Sort alphabetically
  cities.sort();

  // Append option tags for each city
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    selectElement.appendChild(option);
  });
}

/**
 * Filters facility items by city and renders cards to the container.
 * Also updates the count display and shows friendly message if empty.
 * 
 * @param {Array} allFacilities - Complete list of facility objects
 * @param {string} selectedCity - Selected city name or "All"
 * @param {HTMLElement} container - Card container
 * @param {HTMLElement} countElement - Result count element
 */
function renderFilteredFacilities(allFacilities, selectedCity, container, countElement) {
  // Filter items
  const filtered = selectedCity === "All"
    ? allFacilities
    : allFacilities.filter((item) => item.city === selectedCity);

  // Update facility count display
  const count = filtered.length;
  countElement.textContent = `Showing ${count} facilit${count === 1 ? "y" : "ies"}`;

  // If no matching facilities
  if (count === 0) {
    container.innerHTML = `
      <div class="message-box reveal visible">
        <h3>No Facilities Found</h3>
        <p>No recycling facilities found in this city.</p>
      </div>
    `;
    return;
  }

  // Render cards grid
  container.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "card-grid";

  filtered.forEach((facility) => {
    const card = document.createElement("div");
    card.className = "card facility-card reveal";

    // Build accepted materials tags
    const acceptedTagsHtml = (facility.accepts || [])
      .map((mat) => `<li class="accepted-tag">${escapeHtml(mat)}</li>`)
      .join("");

    card.innerHTML = `
      <span class="facility-city">${escapeHtml(facility.city)}</span>
      <h3 class="card-title">${escapeHtml(facility.name)}</h3>
      <p class="facility-address">📍 ${escapeHtml(facility.address)}</p>
      <p class="facility-timing">🕒 ${escapeHtml(facility.timing)}</p>
      <div class="facility-accepts">
        <strong>Accepts:</strong>
        <ul class="accepted-list">
          ${acceptedTagsHtml}
        </ul>
      </div>
    `;

    grid.appendChild(card);
  });

  container.appendChild(grid);

  // Trigger scroll reveal on newly created cards
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    grid.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  } else {
    grid.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  }
}

/**
 * Escapes HTML characters to prevent script injection.
 * 
 * @param {string} str - Raw string
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
