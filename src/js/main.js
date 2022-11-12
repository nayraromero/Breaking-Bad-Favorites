/* eslint-disable no-console */
'use strict';
// //VARIABLES
// // const btn = document.querySelector('.btn-search');
// // const input = document.querySelector('.js-input');
const characterListEl = document.querySelector('.js-list');
const favoritesListEl = document.querySelector('.js-list-favorites');
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

function renderAllCharacters() {
  let html = '';
  for (let i = 0; i < allCharacters.length; i++) {
    html += renderOneCharacter(allCharacters[i]);
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
  console.log(allCharacters);
  const selectedCharacter = allCharacters.find(
    (eachCharacterObj) =>
      eachCharacterObj.char_id === parseInt(event.currentTarget.id)
  );

  favoriteCharacters.push(selectedCharacter);
  renderFavoritesCharacters();
}

//ELEMENTOS AL CARGAR LA WEB

fetch('https://breakingbadapi.com/api/characters')
  .then((response) => response.json())
  .then((jsonData) => {
    allCharacters = jsonData;

    renderAllCharacters();
    renderFavoritesCharacters();
  });
