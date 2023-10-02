import { fetchBreeds, fetchCatByBreed } from "./cat-api";

import './styles.css';
import './slimselect.css';

import Notiflix from 'notiflix';
import SlimSelect from 'slim-select'

const breedSelect = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const errorElement = document.querySelector('.error');

const populateBreeds = (breeds) => {
  breeds.forEach((breed) => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
};

window.addEventListener('load', () => {
  loader.style.display = 'block'
  fetchBreeds()
    .then(breeds => {
      populateBreeds(breeds);
      new SlimSelect({
        select: '#breedSelect',
      });
    
      loader.style.display = 'none';
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
      console.error('Error loading breeds:', error);      
        errorElement.style.display = 'block';    
      loader.style.display = 'none';    
      catInfo.innerHTML = '';
    });
});

const displayCatInfo = (breedName, description, temperament, imageUrl) => {
  catInfo.innerHTML = `
    <div class="cat-container">
      <img class="cat-img" src="${imageUrl}" alt="${breedName}" width="700">
      <h1 class="cat-title">${breedName}</h1>
      <p class="cat-text" style="width: 700px;">Опис: ${description}</p>
      <p class="cat-text" style="width: 700px;"><span class="cat-span">Темперамент: </span>${temperament}</p>
    </div>
  `;
};

breedSelect.addEventListener('change', () => {

  const selectedBreedId = breedSelect.value;

  if (selectedBreedId) {
    loader.style.display = 'block';
    loader.style.width = '200px';
    loader.style.margin = '0 auto';

    catInfo.style.display = 'none';
    errorElement.style.display = 'none';

    fetchCatByBreed(selectedBreedId)
      .then(catData => {
        const breedName = catData[0].breeds[0].name;
        const description = catData[0].breeds[0].description;
        const temperament = catData[0].breeds[0].temperament;
        const imageUrl = catData[0].url;

        displayCatInfo(breedName, description, temperament, imageUrl);
        catInfo.style.display = 'block';
        loader.style.display = 'none';
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
        console.error('Error retrieving cat information:', error);
        errorElement.style.display = 'block';
        loader.style.display = 'none';
        catInfo.style.display = 'none';
      });
  } else {
    catInfo.innerHTML = '';
  }
});
