// This script extracts the original 'flip-card' elements from 'gallery.html' and produces a .json file (flip-card-data.json) which is used to build the new 'flip-card' elements for PhotoPages.html.

const fs = require('fs');
const { JSDOM } = require('jsdom');
const path = require('path');

// Load gallery.html
const htmlContent = fs.readFileSync('./js/gallery.html', 'utf8');
const dom = new JSDOM(htmlContent);
const document = dom.window.document;

// Extract flip-card data
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

// Convert to JSON and write to file
const outputPath = path.join(process.cwd(), 'flip-card-data.json');
fs.writeFileSync(outputPath, JSON.stringify(flipCards, null, 2), 'utf8');

console.log('✅ flip-card-data.json created successfully at:', outputPath);