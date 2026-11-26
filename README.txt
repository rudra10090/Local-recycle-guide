========================================================================
Local Recycling Guide
========================================================================

Project Description:
A simple, multi-page static website designed to help local residents 
search for recyclable materials, learn proper disposal steps, and locate 
nearby recycling facilities across cities.

------------------------------------------------------------------------
Languages & Technologies Used
------------------------------------------------------------------------
- HTML5 (Structure)
- CSS3 (Styling & Responsive Layout)
- JavaScript (ES6+ Vanilla JS, Client-Side Interactivity & Fetch API)
- JSON (Data Storage)

------------------------------------------------------------------------
Project Structure & File Descriptions
------------------------------------------------------------------------
local-recycling-guide/
|-- README.txt
|   Project overview, setup instructions, team details, and structure.
|
|-- favicon.svg
|   Site favicon designed in vector SVG matching the Leafy Green Garden palette.
|
|-- index.html
|   Homepage containing hero section, search bar with autocomplete suggestions,
|   quick-category buttons, and an introductory "How it works" section.
|
|-- materials.html
|   Search results and browsing page displaying matching material cards
|   filtered by search query or showing all available materials.
|
|-- material.html
|   Detail page for an individual material showing disposal steps,
|   dos, don'ts, recommended bin type, and facility links.
|
|-- facilities.html
|   Directory page listing recycling centres with an interactive city filter
|   dropdown and result count.
|
|-- css/
|   `-- style.css
|       Single master stylesheet containing CSS custom properties (Leafy Green 
|       Garden palette), reset rules, navbar, footer, cards, responsive queries, 
|       and scroll reveal animations.
|
|-- js/
|   |-- main.js
|   |   Shared utilities across all pages: mobile hamburger menu toggle, 
|   |   scroll-reveal with IntersectionObserver, and shared search suggestions.
|   |
|   |-- materials.js
|   |   Handles URL query parameter parsing (?q=), loads materials.json, 
|   |   filters items, and dynamically renders material result cards.
|   |
|   |-- material-detail.js
|   |   Reads material ID (?id=), fetches details from materials.json, and 
|   |   populates the structured disposal guide, dos, and don'ts.
|   |
|   `-- facilities.js
|       Loads facilities.json, populates the city filter dropdown dynamically, 
|       and filters facility cards on change.
|
`-- data/
    |-- materials.json
    |   JSON database storing recyclable items, categories, icons, bin types, 
    |   disposal steps, dos, and don'ts.
    |
    `-- facilities.json
        JSON database of local recycling centres, locations, timings, and 
        accepted items.

------------------------------------------------------------------------
Project Team Members
------------------------------------------------------------------------
- Member 1 (Lead / Architecture)
- Member 2 (Frontend / HTML & CSS)
- Member 3 (JavaScript & Interactivity)
- Member 4 (Data & Documentation)

------------------------------------------------------------------------
Important Notice: Sample Data
------------------------------------------------------------------------
All material disposal guidelines and recycling facility listings 
contained in the data/ directory are sample mock data created strictly 
for educational and demonstration purposes.

------------------------------------------------------------------------
Running the Website (Important Note on Fetch API & CORS)
------------------------------------------------------------------------
This website uses the native browser `fetch()` API to asynchronously load 
JSON data files from the `data/` directory.

Modern web browsers block `fetch()` requests when opening files directly 
using the file system protocol (e.g., file:///C:/.../index.html) due to 
Cross-Origin Resource Sharing (CORS) security restrictions.

To view and run the project properly:
1. Open the project folder `local-recycling-guide/` in VS Code or your code editor.
2. Install the "Live Server" extension (by Ritwick Dey) in VS Code.
3. Right-click `index.html` and select "Open with Live Server" (or click "Go Live" in the status bar).
   Alternatively, you can run any lightweight local server (such as Python's 
   `python -m http.server 5500` or Node's `npx serve`).
4. Access the site in your browser at http://localhost:5500/ (or the port provided).
========================================================================
