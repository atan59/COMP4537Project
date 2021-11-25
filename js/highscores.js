// Constants
const highScoresList = document.querySelector('#highScoresList');
const scoresSelect = document.querySelector('#all-my');
const categoriesSelect = document.querySelector('#categories');
const uuid = localStorage.getItem('uuid');
const url = 'http://localhost:3000/API/v1/scores/';
// const url = 'https://s2api4537.azurewebsites.net/API/v1/scores';


// Globals
let highScores = [];
let response = null;
let currentScores = scoresSelect.value;
let currentCategory = categoriesSelect.value;

const getHighScores = async () => {
    response = await fetch(url);
    if (response.ok) {
        highScores = await response.json();

        highScoresList.innerHTML = highScores.map(score => {
            return `<li class="high-score">${score.name} - ${score.highscore}</li>`
        }).join('');
    }
}

const getFilteredScores = async category => {
    // Implement Server API
    console.log(category);
}

const getFilteredPersonalScores = async category => {
    // Implement Server API
    console.log(category);
}

const getPersonalScores = async () => {
    response = await fetch(url + uuid)
    if (response.ok) {
        highScores = await response.json();

        highScoresList.innerHTML = highScores.map(score => {
            return `<li class="high-score">${score.name} - ${score.highscore}</li>`
        }).join('');
    }
}

// Event Listeners
scoresSelect.addEventListener('change', (event) => {
    currentScores = event.target.value;

    if (event.target.value == 'All Scores' && !currentCategory) {
        getHighScores();
        return;
    }

    if (event.target.value == 'My Scores' && !currentCategory) {
        getPersonalScores();
        return;
    }
    if (event.target.value == 'All Scores') getFilteredScores(currentCategory);
    if (event.target.value == 'My Scores') getFilteredPersonalScores(currentCategory);
})

categoriesSelect.addEventListener('change', event => {
    currentCategory = event.target.value;
    
    if (currentScores == 'My Scores' && !event.target.value) {
        getPersonalScores();
        return;
    }

    if (currentScores == 'All Scores' && !event.target.value) {
        getHighScores();
        return;
    }
    if (currentScores == 'My Scores') getFilteredPersonalScores(event.target.value);
    if (currentScores == 'All Scores') getFilteredScores(event.target.value);
})

// Invocations
getHighScores();