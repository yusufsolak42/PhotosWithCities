const express = require("express");
const Photo = require("../models/photo");
const router = express.Router();

// Route to get photos with various filters
router.get("/photos", async (req, res) => {
  // Extract filter parameters from the query string
  const { city, state, style, country } = req.query; 
  
  //same as =>
  // const city = req.query.city;
  // const state = req.query.state;
  // const style = req.query.style;
  // const country = req.query.country;

  // Initialize an array to hold the conditions for the $and operator
  let filterConditions = [];

  // Add each filter to the conditions array if provided
  if (city) filterConditions.push({ tags: city });
  if (state) filterConditions.push({ tags: state });
  if (style) filterConditions.push({ tags: style });
  if (country) filterConditions.push({ tags: country });

  // If there are conditions, use $and to combine them
  let query = {};
  if (filterConditions.length > 0) {
    query.$and = filterConditions;
  }

  try {
    // Find photos that match the query
    const photos = await Photo.find(query);
    res.json(photos); // Send the filtered photos as JSON response
  } catch (err) {
    res.status(500).json({ error: err.message }); // Send error response if something goes wrong
  }
});

module.exports = router; // Export the router
