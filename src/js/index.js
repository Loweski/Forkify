// Global app controller
// dd5e645bbb83f801cbd3d48abcd7926b
// https://www.food2fork.com/api/search
import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements} from './views/base';

/*Global State of the app
  -Seach object
  -Current recipe object
  -Shopping list object
  -Liked recipes
*/
const state = {};

const controlSearch = async () => {
  // 1. Get Query from view
  const query = searchView.getInput();
  console.log(query);
  if(query) {
    // 2. New search object and add to state
    state.search = new Search(query);

    // 3. Prepare UI for results (loading spinner)
    searchView.clearInput();
    searchView.clearResults();

    // 4. Search for recipes
    await state.search.getResults();

    // 5. Render results on UI (only after we get results)
    searchView.renderResults(state.search.result);
  }
}

elements.searchForm.addEventListener('submit', e=> {
  e.preventDefault();
  controlSearch();
});
