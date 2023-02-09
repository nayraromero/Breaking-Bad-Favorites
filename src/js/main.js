'use strict';

//VARIABLES

const btn = document.querySelector('.btn-search');
const input = document.querySelector('.js-input');
const characterListEl = document.querySelector('.js-list');
const favoritesListEl = document.querySelector('.js-list-favorites');
const resetButton = document.querySelector('.btn-reset');
const buttonLog = document.querySelector('.btn-log');

let allCharacters = [];
let favoriteCharacters = [];

//RENDER FUNCTIONS

function renderOneCharacter(oneCharacter, iconFavorites) {
  // Función clave para pintar más adelante allCharacter y favoriteCharacters
  const CharacterInFavoritesIndex = favoriteCharacters.findIndex(
    (eachCharacterObj) =>
      eachCharacterObj.char_id === parseInt(oneCharacter.char_id)
  ); //comparamos el index del personaje y el de favoritos
  let classFavorite = '';

  if (CharacterInFavoritesIndex === -1) {
    //si no está en favoritos, no se le añade ninguna clase
    classFavorite = '';
  } else {
    classFavorite = 'selected';
    //si el seleccionado está en favoritos, se le añade la clase selected
  }
  let html =
    /* se le añade la clase selected (classFavorite) en función de si el index no es -1 */
    `<li>
  <article class="article ${classFavorite}" id="${oneCharacter.char_id}">
  `;
  if (iconFavorites === true) {
    html += `<i class="fa-solid fa-circle-xmark icon" id="${oneCharacter.char_id}"></i>`;
  }
  html += `<img
      src=${oneCharacter.img} class="characterPhoto">
    <h3 class="characterName">${oneCharacter.name}</h3>
    <p class="characterNickname">${oneCharacter.nickname}</p>
    <p class="characterStatus">${oneCharacter.status}</p>
  </article>
  </li>`;
  return html;
}

function renderAllCharacters(character) {
  let html = '';
  for (let i = 0; i < character.length; i++) {
    html += renderOneCharacter(character[i], false);
  }
  characterListEl.innerHTML = html;

  const allArticles = document.querySelectorAll('.article');

  for (const articleCharacter of allArticles) {
    articleCharacter.addEventListener('click', keepFavoritesArray);
  }
}

function renderFavoritesCharacters() {
  let html = '';
  for (let i = 0; i < favoriteCharacters.length; i++) {
    html += renderOneCharacter(favoriteCharacters[i], true);
  }
  favoritesListEl.innerHTML = html;

  const closeIcon = document.querySelectorAll('.icon');
  for (let i = 0; i < closeIcon.length; i++) {
    closeIcon[i].addEventListener('click', (event) => {
      const CharacterInFavoritesIndex = favoriteCharacters.findIndex(
        (eachCharacterObj) =>
          eachCharacterObj.char_id === parseInt(event.currentTarget.id)
      );
      //comparamos el index del seleccionado con el del API para después eliminarlo de favoritos
      favoriteCharacters.splice(CharacterInFavoritesIndex, 1);
      localStorage.setItem('favCharacter', JSON.stringify(favoriteCharacters));
      renderFavoritesCharacters();
    });
  }
}

//DATA FUNCTIONS

function keepFavoritesArray(event) {
  event.currentTarget.classList.toggle('selected');

  const selectedCharacter = allCharacters.find(
    (eachCharacterObj) =>
      eachCharacterObj.char_id === parseInt(event.currentTarget.id)
    //encontramos el personaje que queremos comparando el id del que hemos seleccionado y el char_id de el del API (le hacemos parseint al currentTarget porque el API viene dado en formato number).
  );

  const CharacterInFavoritesIndex = favoriteCharacters.findIndex(
    (eachCharacterObj) =>
      eachCharacterObj.char_id === parseInt(event.currentTarget.id)
    //comparamos el index del seleccionado con el del API para después guardarlo y pintarlo en favoritos
  );

  if (CharacterInFavoritesIndex === -1) {
    //Si no está en el array, se añade (y se pinta más abajo con la función render)
    favoriteCharacters.push(selectedCharacter);

    localStorage.setItem('favCharacter', JSON.stringify(favoriteCharacters));
  } else {
    //si está ya en favoritos, lo quitamos
    favoriteCharacters.splice(CharacterInFavoritesIndex, 1);

    localStorage.setItem('favCharacter', JSON.stringify(favoriteCharacters));
  }
  renderFavoritesCharacters(); //pinta los favoritos
}

function getData() {
  fetch('./assets/data/characters.json')
    .then((response) => response.json())
    .then((jsonData) => {
      allCharacters = jsonData;

      renderAllCharacters(allCharacters);
      renderFavoritesCharacters();
    });
}
getData();

function savedLocalStorage() {
  const savedFavorites = JSON.parse(localStorage.getItem('favCharacter'));
  if (savedFavorites !== null) {
    favoriteCharacters = savedFavorites;
    renderFavoritesCharacters();
  }
}
savedLocalStorage();

//BUTTON FUNCTIONS

function searchButton() {
  const userSearch = input.value.toLowerCase();
  const filteredCharacters = allCharacters.filter((character) =>
    character.name.toLowerCase().includes(userSearch)
  );
  renderAllCharacters(filteredCharacters);
}

function handleReset() {
  localStorage.removeItem('favCharacter');
  favoriteCharacters.length = 0;
  renderFavoritesCharacters();
}

//EVENTS

btn.addEventListener('click', (event) => {
  event.preventDefault();
  searchButton();
});

resetButton.addEventListener('click', (event) => {
  event.preventDefault();
  handleReset();
});

buttonLog.addEventListener('click', (event) => {
  event.preventDefault();
  for (const characterName of favoriteCharacters) {
    console.log(characterName.name);
  }
});
