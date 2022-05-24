import { fetchImagesData } from './fetch-images';
import { fetchMoreImagesData } from './fetch-images';
import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');
const lightBox = new SimpleLightbox('.gallery-large-photo-link');

let searchQueryValue = '';

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const { searchQuery } = event.target;

  gallery.innerHTML = '';
  searchQueryValue = searchQuery.value;

  loadMoreBtn.classList.add('is-hidden');

  if (searchQuery.value === '') {
    Notify.info('Insert search query');
    return;
  }

  try {
    const data = await fetchImagesData(searchQuery.value);

    if (data.hits.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');

      return;
    }
    if (data.hits.length > 10) {
      loadMoreBtn.classList.remove('is-hidden');
    }
    const markup = await galleryMarkup(data);

    lightBox.refresh();

    Notify.success(`Hooray! We found ${data.totalHits} images.`);

    return markup;
  } catch (error) {
    console.log('error :>> ', error);
  }
});

loadMoreBtn.addEventListener('click', async () => {
  try {
    const data = await fetchMoreImagesData(searchQueryValue);
    const totalHits = data.totalHits;

    if (data.hits.length === 0) {
      loadMoreBtn.classList.add('is-hidden');
      Notify.failure("We're sorry, but you've reached the end of search results.");
      return;
    }

    const markup = await galleryMarkup(data);

    lightBox.refresh();

    return markup;
  } catch (error) {
    if (error.request.status === 400) {
      loadMoreBtn.classList.add('is-hidden');
      Notify.failure("We're sorry, but you've reached the end of search results.");
    }
  }
});

async function galleryMarkup(data) {
  //
  const markup = await data.hits
    .map(image => {
      return `
<a href="${image.largeImageURL}" class="gallery-large-photo-link">
  <div class="photo-card">
   <div class="img-wrapper">
    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
   </div>
    <div class="info">
      <p class="info-item">
        <b>Likes: ${image.likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${image.views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${image.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${image.downloads}</b>
      </p>
    </div>
  </div>
</a>
  `;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}
