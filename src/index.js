import './css/styles.css';
import Notiflix from 'notiflix';
import createMarkUp from './mark-up';
import GalleryApiService from './gallery';

const galleryApiService = new GalleryApiService();

const formRef = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const galleryRef = document.querySelector('div.gallery');

formRef.addEventListener('submit', onSearchSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreClick);

async function onSearchSubmit(e) {
  e.preventDefault();
  galleryRef.innerHTML = '';
  loadMoreBtn.classList.remove('is-seen');
  galleryApiService.page = 1;
  const inputValue = e.currentTarget.elements.searchQuery.value.trim();
  galleryApiService.searchQuery = inputValue;
  try {
    if (inputValue) {
      const articles = await galleryApiService.fetchArticles();
      createMessageOutput(articles);
      createMarkUp(articles.data.hits, galleryRef);
      if (articles.data.totalHits > 40) {
        loadMoreBtn.classList.add('is-seen');
      }
    }
  } catch (error) {}
}

async function onLoadMoreClick() {
  try {
    const articles = await galleryApiService.fetchArticles();
    createMarkUp(articles.data.hits, galleryRef);
    scrollPageDown();
    createMessageOutput(articles);
  } catch (error) {}
}

function createMessageOutput(articles) {
  const allArticles = document.querySelectorAll('.photo-card');
  if (!articles.data.total) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if (!loadMoreBtn.classList.contains('is-seen')) {
    return Notiflix.Notify.success(
      `Hooray! We found ${articles.data.totalHits} images.`
    );
  }
  if (articles.data.totalHits <= allArticles.length) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    loadMoreBtn.classList.remove('is-seen');
  }
}

function scrollPageDown() {
  const { height: cardHeight } =
    galleryRef.firstElementChild.getBoundingClientRect();

  return window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
