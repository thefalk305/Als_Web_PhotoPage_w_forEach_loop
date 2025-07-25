const fs = require('fs');
const { JSDOM } = require('jsdom');

// Load your HTML file
const htmlContent = fs.readFileSync('gallery.html', 'utf8');
const dom = new JSDOM(htmlContent);
const document = dom.window.document;

// Extract data from flip-card elements
const flipCards = Array.from(document.querySelectorAll('.flip-card')).map(card => {
  const img = card.querySelector('.flip-card-front img');
  const nameRaw = card.querySelector('.flip-card-front h3')?.textContent || '';
  const descriptionRaw = card.querySelector('.flip-card-back p')?.textContent || '';
  const bioLink = card.querySelector('.flip-card-back a')?.getAttribute('href');

  return {
    image: img?.getAttribute('src') || '',
    alt: img?.getAttribute('alt') || '',
    name: nameRaw.replace(/&nbsp;|&emsp;|\s+/g, ' ').trim(),
    description: descriptionRaw.replace(/&nbsp;|&emsp;|\s+/g, ' ').trim(),
    bioLink: bioLink || ''
  };
});

// Manual serialization (no quoted keys)
const formatted = flipCards.map(card => {
  return `  {
    image: "${card.image}",
    alt: "${card.alt}",
    name: "${card.name}",
    description: "${card.description}",
    bioLink: "${card.bioLink}"
  }`;
}).join(',\n');

const output = `export const flipCards = [\n${formatted}\n];`;

console.log('Writing to:', __dirname + '\\gallery-data.js');
fs.writeFileSync('gallery-data.js', output);
console.log('✅ gallery-data.js created successfully!');