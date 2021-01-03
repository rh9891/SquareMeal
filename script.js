// DOM Elements.
const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsElement = document.getElementById("meals"),
  resultsHeading = document.getElementById("results-heading"),
  singleMealElement = document.getElementById("single-meal");

// Function to search meal and fetch results from TheMealDB API.
searchMeal = (event) => {
  event.preventDefault();

  // Clears the single meal.
  singleMealElement.innerHTML = "";

  // Gets the search term
  const term = search.value;

  // Checks for empty search term.
  if (term.trim()) {
  } else {
    // Gets the snackbar.
    const notification = document.getElementById("snackbar");

    // Adds the "show" class to snackbar.
    notification.className = "show";

    // After 3 seconds, removes the show class from snackbar.
    setTimeout(() => {
      notification.className = notification.className.replace("show", "");
    }, 3000);
  }
};

// Event listeners.
submit.addEventListener("submit", searchMeal);
