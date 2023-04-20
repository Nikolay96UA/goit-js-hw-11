const URL = 'https://pixabay.com/api/';
const API_KEY = '35613677-637eb3f4735367263dbdc9146';

const axios = require('axios/dist/browser/axios.cjs');

class PhotoApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  options = 'image_type=photo&orientation=horizontal&safesearch=true';

  async fetchPhoto() {
    const fetchAPI = await axios.get(
      `${URL}/?key=${API_KEY}&q=${this.searchQuery}&${this.options}&per_page=40&page=${this.page}`
    );
    // console.log(fetchAPI);
    // fetch(
    //   `${URL}/?key=${API_KEY}&q=${this.searchQuery}&${this.options}&per_page=40&page=${this.page}`
    // );

    // const data = await fetchAPI.json();
    // console.log(data);

    this.incrementPage();
    return fetchAPI;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

export { PhotoApiService };
