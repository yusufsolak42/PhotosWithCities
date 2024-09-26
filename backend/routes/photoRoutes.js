const express = require("express");
const Photo = require("../models/photo");
const router = express.Router();

// Route to get photos with various filters
router.get("/photos", async (req, res) => {
  // Extract filter parameters from the query string
  const {
    city,
    state,
    style,
    country,
    genre,
    content,
    page = 1,
    limit = 12,
  } = req.query;

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
  if (genre) filterConditions.push({ tags: genre });
  if (content) filterConditions.push({ tags: content });

  // If there are conditions, use $and to combine them
  let query = {};
  if (filterConditions.length > 0) {
    query.$and = filterConditions;
  }

  try {
    //number of photos match the query
    const totalPhotos = await Photo.countDocuments(query);
    // Find photos that match the query
    const photos = await Photo.find(query)
      .skip((page - 1) * limit) //where the pagination logic is applied
      .limit(parseInt(limit)); //limit the number of photos to present
    res.json({
      photos,
      totalPhotos,
      totalPages: Math.ceil(totalPhotos / limit), // total pages based on limit (10 per page)
      currentPage: parseInt(page), // current page number
    }); // Send the filtered photos as JSON response
  } catch (err) {
    res.status(500).json({ error: err.message }); // Send error response if something goes wrong
    console.log(err);
  }
});

module.exports = router; // Export the router
