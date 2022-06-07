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
// powerpoint
// img corners rounded
// index .html page all of it
// additional color changes to text
// changing price color to refelct a high price or a low price
// clean up code and add comments
// read me
// portfolio questions
// card title text too long, causing alignment issues.
// card spacing too big



//https://www.themealdb.com/api.php without format
// http://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast with format
// https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata by name
// https://api.spoonacular.com/food/products/{id}
// https://api.spoonacular.com/food/ingredients/search


var searchResultsEl = document.querySelector('#search-results');
var userSearch = document.querySelector('#user-search');
var searchBtn = document.querySelector('#search-button');
var searchHistory = document.querySelector('#search-history');
var notFound = document.querySelector('#not-found');
var avgPrice = document.querySelector('#price');
var checkEl = document.querySelector('#flexCheckDefault');


function getId(foodItem){
    var ingredient = foodItem;

    var idApi =`https://api.spoonacular.com/food/ingredients/search?query=${ingredient}&apiKey=03919bc242a04398b67fc175ce89ad98`;
    
    fetch(idApi)
        .then(function (response) {
            return response.json();
        })
        .then(function(data){
            var id = data.results[0].id;
            getPrice(ingredient, id);
        })
}

function getPrice(ingredient, id){
    var priceApi = `https://api.spoonacular.com/recipes/${id}/priceBreakdownWidget.json?apiKey=03919bc242a04398b67fc175ce89ad98`

    fetch(priceApi)
        .then(function (response) {
            return response.json();
        })
        .then(function(data){
            var price = parseInt(data.totalCostPerServing) /100;
            displayPrice(ingredient, price);
        })
}

function displayPrice(ingredient, price) {
    avgPrice.innerHTML = null;

    var priceEl = document.createElement('p');
    var spanEl = document.createElement('span');
    priceEl.className = 'text-center';
    

    if (!price) {
        priceEl.textContent = 'Sorry, price not found.';
    } else {
        priceEl.textContent = `The Average Price of ${ingredient} Per Serving is: `;
        spanEl.textContent = '$' + price;
        priceEl.append(spanEl);
    }

    avgPrice.append(priceEl);
}

function getRecipe() {
    var foodItem = userSearch.value.trim();

    var recipeApi = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${foodItem}`;

    fetch(recipeApi)
        .then(function (response) {
            if (response.ok) {
                return response.json();
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
        .catch(function(err){
            console.log(err);
        })
};

function displayResults(data) {
    searchResultsEl.innerHTML = null;
    avgPrice.innerHTML = null;

    // so i had to change the article classs to card-body. which looking at it now is the same class for 
    // our cardEl may not be an issue just typing and seeing lol
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
        titleEl.href = `https://www.themealdb.com/meal/${idNum}-${titleEl.textContent}`

        cardEl.append(titleEl);
        articleEl.append(cardEl, imgEl);
        searchResultsEl.append(articleEl);
    }

    displayHistory();
}
// https://www.themealdb.com/meal/53060-Burek-Recipe
function recipeLink() {

}

function saveSearch(foodItem) {
    var recentSearch = JSON.parse(localStorage.getItem('foodHistory')) || [];
    if (!recentSearch.includes(foodItem)) {
        recentSearch.push(foodItem);
    }

    localStorage.setItem('foodHistory', JSON.stringify(recentSearch));
    displayHistory();
}

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

function init() {
    displayHistory();
}



searchBtn.addEventListener('click', getRecipe);

searchHistory.addEventListener('click', function (event) {
    var button = event.target;
    var foodItem = button.textContent;
    var recipeApi = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${foodItem}`;

    if (foodItem === 'Clear History') {
        searchHistory.innerHTML = null;
        localStorage.clear();
        return;
    }

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
