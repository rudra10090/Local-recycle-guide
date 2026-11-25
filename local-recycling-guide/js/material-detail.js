/**
 * material-detail.js - Detail View Logic for material.html
 * --------------------------------------------------------
 * Reads the ?id= URL parameter, loads materials.json, finds the matching
 * material object, and renders structured disposal instructions, dos,
 * and don'ts.
 */

document.addEventListener("DOMContentLoaded", () => {
  initMaterialDetailPage();
});

/**
 * Initializes the detail page by reading query parameter ?id=
 * and triggering the data fetch.
 */
async function initMaterialDetailPage() {
  const container = document.getElementById("material-detail-content");
  if (!container) {
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const materialId = urlParams.get("id");

  // Friendly message if id is missing from URL
  if (!materialId) {
    renderMissingMessage(container, "No material was specified. Please choose a material from the list.");
    return;
  }

  try {
    const response = await fetch("data/materials.json");
    if (!response.ok) {
      throw new Error(`Failed to load materials data (HTTP ${response.status})`);
    }

    const materials = await response.json();
    const cleanId = materialId.trim().toLowerCase();

    // Find the item matching the ID
    const material = materials.find((item) => item.id.toLowerCase() === cleanId);

    if (!material) {
      renderMissingMessage(
        container,
        `Sorry, we could not find details for "${escapeHtml(materialId)}". It may not be in our database yet.`
      );
      return;
    }

    // Render material details
    renderMaterialDetail(container, material);

  } catch (error) {
    console.error("Error loading material detail:", error);
    container.innerHTML = `
      <div class="message-box">
        <h3>Unable to load material details</h3>
        <p>Could not fetch data. Please make sure the project is running via a local web server (such as Live Server).</p>
        <a href="materials.html" class="btn btn-outline">&larr; Return to Materials</a>
      </div>
    `;
  }
}

/**
 * Renders the detailed views for the selected material.
 * Includes heading, bin type, disposal steps, dos/donts, and facility referral.
 * 
 * @param {HTMLElement} container - Target container
 * @param {Object} item - Material object from JSON
 */
function renderMaterialDetail(container, item) {
  // Update browser tab title
  document.title = `Local Recycling Guide - ${item.name}`;

  // Generate numbered steps HTML
  const stepsListHtml = (item.steps || [])
    .map((step) => `<li>${escapeHtml(step)}</li>`)
    .join("");

  // Generate Dos list HTML (with checkmark styling)
  const dosListHtml = (item.dos || [])
    .map((doItem) => `<li>${escapeHtml(doItem)}</li>`)
    .join("");

  // Generate Don'ts list HTML (with crossmark styling)
  const dontsListHtml = (item.donts || [])
    .map((dontItem) => `<li>${escapeHtml(dontItem)}</li>`)
    .join("");

  container.innerHTML = `
    <!-- Header Card -->
    <div class="detail-header-card reveal visible">
      <div class="detail-icon">${item.icon || "♻️"}</div>
      <div class="detail-header-info">
        <h1>${escapeHtml(item.name)}</h1>
        <p style="margin-bottom: 0.5rem;">Category: <strong>${escapeHtml(item.category || "General")}</strong></p>
        <div class="detail-badge">Bin Type: ${escapeHtml(item.binType)}</div>
      </div>
    </div>

    <!-- How to Dispose (Numbered steps) -->
    <div class="detail-content-box reveal visible">
      <h2>How to Dispose</h2>
      <ol class="steps-list">
        ${stepsListHtml}
      </ol>
    </div>

    <!-- What to do & What not to do (Dos & Don'ts) -->
    <div class="dos-donts-grid reveal visible">
      <!-- What to do -->
      <div class="dos-box">
        <h2>What to do</h2>
        <ul class="dos-list">
          ${dosListHtml}
        </ul>
      </div>

      <!-- What not to do -->
      <div class="donts-box">
        <h2>What not to do</h2>
        <ul class="donts-list">
          ${dontsListHtml}
        </ul>
      </div>
    </div>

    <!-- Where to Dispose (Facility Referral) -->
    <div class="where-to-box reveal visible">
      <div>
        <h2 style="margin-bottom: 0.35rem; font-size: 1.25rem;">Where to dispose</h2>
        <p style="margin-bottom: 0;">
          Looking for certified drop-off locations or collection centers in your city?
        </p>
      </div>
      <a href="facilities.html" class="btn">
        Find Recycling Facilities &rarr;
      </a>
    </div>
  `;
}

/**
 * Renders a friendly error/not-found message inside the container.
 * 
 * @param {HTMLElement} container - Target container
 * @param {string} message - Message text
 */
function renderMissingMessage(container, message) {
  container.innerHTML = `
    <div class="message-box reveal visible">
      <h3>Material Not Found</h3>
      <p>${message}</p>
      <a href="materials.html" class="btn btn-outline">&larr; Back to Materials List</a>
    </div>
  `;
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
