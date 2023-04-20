const URL = 'https://pixabay.com/api/';
const API_KEY = '35605207-c117f35bff793e16a667d50ae';

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

    // fetch(
    //   `${URL}/?key=${API_KEY}&q=${this.searchQuery}&${this.options}&per_page=40&page=${this.page}`
    // );

    const responseData = await fetchAPI.json();

    this.incrementPage();
    return responseData;
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
