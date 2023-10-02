import { fetchBreeds, fetchCatByBreed } from "./cat-api";

import './styles.css';
import './slimselect.css';

import Notiflix from 'notiflix';
import SlimSelect from 'slim-select'

const breedSelect = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const errorElement = document.querySelector('.error');

// Функція для заповнення вибірки порід
const populateBreeds = (breeds) => {
  breeds.forEach((breed) => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
};

window.addEventListener('load', () => {
  // Показуємо завантажувач
  loader.style.display = 'block'
  fetchBreeds()
    .then(breeds => {
      populateBreeds(breeds);
      new SlimSelect({
        select: '#breedSelect',
      });
      // Приховуємо завантажувач 
      loader.style.display = 'none';
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
      console.error('Error loading breeds:', error);
      // Відображаємо повідомлення про помилку
        errorElement.style.display = 'block';
      // Приховуємо завантажувач 
      loader.style.display = 'none';
      // Очищаємо вибірку порід
      catInfo.innerHTML = '';
    });
});

// Функція для відображення інформації про кота
const displayCatInfo = (breedName, description, temperament, imageUrl) => {
  catInfo.innerHTML = `
    <img class="cat-img" src="${imageUrl}" alt="${breedName}">
    <h1 class="cat-title">${breedName}</h1>
    <p class="cat-text">Опис: ${description}</p>
    <p class="cat-text"><span class="cat-span">Темперамент: </span>${temperament}</p>
    `;
};

// Обробник події при виборі породи
breedSelect.addEventListener('change', () => {

  const selectedBreedId = breedSelect.value;

  if (selectedBreedId) {
    // Показуємо завантажувач
    loader.style.display = 'block';

    // Приховуємо блок інформації про кота та повідомлення про помилку
    catInfo.style.display = 'none';
    errorElement.style.display = 'none';

    fetchCatByBreed(selectedBreedId)
      .then(catData => {
        const breedName = catData[0].breeds[0].name;
        const description = catData[0].breeds[0].description;
        const temperament = catData[0].breeds[0].temperament;
        const imageUrl = catData[0].url;

        displayCatInfo(breedName, description, temperament, imageUrl);
        // Приховуємо завантажувач після завершення запиту
        loader.style.display = 'none';
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
        console.error('Error retrieving cat information:', error);
        // Відображаємо повідомлення про помилку
        errorElement.style.display = 'block';
        // Приховуємо завантажувач
        loader.style.display = 'none';
        catInfo.style.display = 'none';
      });
  } else {
    catInfo.innerHTML = '';
  }
});
