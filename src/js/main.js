/* eslint-disable no-console */
'use strict';
// //VARIABLES
const btn = document.querySelector('.btn-search');
const input = document.querySelector('.js-input');
const characterListEl = document.querySelector('.js-list');
const favoritesListEl = document.querySelector('.js-list-favorites');
const form = document.querySelector('.form');
let allCharacters = [];
let favoriteCharacters = [];

//FUNCIONES
function renderOneCharacter(oneCharacter) {
  let html = `<li>
  <article class="article" id="${oneCharacter.char_id}">
    <img
      src=${oneCharacter.img} class="characterPhoto">
    <h3 class="characterName">${oneCharacter.name}</h3>
    <p class="characterStatus">${oneCharacter.status}</p>
  </article>
  </li>`;
  return html;
}

function renderAllCharacters(character) {
  let html = '';
  for (let i = 0; i < character.length; i++) {
    html += renderOneCharacter(character[i]);
  }
  characterListEl.innerHTML = html;

  const allArticles = document.querySelectorAll('.article');

  for (const articleCharacter of allArticles) {
    articleCharacter.addEventListener('click', handleClick);
  }
}
function renderFavoritesCharacters() {
  let html = '';
  for (let i = 0; i < favoriteCharacters.length; i++) {
    html += renderOneCharacter(favoriteCharacters[i]);
  }
  favoritesListEl.innerHTML = html;
}

function handleClick(event) {
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

btn.addEventListener('click', (event) => {
  event.preventDefault();
  const userSearch = input.value.toLowerCase();
  const filteredCharacters = allCharacters.filter((character) =>
    character.name.toLowerCase().includes(userSearch)
  );
  renderAllCharacters(filteredCharacters);
});

//ELEMENTOS AL CARGAR LA WEB

fetch('https://breakingbadapi.com/api/characters')
  .then((response) => response.json())
  .then((jsonData) => {
    allCharacters = jsonData;

    renderAllCharacters(allCharacters);
    renderFavoritesCharacters();
  });

const savedFavorites = JSON.parse(localStorage.getItem('favCharacter'));
if (savedFavorites !== null) {
  favoriteCharacters = savedFavorites;
  renderFavoritesCharacters();
}
