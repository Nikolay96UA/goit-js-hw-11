import './css/styles.css';
import { PhotoApiService } from './FetchPhoto';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const photoApiService = new PhotoApiService();

const refs = {
  form: document.querySelector('form'),
  searchInput: document.querySelector('input'),
  searchBtn: document.querySelector('button'),
  boxInfo: document.querySelector('.gallery'),
};

refs.searchBtn.addEventListener('click', onSubmit);

function handleScroll(ev) {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    fetchPhotoCard();
    onShow(ev);
  }
}

window.addEventListener('scroll', handleScroll);

function onSubmit(e) {
  e.preventDefault();

  const searchValue = refs.searchInput.value;
  photoApiService.query = searchValue.trim();

  photoApiService.resetPage();
  clearGallery();
  fetchPhotoCard();
}

async function fetchPhotoCard() {
  try {
    const markup = await markupGallery();
    updateGallery(markup);
  } catch (error) {
    onError(error);
  }
}

async function markupGallery() {
  try {
    const { data } = await photoApiService.fetchPhoto().then(hits => hits);
    const hits = data.hits;
    const totalHit = data.totalHits;
    if (photoApiService.page === 2) {
      Notiflix.Notify.info(`Hooray! We found ${totalHit} images.`);
    }

    if (hits.length === 0) {
      throw new Error(
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        )
      );
    }

    if (photoApiService.page === 14) {
      Notiflix.Notify.failure(
        " We're sorry, but you've reached the end of search results."
      );
      return;
    }
    return hits.reduce((markup, hit) => markup + renderPhotoCard(hit), '');
  } catch (error) {
    onError(error);
  }
}

function renderPhotoCard({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `      
      <div class="photo-card">
      <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy"></a>
        <div class="info">
          <p class="info-item">
          <span>${likes}</span>
            <b>Likes</b>
          </p>
          <p class="info-item">
          <span>${views}</span>
            <b>Views</b>
          </p>
          <p class="info-item">
          <span>${comments}</span>
            <b>Comments</b>
          </p>
          <p class="info-item">
          <span>${downloads}</span>
            <b>Downloads</b>
          </p>
        </div>
      </div>`;
}

function updateGallery(markup) {
  if (markup !== undefined)
    refs.boxInfo.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  refs.boxInfo.innerHTML = '';
}

function onError(err) {
  console.error(err);
  clearGallery();
  updateGallery(
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    )
  );
}

refs.boxInfo.addEventListener('click', onShow);

function onShow(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }

  const lightbox = new SimpleLightbox('.gallery  a');
  lightbox.refresh();

  refs.boxInfo.removeEventListener('click', onShow);
}
