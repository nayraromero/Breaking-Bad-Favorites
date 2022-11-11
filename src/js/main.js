/* eslint-disable no-console */
'use strict';
// //VARIABLES
// // const btn = document.querySelector('.btn-search');
// // const input = document.querySelector('.js-input');
const characterListEl = document.querySelector('.js-list');
let allCharacters = [];

//FUNCIONES
function renderOneCharacter(oneCharacter) {
  let html = `<li>
  <article class="article">
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

function handleClick(event) {
  console.log('has hecho click');
  event.currentTarget.classList.toggle('selected');
}

//ELEMENTOS AL CARGAR LA WEB

fetch('https://breakingbadapi.com/api/characters')
  .then((response) => response.json())
  .then((jsonData) => {
    allCharacters = jsonData;

    renderAllCharacters();
  });
