// backend/models/photo.js
const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  tags: [String]  // Tags for filtering
});

module.exports = mongoose.model('Photo', photoSchema);
