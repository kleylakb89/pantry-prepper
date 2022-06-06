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



var searchResultsEl = document.querySelector('#search-results');
var userSearch = document.querySelector('#user-search');
var searchBtn = document.querySelector('#search-button');


function getRecipe() {
    var foodItem = userSearch.value.trim();

    var recipeApi = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast';

    fetch(recipeApi)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    })
};
    
function init() {
        
 }
    
    
    
    
    
searchBtn.addEventListener('click', getRecipe);

init();