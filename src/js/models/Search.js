import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults(query) {

    //This is my key, you have to use your own 
    const key = 'dd5e645bbb83f801cbd3d48abcd7926b';
    try{
      const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = res.data.recipes;
      // console.log(this.result);
    } catch (error){
      alert(error);
    }

  }
}
