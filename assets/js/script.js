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
//*Challenges* - workflow, 

//https://www.themealdb.com/api.php without format
// http://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast with format
// https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata by name


var searchResultsEl = document.querySelector('#search-results');
var userSearch = document.querySelector('#user-search');
var searchBtn = document.querySelector('#search-button');
var searchHistory = document.querySelector('#search-history');


function getRecipe() {
    var foodItem = userSearch.value.trim();

    var recipeApi = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${foodItem}`;

    fetch(recipeApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayResults(data);
            saveSearch(foodItem);
            console.log(data);
        })
};

function displayResults(data) {
    //     <div class="card" id="display-card" style="width: 18rem;">
    //     <img src="..." class="card-img-top" alt="...">
    //     <div class="card-body">
    //       <h5 class="card-title">Card title</h5>
    //       <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    //       <a href="#" class="btn btn-primary">Go somewhere</a>
    //       <h5 class="card-title">Price</h5>
    //       <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    //     </div>
    //   </div> 
    searchResultsEl.innerHTML = null;

    for (var i = 0; i < data.meals.length; i++) {
        var articleEl = document.createElement('article');
        articleEl.className = 'card display-card w-25';

        var imgEl = document.createElement('img');
        imgEl.className = 'card-img-top';

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

function displayHistory(){
    var recentSearch = JSON.parse(localStorage.getItem('foodHistory')) || [];
    
    searchHistory.innerHTML = null;
    
    for(var food of recentSearch){
        var historyBtn = document.createElement('button');
        historyBtn.className = 'past-search';
        historyBtn.textContent = food;
        searchHistory.append(historyBtn);
    }
    var clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear History';
    searchHistory.append(clearBtn);
}

function init() {
    displayHistory();
}



searchBtn.addEventListener('click', getRecipe);

searchHistory.addEventListener('click', function(event){
    var button = event.target;
    var foodItem = button.textContent;
    var recipeApi = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${foodItem}`;

    if(foodItem === 'Clear History') {
        searchHistory.innerHTML = null;
        localStorage.clear();
        return;
    }

    fetch(recipeApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayResults(data)
        })
})


init();
