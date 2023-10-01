import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import './styles.css';
import './slimselect.css';
import Notiflix from 'notiflix';
import SlimSelect from 'slim-select'
import 'slim-select/dist/slimselect.css';
import axios from "axios";

// ----------------------------------------------

import { fetchBreeds, fetchCatByBreed } from './cat-api'; // Імпортуємо функції з cat-api.js

document.addEventListener('DOMContentLoaded', () => {
  // Отримуємо елементи DOM
  const breedSelect = document.querySelector('.breed-select');
  const catInfo = document.querySelector('.cat-info');
  const loader = document.querySelector('.loader');
  const errorElement = document.querySelector('.error');

  // Функція для заповнення вибірки порід
  const populateBreeds = () => {
    // Показуємо завантажувач
    loader.style.display = 'block';

    axios
      .get('/breeds')
      .then((response) => {
        // Очищаємо вибірку порід
        breedSelect.innerHTML = '';

        // Додаємо опції до вибірки порід
        response.data.forEach((breed) => {
          const option = document.createElement('option');
          option.value = breed.id;
          option.textContent = breed.name;
          breedSelect.appendChild(option);
        });
      })
      .catch((error) => {
        console.error(error);
        // Відображаємо повідомлення про помилку
        errorElement.style.display = 'block';
      })
      .finally(() => {
        // Приховуємо завантажувач після завершення запиту
        loader.style.display = 'none';
      });
  };

  // Функція для відображення інформації про кота
  const displayCatInfo = (catData) => {
    const catImage = document.createElement('img');
    catImage.src = catData[0].url;

    const catName = document.createElement('h2');
    catName.textContent = catData[0].breeds[0].name;

    const catDescription = document.createElement('p');
    catDescription.textContent = `Опис: ${catData[0].breeds[0].description}`;

    const catTemperament = document.createElement('p');
    catTemperament.textContent = `Темперамент: ${catData[0].breeds[0].temperament}`;

    // Очищаємо блок з інформацією про кота та додаємо нову інформацію
    catInfo.innerHTML = '';
    catInfo.appendChild(catImage);
    catInfo.appendChild(catName);
    catInfo.appendChild(catDescription);
    catInfo.appendChild(catTemperament);
  };

  // Обробник події при виборі породи
  breedSelect.addEventListener('change', () => {
    const selectedBreedId = breedSelect.value;

    // Показуємо завантажувач
    loader.style.display = 'block';

    // Приховуємо блок інформації про кота та повідомлення про помилку
    catInfo.style.display = 'none';
    errorElement.style.display = 'none';

    // Виконуємо запит і відображаємо інформацію про кота при виборі породи
    fetchCatByBreed(selectedBreedId)
      .then((catData) => {
        displayCatInfo(catData);
      })
      .catch((error) => {
        console.error(error);
        // Відображаємо повідомлення про помилку
        errorElement.style.display = 'block';
      })
      .finally(() => {
        // Приховуємо завантажувач після завершення запиту
        loader.style.display = 'none';
      });
  });

  // Викликаємо функцію для заповнення вибірки порід при завантаженні сторінки
  populateBreeds();
});
