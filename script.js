// DOM Elements.
const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  reset = document.getElementById("reset"),
  mealsElement = document.getElementById("meals"),
  resultsHeading = document.getElementById("results-heading"),
  singleMealElement = document.getElementById("single-meal");

// Function to update the placeholder text based on screen width.
const updatePlaceholder = () => {
  if (window.innerWidth <= 500) {
    search.placeholder = "Search for a meal...";
  } else {
    search.placeholder = "Find a recipe...";
  }
};

// Call the updatePlaceholder function on load and resize.
window.addEventListener("load", updatePlaceholder);
window.addEventListener("resize", updatePlaceholder);

// Function to search meal and fetch results from TheMealDB API.
const searchMeal = (event) => {
  event.preventDefault();

  // Clears the results and single meal display.
  mealsElement.innerHTML = "";
  singleMealElement.innerHTML = "";
  resultsHeading.innerHTML = "";

  // Gets the search term and loader.
  const term = search.value;
  const loader = document.querySelector(".loader");

  // Checks for empty search term and fetches data if there is input.
  if (term.trim()) {
    if (loader) loader.style.display = "block";

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}
      `)
      .then((res) => res.json())
      .then((data) => {
        resultsHeading.innerHTML = `<h2>Search results for "${term}":</h2>`;

        if (data.meals === null) {
          resultsHeading.innerHTML = `<h2>There are no search results for "${term}". Please try again.</h2>`;
        } else {
          mealsElement.innerHTML = data.meals
            .map(
              (
                meal,
              ) => `<div class="meal meal-info" data-mealID="${meal.idMeal}">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class="meal-card">
                <h3>${toTitleCase(meal.strMeal)}</h3>
                </div>
            </div>`,
            )
            .join("");
        }
      })
      .finally(() => {
        if (loader) loader.style.display = "none";
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

// Function to fetch the meal by ID.
getMealByID = (mealID) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}
    `)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
      scrollToMeal();
    });
};

// Function to fetch random meal from The Meal DB API.
getRandomMeal = () => {
  // Clears meals from DOM and removes any headings.
  mealsElement.innerHTML = "";
  resultsHeading.innerHTML = "";
  singleMealElement.innerHTML = "";

  // Gets and displays loader.
  const loader = document.querySelector(".loader");
  if (loader) loader.style.display = "block";

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php
    `)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    })
    .finally(() => {
      if (loader) loader.style.display = "none";
    });
};

// Function to add meal to DOM.
const addMealToDOM = (meal) => {
  const singleMeal = document.getElementById("single-meal");

  const ingredients = [];

  // Collect up to 20 ingredients and their measures
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient) {
      ingredients.push(formatIngredient(measure, ingredient));
    } else {
      break;
    }
  }

  singleMeal.innerHTML = `
    <div class="single-meal">
      <h2>${toTitleCase(meal.strMeal)}</h2>
      <div class="single-meal-wrapper">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="meal-details">
        <div class="category">
            <h3>Category</h3>
            <p>${meal.strCategory}</p>
          </div>
          <div class="cuisine">
            <h3>Cuisine</h3>
            <p>${meal.strArea}</p>
          </div>          
          <div class="ingredients">
            <h3>Ingredients</h3>
            <ul class="ingredients-list">
              ${ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
      <hr class="section-divider" />
      <div class="instructions">
        <h3>Instructions</h3>
        <p>${meal.strInstructions}</p>
      </div>
    </div>
  `;
};

scrollToMeal = () => {
  singleMealElement.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

// Event listener for the submit button to search meals.
submit.addEventListener("submit", searchMeal);

// Event listener for the random button to get a random meal.
random.addEventListener("click", getRandomMeal);

// Event listener for the meal element to retrieve more information.
mealsElement.addEventListener("click", (event) => {
  const mealInfo = event.target.closest(".meal-info");

  // Checks for the meal's ID.
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealByID(mealID);
  }
});

// Function to reset and clear the page.
const resetSearch = () => {
  search.value = "";

  // Clears the results and single meal display.
  mealsElement.innerHTML = "";
  singleMealElement.innerHTML = "";
  resultsHeading.innerHTML = "";

  const notification = document.getElementById("snackbar");
  notification.className = "";
};

// Event listener for the reset button to clear the page.
reset.addEventListener("click", resetSearch);

// Function to convert a string to title case.
const toTitleCase = (str) => {
  const smallWords =
    /^(a|an|and|as|at|but|by|for|in|nor|of|on|or|so|the|to|up|with)$/i;

  return str
    .toLowerCase()
    .split(/(\s+|\(|\))/) // Split by spaces and parentheses but keep them
    .map((word, index, arr) => {
      // Skip empty strings or pure whitespace.
      if (!word.trim()) return word;

      // Always capitalize the first word or words after parentheses.
      const prevWord = arr[index - 1];
      const isStart = index === 0 || prevWord === "(";

      // If it's not a small word or if it's the start of the title or inside parentheses, capitalize it.
      if (isStart || !smallWords.test(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }

      // Otherwise, lowercase it.
      return word;
    })
    .join("");
};

// Function to format an ingredient's measure and name.
const formatIngredient = (measure, ingredient) => {
  if (!measure && !ingredient) return "";

  const trimmedMeasure = measure.trim();
  const trimmedIngredient = ingredient.trim();

  return `${trimmedMeasure} ${trimmedIngredient}`.toLowerCase();
};
