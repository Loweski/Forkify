// Global app controller
// dd5e645bbb83f801cbd3d48abcd7926b
// https://www.food2fork.com/api/search
import Search from './models/Search';

/*Global State of the app
  -Seach object
  -Current recipe object
  -Shopping list object
  -Liked recipes
*/
const state = {};

const controlSearch = async () => {
  // 1. Get Query from view
  const query = 'pizza' //// TODO: Replace placeholder data for actual query
  if(query) {
    // 2. New search object and add to state
    state.search = new Search(query);

    // 3. Prepare UI for results (loading spinner)

    // 4. Search for recipes
    await state.search.getResults();

    // 5. Render results on UI (only after we get results)
    console.log(state.search.result); // TODO: Replace with UI method.
  }
}

document.querySelector('.search').addEventListener('submit', e=> {
  e.preventDefault();
  controlSearch();
});
