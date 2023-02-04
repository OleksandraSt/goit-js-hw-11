import './css/styles.css';
import { fetchPictures } from './js/fetchPictures';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const endOfSearchText = document.querySelector('.gallery__text');

let query = '';
let page = 1;
let loadedHits = 0;
const perPage = 40;

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

async function onSearchForm(e) {
    e.preventDefault();

    page = 1;
    query = e.currentTarget.searchQuery.value.trim();
    gallery.innerHTML = '';

    loadMoreBtn.classList.add('is-hidden');
    endOfSearchText.classList.add('is-hidden');
    
    if (query === '') {
        alertEmptySearch();
        return;
    }

    try {
        const object = await fetchPictures(query, page, perPage);
        const objData = object.data;
        loadedHits = objData.hits.length;

        if (objData.totalHits === 0) {
            alertNoPicturesFound();
            } else {
                renderGallery(objData.hits);
                alertPicturesToFound(objData);
                const simpleLightBox = new SimpleLightbox('.gallery a').refresh();
            }

            if (objData.totalHits > perPage) {
                loadMoreBtn.classList.remove('is-hidden');
            }
        
        onScroll();
        
    } catch (error) {
        Notiflix.Notify.failure("Sorry, the error occurred");
    }

}

async function onLoadMoreBtn() {
    page += 1;

    try {
        const object = await fetchPictures(query, page, perPage);
        const objData = object.data;
        const totalHits = objData.totalHits;
        loadedHits += objData.hits.length;

        renderGallery(objData.hits);
            const simpleLightbox = new SimpleLightbox('.gallery a').refresh();

        if (loadedHits === totalHits) {
            loadMoreBtn.classList.add('is-hidden');
            endOfSearchText.classList.remove('is-hidden');
            }
        
        onScrollMore();
    } catch (error) {
        Notiflix.Notify.failure("Sorry, the error occurred");
    }

}

function renderGallery(images) {
    const galleryMarkup = images
        .map(({ id, largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
            return `
                <a class="gallery__link" href="${largeImageURL}">
                    <div class="photo-card" id="${id}">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b> ${likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b> ${views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b> ${comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b> ${downloads}
                        </p>
                    </div>
                </div>
                </a>
      `
       
        })
        .join('');

gallery.insertAdjacentHTML('beforeend', galleryMarkup);
}

function alertPicturesToFound(objData) {
    Notiflix.Notify.success(`Hooray! We found ${objData.totalHits} images.`);
}

function alertEmptySearch() {
    Notiflix.Notify.failure('Enter a query, please');
}

function alertNoPicturesFound() {
    Notiflix.Notify.failure('Nothing was found. Please enter another query');
}

function onScroll () {
    window.scrollBy({
      top: 0,
      behavior: 'smooth',
    });
}

function onScrollMore () {
    const { height: cardHeight } = document
       .querySelector('.gallery')
       .firstElementChild.getBoundingClientRect();

     window.scrollBy({
       top: cardHeight * 2,
       behavior: 'smooth',
     });
}