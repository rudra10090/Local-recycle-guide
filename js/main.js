/**
 * main.js - Core JavaScript for Local Recycling Guide
 * ---------------------------------------------------
 * This script provides global functionality across all pages:
 * 1. Mobile navigation menu toggle (hamburger button).
 * 2. Viewport scroll reveal animations using IntersectionObserver.
 * 3. Search autocomplete suggestions for material names from materials.json.
 */

// Wait for the DOM to finish loading before executing scripts
document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initScrollReveal();
  initSearchSuggestions();
});

/**
 * Initializes the mobile hamburger menu toggle.
 * Toggles the 'open' class on the nav menu and 'is-active' on the button.
 */
function initMobileNav() {
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const navMenu = document.querySelector(".nav-menu");

  if (!hamburgerBtn || !navMenu) {
    return;
  }

  hamburgerBtn.addEventListener("click", () => {
    hamburgerBtn.classList.toggle("is-active");
    navMenu.classList.toggle("open");
  });

  // Close the menu if a link inside is clicked
  navMenu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburgerBtn.classList.remove("is-active");
      navMenu.classList.remove("open");
    });
  });
}

/**
 * Initializes scroll reveal animations using the browser's IntersectionObserver API.
 * Adds the 'visible' class to any element with the 'reveal' class when it enters viewport.
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length === 0) {
    return;
  }

  // If IntersectionObserver is not supported, display elements immediately
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));
}

/**
 * Shared search suggestion logic used on index.html and materials.html.
 * Loads data/materials.json, listens for user input, and displays up to 5 suggestions.
 */
async function initSearchSuggestions() {
  const searchInput = document.querySelector(".search-input");
  const suggestionsBox = document.querySelector(".search-suggestions");
  const searchForm = document.querySelector(".search-form");

  if (!searchInput || !suggestionsBox) {
    return;
  }

  // Cache loaded materials in memory
  let materialsData = [];

  try {
    const response = await fetch("data/materials.json");
    if (response.ok) {
      materialsData = await response.json();
    } else {
      console.warn("Could not load materials.json for search autocomplete.");
    }
  } catch (error) {
    console.error("Error fetching materials.json for suggestions:", error);
  }

  // Listen to input changes
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    // Hide if query is empty or data is not loaded
    if (!query || materialsData.length === 0) {
      suggestionsBox.innerHTML = "";
      suggestionsBox.classList.remove("show");
      return;
    }

    // Filter matching materials (by name or category), limit to 5
    const matches = materialsData.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(query);
      const catMatch = item.category && item.category.toLowerCase().includes(query);
      return nameMatch || catMatch;
    }).slice(0, 5);

    if (matches.length === 0) {
      suggestionsBox.innerHTML = "";
      suggestionsBox.classList.remove("show");
      return;
    }

    // Render suggestions
    suggestionsBox.innerHTML = "";
    matches.forEach((item) => {
      const li = document.createElement("li");
      li.className = "search-suggestion-item";
      li.innerHTML = `
        <span class="item-icon">${item.icon || "♻️"}</span>
        <span class="item-name">${item.name}</span>
        <span class="item-category">${item.category}</span>
      `;

      // Clicking suggestion navigates to material.html?id=<id>
      li.addEventListener("click", () => {
        window.location.href = `material.html?id=${encodeURIComponent(item.id)}`;
      });

      suggestionsBox.appendChild(li);
    });

    suggestionsBox.classList.add("show");
  });

  // Close suggestions if user clicks outside
  document.addEventListener("click", (event) => {
    if (!searchInput.contains(event.target) && !suggestionsBox.contains(event.target)) {
      suggestionsBox.classList.remove("show");
    }
  });

  // Handle standard search form submission
  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = searchInput.value.trim();
      window.location.href = `materials.html?q=${encodeURIComponent(query)}`;
    });
  }
}
