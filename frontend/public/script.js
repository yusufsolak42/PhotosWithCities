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
      populateDropdown("genre", data.genres);
      populateDropdown("content", data.contents);
    })
    .catch((error) => console.error("Error loading JSON data:", error));
  loadPhotos(1); //first page when the dom is loaded
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
async function loadPhotos(page = 1) {
  // Get selected values from dropdowns
  const country = document.getElementById("country").value;
  const state = document.getElementById("state").value;
  const city = document.getElementById("city").value;
  const style = document.getElementById("style").value;
  const genre = document.getElementById("genre").value;
  const content = document.getElementById("content").value;

  // Build query parameters based on selected filters
  const queryParams = new URLSearchParams();
  if (country) queryParams.append("country", country);
  if (state) queryParams.append("state", state);
  if (city) queryParams.append("city", city);
  if (style) queryParams.append("style", style);
  if (genre) queryParams.append("genre", genre);
  if (content) queryParams.append("content", content);
  queryParams.append("page", page); // Add the page parameter

  // Fetch photos from the backend with applied filters
  const response = await fetch(`/api/photos?${queryParams.toString()}`);
  const data = await response.json(); // Parse JSON response

  // Get the photo gallery container
  const gallery = document.getElementById("photoGallery");
  gallery.innerHTML = ""; // Clear any existing photos

  // Display each photo in the gallery
  data.photos.forEach((photo) => {
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

  // Render pagination controls
  renderPaginationControls(data.totalPages, data.currentPage); //we render the buttons to click
}

// Function to render pagination controls
function renderPaginationControls(totalPages, currentPage) {
  const paginationDiv = document.getElementById("pagination");
  paginationDiv.innerHTML = ""; // Clear existing pagination controls
  // Previous button
  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.disabled = currentPage === 1; // Disable if on the first page
  prevButton.addEventListener("click", () => loadPhotos(currentPage - 1));
  paginationDiv.appendChild(prevButton);

  // Current page display
  const pageInfo = document.createElement("span");
  pageInfo.textContent = ` Page ${currentPage} of ${totalPages} `;
  pageInfo.style.margin = "0 10px"; // Add some margin for spacing
  paginationDiv.appendChild(pageInfo); // Add page info between the buttons

  // Next button
  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages; // Disable if on the last page if total page number is equal to current page
  nextButton.addEventListener("click", () => loadPhotos(currentPage + 1)); //when clicked, increase the currentpage number and load the photos again
  paginationDiv.appendChild(nextButton);
}

// Event listener for the "Apply Filters" button
async function applyFilters() {
  loadPhotos(1); // Reload the first page of photos with the applied filters
}

function toggleGenreDropDown() {
  const contentDropdown = document.getElementById("content");
  const genreDropdown = document.getElementById("genre");

  // Check if the selected value is 'movie'
  if (contentDropdown.value === "movie") {
    genreDropdown.disabled = false; // Enable genre dropdown
  } else {
    genreDropdown.disabled = true; // Disable genre dropdown
    genreDropdown.value = ""; // Reset genre selection
  }
}
