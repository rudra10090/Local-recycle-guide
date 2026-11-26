/**
 * materials.js - Search & Filter Logic for materials.html
 * -------------------------------------------------------
 * This script handles reading the URL search query (?q=), fetching
 * materials.json, filtering items, and dynamically rendering cards.
 */

document.addEventListener("DOMContentLoaded", () => {
  initMaterialsPage();
});

/**
 * Main coordinator function for the materials results page.
 * Reads the ?q= URL parameter, pre-fills the search input,
 * and calls loadAndRenderMaterials.
 */
async function initMaterialsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q") || "";

  // Pre-fill search input if present
  const searchInput = document.getElementById("materials-search-input");
  if (searchInput && query) {
    searchInput.value = query;
  }

  // Load and render
  await loadAndRenderMaterials(query.trim());
}

/**
 * Loads materials from data/materials.json and renders them.
 * If query is non-empty, filters matching materials by name or category.
 * If no matches found, shows friendly message and displays all materials.
 * 
 * @param {string} query - The search string to filter by
 */
async function loadAndRenderMaterials(query) {
  const container = document.getElementById("materials-container");
  const queryNotice = document.getElementById("query-notice");

  if (!container) {
    return;
  }

  container.innerHTML = "<p class='text-center'>Loading materials...</p>";

  try {
    const response = await fetch("data/materials.json");
    if (!response.ok) {
      throw new Error(`Failed to load materials data (HTTP ${response.status})`);
    }

    const materials = await response.json();
    const cleanQuery = query.toLowerCase();

    // If query is empty, show all materials
    if (!cleanQuery) {
      if (queryNotice) {
        queryNotice.innerHTML = "<p>Showing all recyclable materials. Use the search bar above to filter by name or category.</p>";
      }
      renderMaterialCards(materials, container);
      return;
    }

    // Filter materials by name or category (case-insensitive)
    const filtered = materials.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(cleanQuery);
      const categoryMatch = item.category && item.category.toLowerCase().includes(cleanQuery);
      return nameMatch || categoryMatch;
    });

    if (filtered.length > 0) {
      if (queryNotice) {
        queryNotice.innerHTML = `<p>Found <strong>${filtered.length}</strong> result${filtered.length === 1 ? "" : "s"} for "<strong>${escapeHtml(query)}</strong>".</p>`;
      }
      renderMaterialCards(filtered, container);
    } else {
      // No results found: show required message and show all materials below
      if (queryNotice) {
        queryNotice.innerHTML = `
          <div class="message-box">
            <h3>No results found</h3>
            <p>No materials found for '<strong>${escapeHtml(query)}</strong>'. Try Plastic, Paper, Glass, E-waste, Battery, or Metal.</p>
          </div>
          <h2 class="section-title">All Recyclable Materials</h2>
        `;
      }
      renderMaterialCards(materials, container);
    }

  } catch (error) {
    console.error("Error loading materials:", error);
    container.innerHTML = `
      <div class="message-box">
        <h3>Unable to load materials</h3>
        <p>Could not load materials data. Please ensure the website is opened through a local web server (such as Live Server).</p>
      </div>
    `;
  }
}

/**
 * Creates and injects material cards into the target container.
 * 
 * @param {Array} items - List of material objects
 * @param {HTMLElement} target - Container element
 */
function renderMaterialCards(items, target) {
  target.innerHTML = "";

  const grid = document.createElement("div");
  grid.className = "card-grid";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card material-card reveal";
    card.innerHTML = `
      <div class="card-icon">${item.icon || "♻️"}</div>
      <h3 class="card-title">${escapeHtml(item.name)}</h3>
      <span class="card-badge">${escapeHtml(item.category || "General")}</span>
      <p class="card-text"><strong>Bin:</strong> ${escapeHtml(item.binType)}</p>
      <div class="card-footer">
        <a href="material.html?id=${encodeURIComponent(item.id)}" class="btn btn-outline" style="width: 100%;">
          View details &rarr;
        </a>
      </div>
    `;
    grid.appendChild(card);
  });

  target.appendChild(grid);

  // Trigger scroll reveal on newly rendered cards
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
 * Helper to escape HTML characters and prevent injection
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
