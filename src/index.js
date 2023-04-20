import './css/styles.css';
import { PhotoApiService } from './FetchPhoto';
import Notiflix from 'notiflix';

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
    fetchPhoto();
  }
}

window.addEventListener('scroll', handleScroll);

function onSubmit(e) {
  e.preventDefault();

  const searchValue = refs.searchInput.value;
  photoApiService.query = searchValue.trim();

  photoApiService.resetPage();
  clearGallery();
  fetchPhoto();
}

async function fetchPhoto() {
  try {
    const markup = await markupGallery();
    updateGallery(markup);
  } catch (err) {
    onError(err);
  }
}

async function markupGallery() {
  try {
    const { hits } = await photoApiService.fetchPhoto();
    if (hits.length === 0)
      throw new Error(
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        )
      );
    return hits.reduce((markup, hits) => markup + renderPhotoCard(hits), '');
  } catch (error) {
    if (error) {
      console.error(error);
    }
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
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
  updateGallery('<p>Not found!</p>');
}
