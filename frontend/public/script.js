// This runs when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Fetch data from the JSON file
  fetch("data.json")
    .then((response) => response.json()) // Convert response to JSON
    .then((data) => {
      // Populate each dropdown with options from JSON
      populateDropdown("country", data.countries);
      populateDropdown("state", data.states);
      populateDropdown("city", data.cities);
      populateDropdown("style", data.styles);
    })
    .catch((error) => console.error("Error loading JSON data:", error));
});

// Function to populate dropdowns with options
function populateDropdown(id, options) {
  const select = document.getElementById(id); // Get the dropdown element by id
  options.forEach((option) => {
    const opt = document.createElement("option"); // Create a new option element
    opt.value = option; // Set the option's value
    opt.textContent = option.replace(/-/g, " ").toUpperCase(); // Format option text
    select.appendChild(opt); // Add the option to the dropdown
  });
}

// Function to apply selected filters and load photos
async function applyFilters() {
  // Get selected values from dropdowns
  const country = document.getElementById("country").value;
  const state = document.getElementById("state").value;
  const city = document.getElementById("city").value;
  const style = document.getElementById("style").value;

  // Build query parameters based on selected filters
  const queryParams = new URLSearchParams();
  if (country) queryParams.append("country", country);
  if (state) queryParams.append("state", state);  
  if (city) queryParams.append("city", city);
  if (style) queryParams.append("style", style);

  // Fetch photos from the backend with applied filters
  const response = await fetch(`/api/photos?${queryParams.toString()}`);
  const photos = await response.json(); // Parse JSON response

  // Get the photo gallery container
  const gallery = document.getElementById("photoGallery");
  gallery.innerHTML = ""; // Clear any existing photos 
  

  // Display each photo in the gallery
  photos.forEach((photo) => {
    const photoDiv = document.createElement("div"); // Create a container for the photo
    photoDiv.classList.add("photo"); // Add a CSS class for styling
    photoDiv.innerHTML = `
      <img src="${photo.filePath}" alt="${
      photo.fileName
    }"> <!-- Display photo image -->
      <p>Tags: ${photo.tags.join(", ")}</p> <!-- Display photo tags -->
    `;
    gallery.appendChild(photoDiv); // Add the photo container to the gallery
  });
}
