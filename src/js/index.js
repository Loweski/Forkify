// Global app controller
// dd5e645bbb83f801cbd3d48abcd7926b
// https://www.food2fork.com/api/search
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';

/*Global State of the app
  -Seach object
  -Current recipe object
  -Shopping list object
  -Liked recipes
*/
const state = {};

//Search Controller
const controlSearch = async () => {
  // 1. Get Query from view
  const query = searchView.getInput();
  //const query = 'pizza';
  console.log(query);
  if(query) {
    // 2. New search object and add to state
    state.search = new Search(query);

    // 3. Prepare UI for results (loading spinner)
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResults);

    try {
      // 4. Search for recipes
      await state.search.getResults();

      // 5. Render results on UI (only after we get results)
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert('Something went wrong with the search...');
      clearLoader();
    }

  }
}

elements.searchForm.addEventListener('submit', e=> {
  e.preventDefault();
  controlSearch();
});

//Event delegation
elements.searchResultPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
    console.log(goToPage);
  }
})

// Recipe Controller
const controlRecipe = async () => {
  // get id of current recipe from url
  const id = window.location.hash.replace('#', '');
  console.log(id);

  if (id) {
    // Prepare UI for changes

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe
      console.log(state.recipe);
    } catch (error) {
      alert('Error processing recipe.');
    }



  }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
