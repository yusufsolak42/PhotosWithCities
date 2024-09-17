// Import necessary modules
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Photo = require('./backend/models/photo');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/photoDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Initialize keywords array
let keywords = [];

// Load keywords from JSON file
fs.readFile('keywords.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading keywords file:', err);
    return;
  }

  keywords = JSON.parse(data).keywords || [];
  console.log('Keywords loaded:', keywords);

  // Start processing the 'photos' directory
  processFolder('photos');
});

/**
 * Recursively process a folder and its subfolders to save photos to MongoDB.
 * @param {string} folderPath - The path of the folder to process.
 */
async function processFolder(folderPath) {
  try {
    const items = fs.readdirSync(folderPath);

    for (const item of items) {
      const itemPath = path.join(folderPath, item);

      if (fs.statSync(itemPath).isDirectory()) {
        await processFolder(itemPath);
      } else if (/\.(jpg|jpeg|png|gif|bmp)$/i.test(item)) {
        const tags = keywords.filter(keyword => item.toLowerCase().includes(keyword));

        const photo = new Photo({
          fileName: item,
          filePath: itemPath,
          tags: tags
        });

        await photo.save();
        console.log(`Photo saved: ${item} with tags: ${tags.join(', ')}`);
      }
    }
  } catch (err) {
    console.error('Error processing folder:', folderPath, err);
  } 
}
