const API_SEARCH_MEAL_URL = 'https://themealdb.com/api/json/v1/1/search.php';
const API_MEAL_DETAIL = 'https://themealdb.com/api/json/v1/1/lookup.php';

const searchButton = document.getElementById('searchButton');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.mealDetailsContent');
const recipeCloseButton = document.getElementById('recipeCloseButton');


  //Function to transform a recipe object into a simplified format with only specific fields
function maprecipeItem(recipeObject) {
  return {
    name: recipeObject.strMeal,
    image: recipeObject.strMealThumb,
    id: recipeObject.idMeal,
  };
}


    //Function to extract recipe details
function maprecipeItemDetail(recipeObject) {
  return {
    name: recipeObject.strMeal,
    ingredients: convertIngredientResponseToArray(recipeObject),
    instructions: recipeObject.strInstructions,
    image: recipeObject.strMealThumb,
    videoLink: recipeObject.strYoutube,
  };
}


  //Function to processe a recipe object to extract its ingredients into an array
function convertIngredientResponseToArray(recipeObject) {
  const ingredientList = [];
  for (let i = 1; i <= 20; i++) {
    if (
      typeof recipeObject['strIngredient' + i] !== 'undefined' &&
      recipeObject['strIngredient' + i]
    ) {
      ingredientList.push(recipeObject['strIngredient' + i]);
    }
  }
  return ingredientList;
}


  // Event listener for pressing Enter key 
searchButton.addEventListener('click', getMealListApiCall);
document
  .getElementById('searchInput')
  .addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      getMealListApiCall();
    }
  });



    //Function to handle the process of fetching meal data from API
function getMealListApiCall() {
  const searchInputText = document
    .getElementById('searchInput')
    .value.trim()
    .toLowerCase();

  fetch(API_SEARCH_MEAL_URL + '?s=' + searchInputText)
    .then((response) => response.json())
    .then(function (data) {

      let responseMealList = [];

      if (data.meals && data.meals.length) {
        responseMealList = data.meals.map(function (recipeItem) {
          return maprecipeItem(recipeItem);
        });
      }

      displayMeals(responseMealList);
    });
}


    //Function to handle fetching and processing meal details from API
function getMealDetailApiCall(mealId) {
  fetch(API_MEAL_DETAIL + '?i=' + parseInt(mealId))
    .then((response) => response.json())
    .then(function (data) {
      if (data.meals && data.meals.length) {
        const mealDetail = maprecipeItemDetail(data.meals[0]);
        showRecipeDetails(mealDetail);
        return;
      }
    }
  );
}



            // Display meals
function displayMeals(recipes) {
  mealList.innerHTML = '';
  if (recipes.length === 0) {
    mealList.innerHTML = '<p class = "notFound">No recipes found with the given ingredients.</p>';
    return;
  }
  recipes.forEach((recipe) => {
    const mealItem = `
            <div class="mealItem">
                <div class="mealImg">
                    <img src="${recipe.image}" alt="${recipe.name}">
                </div>
                <div class="mealName">
                    <h3>${recipe.name}</h3>
                    <a href="#" class="recipeButton" onclick="getMealDetailApiCall('${recipe.id}')">Get Recipe</a>
                </div>
            </div>
        `;
    mealList.innerHTML += mealItem;
  });
}



          // Show recipe details (modal window)
function showRecipeDetails(mealDetail) {
  if (mealDetail) {
    mealDetailsContent.innerHTML = `
      <h2 class="recipeTitle">${mealDetail.name}</h2>
      <p class="recipeCategory">Ingredients: ${mealDetail.ingredients}</p>
      <div class="recipeMealImage">
          <img src="${mealDetail.image}" alt="${mealDetail.name}" loading="lazy">
      </div>
      <div class="recipeInstruct">
          <a href="${mealDetail.videoLink}" target="_blank" class="instructionLink">View full Video Recipe</a>
      </div>
      
       `;
    document.querySelector('.mealDetails').style.display = 'block';
  }
}



        // Close recipe details
recipeCloseButton.addEventListener('click', () => {
  document.querySelector('.mealDetails').style.display = 'none';
});


      // Hamburger menu 

 const hambMenu = document.querySelector('.hamburgerMenu');
 const navbar = document.querySelector('.navbar');
 
 hambMenu.addEventListener('click', () => {
     hambMenu.classList.toggle('active');
     navbar.classList.toggle('active');
 })