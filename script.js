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

  // Checks for empty search term and fetches data if there is input.
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}
      `)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultsHeading.innerHTML = `<h2>Search results for "${term}":</h2>`;

        if (data.meals === null) {
          resultsHeading.innerHTML = `<p>There are no search results for "${term}". Please try again.</p>`;
        } else {
          mealsElement.innerHTML = data.meals
            .map(
              (meal) => `<div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
                </div>
            </div>`
            )
            .join("");
        }
      });
    // Clears search text.
    search.value = "";
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
