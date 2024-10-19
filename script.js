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
    search.placeholder = "Search a meal to find matching recipes...";
  }
};

// Call the updatePlaceholder function on load and resize.
window.addEventListener("load", updatePlaceholder);
window.addEventListener("resize", updatePlaceholder);

// Function to search meal and fetch results from TheMealDB API.
const searchMeal = (event) => {
  event.preventDefault();

  // Clears the single meal.
  singleMealElement.innerHTML = "";

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
              (meal) => `<div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
                </div>
            </div>`
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
addMealToDOM = (meal) => {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMealElement.innerHTML = `
        <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
        <h2>Category</h2>
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        </div>
        <h2>Cuisine</h2>
        <div class="single-meal-info">
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
        </div>
        <div class="main">
        <h2>Instructions</h2>
            <div class="instructions">
            <p>${meal.strInstructions.replace(/\./g, ".<br/>")}</p>
            </div>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients
                  .map((ingredient) => `<li>${ingredient}</li>`)
                  .join("")}
            </ul>
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
