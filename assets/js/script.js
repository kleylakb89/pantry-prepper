// format html file 
// query select elements
// define variables for searched elements
// function for price fetch requests.. add catch and prevent default 
// function for recipe fetch requests.. add catch and prevent default 
// init function
// event listeners to run functions
// moment for expiration dates
// local storage to save searched ingredients
// modal for null searches
// no results found for bad searches
// running total of prices in local storage
//*Challenges* - workflow, element postioning, appending modal when users search is not found.!!!!! (thank you, Sashaaaaaa)

// updated to do list:
// index .html page all of it **
// clean up code and add comments **
// read me **
// powerpoint **
// portfolio questions
// img corners rounded
// changing price color to refelct a high price or a low price
// scatter search history buttons
// media queries for responsive layout



//https://www.themealdb.com/api.php without format
// http://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast with format
// https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata by name
// https://api.spoonacular.com/food/products/{id}
// https://api.spoonacular.com/food/ingredients/search

//declaring our global variables
var searchResultsEl = document.querySelector('#search-results');
var userSearch = document.querySelector('#user-search');
var searchBtn = document.querySelector('#search-button');
var searchHistory = document.querySelector('#search-history');
var notFound = document.querySelector('#not-found');
var avgPrice = document.querySelector('#price');
var checkEl = document.querySelector('#flexCheckDefault');
var randomState = document.querySelector('#random-state');
var resultsState = document.querySelector('#results-state');

//function for getting the ingredient results of the food item searched
function getId(foodItem) {
    var ingredient = foodItem;

    var idApi = `https://api.spoonacular.com/food/ingredients/search?query=${ingredient}&apiKey=03919bc242a04398b67fc175ce89ad98`;

    fetch(idApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var id = data.results[0].id;
            getPrice(ingredient, id);
        })
}

//function for getting the price results of the food item searched
function getPrice(ingredient, id) {
    var priceApi = `https://api.spoonacular.com/recipes/${id}/priceBreakdownWidget.json?apiKey=03919bc242a04398b67fc175ce89ad98`

    fetch(priceApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var price = parseInt(data.totalCostPerServing) / 100;
            displayPrice(ingredient, price);
        })
}

//this function displays the price of the ingredients to our page
function displayPrice(ingredient, price) {
    avgPrice.innerHTML = null;

    var priceEl = document.createElement('p');
    var spanEl = document.createElement('span');
    priceEl.className = 'text-center';

    //if there is no price found it will display this message
    if (!price) {
        priceEl.textContent = 'Sorry, price not found.';
        //if there is a price found it will display it in this message
    } else {
        priceEl.textContent = `The Average Price of ${ingredient} Per Serving is: `;
        spanEl.textContent = '$' + price;
        priceEl.append(spanEl);
    }

    avgPrice.append(priceEl);
}

//this will be the function that gets the recipe for the food that the user searches for
function getRecipe() {
    var foodItem = userSearch.value.trim();

    var recipeApi = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${foodItem}`;

    randomState.style.display = 'none';

    resultsState.style.display = 'block';

    fetch(recipeApi)
        .then(function (response) {
            if (response.ok) {
                return response.json();
                //if there is no recipe for what is typed in then the user will get this modal message
            } else {
                document.querySelector('.modal-button').click();
                return;
            }
        })
        .then(function (data) {
            if (data.meals !== null) {
                if (checkEl.checked) {
                    getId(foodItem);
                    displayResults(data);
                    saveSearch(foodItem);
                } else {
                    displayResults(data);
                    saveSearch(foodItem);
                }
            } else {
                document.querySelector('.modal-button').click();
                return;
            }
        })
        .catch(function (err) {
        })
};

//this function displays the search results in cards containing an image and the title of the meal
function displayResults(data) {
    searchResultsEl.innerHTML = null;
    avgPrice.innerHTML = null;

    for (var i = 0; i < data.meals.length; i++) {
        var articleEl = document.createElement('article');
        articleEl.className = 'card-body display-card w-25 p-4';

        var imgEl = document.createElement('img');
        imgEl.className = 'card-img-top m-1 recipe-img';

        var cardEl = document.createElement('div');
        cardEl.className = 'card-body';

        var titleEl = document.createElement('a');
        titleEl.className = 'card-title';

        var idNum = data.meals[i].idMeal;

        imgEl.src = data.meals[i].strMealThumb;
        titleEl.textContent = data.meals[i].strMeal;

        cardEl.append(titleEl);

        titleEl.href = `https://www.themealdb.com/meal/${idNum}-${titleEl.textContent}`

        articleEl.append(cardEl, imgEl);
        searchResultsEl.append(articleEl);
    }

    displayHistory();
}

//pushing images from themealdb API 
function carouselImage() {
    var slide1El = document.querySelector('#slide1');
    var slide2El = document.querySelector('#slide2');
    var slide3El = document.querySelector('#slide3');
    var slide1Title = document.querySelector('#slide1Title');
    var slide2Title = document.querySelector('#slide2Title');
    var slide3Title = document.querySelector('#slide3Title');
    var imgApi = 'https://www.themealdb.com/api/json/v1/1/random.php';

    //referencing one of the formatted pages of one of the API's we used
    // titleEl.href = `https://www.themealdb.com/meal/${idNum}-${titleEl.textContent}`

    fetch(imgApi)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                slide1El.alt = 'image not found';
                return;
            }
        })
        .then(function (data) {
            slide1El.src = data.meals[0].strMealThumb;
            slide1Title.textContent = data.meals[0].strMeal;
            var idNum = data.meals[0].idMeal;
            slide1Title.href = `https://www.themealdb.com/meal/${idNum}-${slide1Title.textContent}`
        });
    fetch(imgApi)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                slide2El.alt = 'image not found';
                return;
            }
        })
        .then(function (data) {
            slide2El.src = data.meals[0].strMealThumb;
            slide2Title.textContent = data.meals[0].strMeal;
            var idNum = data.meals[0].idMeal;
            slide2Title.href = `https://www.themealdb.com/meal/${idNum}-${slide2Title.textContent}`
        });
    fetch(imgApi)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                slide3El.alt = 'image not found';
                return;
            }
        })
        .then(function (data) {
            slide3El.src = data.meals[0].strMealThumb;
            slide3Title.textContent = data.meals[0].strMeal;
            var idNum = data.meals[0].idMeal;
            slide3Title.href = `https://www.themealdb.com/meal/${idNum}-${slide3Title.textContent}`
        });

}
//this function is saving the users search history into local storage
function saveSearch(foodItem) {
    var recentSearch = JSON.parse(localStorage.getItem('foodHistory')) || [];
    if (!recentSearch.includes(foodItem)) {
        recentSearch.push(foodItem);
    }

    localStorage.setItem('foodHistory', JSON.stringify(recentSearch));
    displayHistory();
}
//this will display the saved search history from local storage onto the page as well as display a clear search history button
function displayHistory() {
    var recentSearch = JSON.parse(localStorage.getItem('foodHistory')) || [];

    searchHistory.innerHTML = null;
    avgPrice.innerHTML = null;

    for (var food of recentSearch) {
        var historyBtn = document.createElement('button');
        historyBtn.className = 'past-search col-12 col-md-6 col-lg-3';
        historyBtn.textContent = food;
        searchHistory.append(historyBtn);
    }
    var clearBtn = document.createElement('button');
    // made it red
    clearBtn.className = 'clear-button col-12 col-md-6 col-lg-3'
    clearBtn.textContent = 'Clear History';
    searchHistory.append(clearBtn);
}
//initial function that will start us at the random-state which is our homepage and hides the results state which
//will only display when the user searches
function init() {
    displayHistory();
    carouselImage();
    resultsState.style.display = 'none'
}


//event listener that calls the getRecipe function when the search button is clicked
searchBtn.addEventListener('click', getRecipe);

//event for if the user clicks on any of the previously searched recipes displayed on the screen
searchHistory.addEventListener('click', function (event) {
    var button = event.target;
    var foodItem = button.textContent;
    var recipeApi = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${foodItem}`;
//if the user clicks the clear history button then the user will be taken back to the homepage with random recipes
    if (foodItem === 'Clear History') {
        searchHistory.innerHTML = null;
        localStorage.clear();
        resultsState.style.display = 'none';
        randomState.style.display = 'block';
        return;
    }
//if the user clicks on any of the previously searched recipes displayed on the screen then they will be brought back to 
//the same screen that would show up if they would have searched it in the search bar.
    fetch(recipeApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (checkEl.checked) {
                getId(foodItem);
                displayResults(data);
            } else displayResults(data);
        })
})


init();
