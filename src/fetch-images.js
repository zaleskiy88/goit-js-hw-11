const axios = require('axios').default;
const API_KEY = '27402135-07abda6b2694d48097ccb4094';
const BASE_URL = `https://pixabay.com/api/?key=`;

let page = 1;
let searchQueryStr = '';

export async function fetchImagesData(searchQuery) {
  searchQueryStr = searchQuery;

  page = 1;

  const dataResponse = await axios.get(
    `${BASE_URL}${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40`,
  );

  const data = await dataResponse.data;

  return data;
}

export async function fetchMoreImagesData(searchQuery) {
  page = searchQueryStr === searchQuery ? (page += 1) : (page = 1);

  const dataResponse = await axios.get(
    `${BASE_URL}${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`,
  );

  const data = await dataResponse.data;

  return data;
}
