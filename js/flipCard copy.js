// flipCards.js
import { flipCards } from './data.js';

const container = document.getElementById("card-container");

flipCards.forEach(card => {
  const cardElement = document.createElement("div");
  cardElement.className = "flip-card";

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

  container.appendChild(cardElement);
});