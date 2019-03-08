// Global app controller
// dd5e645bbb83f801cbd3d48abcd7926b
// https://www.food2fork.com/api/search
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes'
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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

  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected recipe
    if(state.search) searchView.highlightSelected(id);

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
      //console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
      );
    } catch (err) {
      alert(err.name); // ReferenceError
      alert(err.message); // something is not defined
      console.log(err.stack);
    }



  }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//List Controller
const controlList = () => {
  // Create a new list if no list
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e=> {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')){
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);

  } else if (e.target.matches('shopping__count-value')) {
    //update ingredient value
    const val = parseFloat(e.target.value); // TODO: Fix updaing value
    state.list.updateCount(id, val);
  }
});

// Like Controller
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  if (!state.likes.isLiked(currentID)){
    //User hasn't liked current recipe

    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // Toggle the like button
    likesView.toggleLikeBtn(true);

    // Add like to UI list
    likesView.renderLike(newLike);

  } else {
    //User has liked the current recipe
    state.likes.deleteLike(currentID);
    // Toggle the like button
    likesView.toggleLikeBtn(false);

    // Remove like from UI list
    likesView.deleteLike(currentID);

  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
}

// Restore liked recipes on page load from localStorage
window.addEventListener('load', () => {
  state.likes = new Likes();

  //Restore likes
  state.likes.readStorage();

  // TOggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render existing likes (if applicable)
  state.likes.likes.forEach(like => likesView.renderLike(like));
})

// Handling recipe button clicks
elements.recipe.addEventListener('click', e=> {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // Add ingredients to list
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like Controller
    controlLike();
  }
  //console.log(state.recipe);
});
