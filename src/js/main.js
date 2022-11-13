/* eslint-disable no-console */
'use strict';
// //VARIABLES
const btn = document.querySelector('.btn-search');
const input = document.querySelector('.js-input');
const characterListEl = document.querySelector('.js-list');
const favoritesListEl = document.querySelector('.js-list-favorites');
const closeIcon = document.querySelector('.icon');
let allCharacters = [];
let favoriteCharacters = [];

//FUNCIONES
function renderOneCharacter(oneCharacter) {
  const CharacterInFavoritesIndex = favoriteCharacters.findIndex(
    (eachCharacterObj) =>
      eachCharacterObj.char_id === parseInt(oneCharacter.char_id)
  ); //comparamos el index del personaje y el de favoritos
  let classFavorite = '';
  let classHidden = '';
  if (CharacterInFavoritesIndex === -1) {
    //si no está en favoritos, no se le añade ninguna clase
    classFavorite = '';
    classHidden = 'hidden';
  } else {
    classFavorite = 'selected';
    classHidden = '';
    //si el seleccionado está en favoritos, se le añade la clase selected
  }
  let html =
    /* se le añade la clase selected (classFavorite) en función de si el index no es -1 */
    `<li>
  <article class="article ${classFavorite}" id="${oneCharacter.char_id}">
  <i class="fa-solid fa-circle-xmark icon ${classHidden}"></i>
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
  event.currentTarget.classList.toggle('hidden');

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

  // closeIcon.addEventListener('click', () => {
  //   debugger;
  //   console.log('has hecho click en la cruz');
  //   favoriteCharacters.splice(CharacterInFavoritesIndex, 1);
  //   localStorage.setItem('favCharacter', JSON.stringify(favoriteCharacters));
  // });
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
