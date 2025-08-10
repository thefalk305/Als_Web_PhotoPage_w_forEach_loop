// createFlipCardss.js
// createFlipCards.js contains the code that generates all the flip-card elements inserted at <div id="gallery">.

// ✅ Dynamically fetch the array of flip-card-data.json from a JSON file.
// This replaces the static import and allows the gallery to update based on backend submissions.
fetch('/flip-card-data.json')
  .then(res => res.json())
  .then(data => {
    // ✅ Find the HTML element where all flip cards will be inserted.
    // This assumes your HTML file has: <div id="gallery"></div>
    const container = document.getElementById("gallery");

    // ✅ Loop through each card in the loaded data and create a visual card.
    data.forEach(card => {
      // 🧱 Create the outer card container '<div>' and assign it the CSS class "flip-card".
      const cardElement = document.createElement("div");
      cardElement.className = "flip-card";

      // 🧩 Define the HTML structure for each card, using template literals.
      // This includes:
      // - The front of the card with an image and name
      // - The back of the card with a description and a biography link
      // Tick marks (`) are used to allow multi-line strings that can also contain variables (i.e. ${card.image}).
      // Note: Add target="_blank" to the href= to open the bio.html in a  new window
      cardElement.innerHTML = `
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <img src="${card.image}" alt="${card.alt}" />
            <h3>${card.name}</h3>
          </div>
          <div class="flip-card-back">
            <p>${card.description}</p>
            <a href="${card.bioLink}" rel="noopener noreferrer" class="bio-button">View Biography</a>
          </div>
        </div>
      `;

      // 📦 Add each fully assembled card into the 'gallery' container on the page.
      container.appendChild(cardElement);
    });
  })
  .catch(err => {
    // ⚠️ In case of errors loading the JSON file, provide fallback messaging.
    console.error('❌ Failed to load flip-card-data.json:', err);
    const container = document.getElementById("gallery");
    container.innerHTML = '<p>Unable to load family gallery at the moment.</p>';
  });