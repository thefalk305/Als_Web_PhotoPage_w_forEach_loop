// flipCards.js

// ✅ Import the array of flip-card data from a separate file.
// This array holds information like image paths, names, biographies, etc.
import { flipCards } from './data.js';

// ✅ Find the HTML element where all flip cards will be inserted.
// This assumes your HTML file has: <div id="card-container"></div>
const container = document.getElementById("card-container");

// ✅ Loop through each card in the flipCards array and create a visual card.
flipCards.forEach(card => {
  // 🧱 Create the outer card container '<div>' and assign it the CSS class "flip-card".
  const cardElement = document.createElement("div");
  cardElement.className = "flip-card";

  // 🧩 Define the HTML structure for each card, using template literals.
  // This includes:
  // - The front of the card with an image and name
  // - The back of the card with a description and a biography link
  // - Tick marks (`) are used to allow multi-line strings that can also contain variables (i.e. ${card.image}).
  cardElement.innerHTML = `
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <img src="${card.image}" alt="${card.alt}" />
        <h3>${card.name}</h3>
      </div>
      <div class="flip-card-back">
        <p>${card.description}</p>
        <a href="${card.bioLink}">View Biography</a>
      </div>
    </div>
  `;

  // 📦 Add each fully assembled card into the container on the page.
  container.appendChild(cardElement);
});