// Constants
const highScoresList = document.querySelector('#highScoresList');
const allScoresSelect = document.querySelector('#all');
const myScoresSelect = document.querySelector('#my');
const uuid = localStorage.getItem('uuid');
const url = 'http://localhost:3000/API/v1/scores/';
// const url = 'https://s2api4537.azurewebsites.net/API/v1/scores';


// Globals
let highScores = [];
let response = null;

const getHighScores = async () => {
    response = await fetch(url);
    if (response.ok) {
        allScoresSelect.focus();
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
        myScoresSelect.focus();
        highScores = await response.json();

        highScoresList.innerHTML = highScores.map(score => {
            return `<li class="high-score">${score.name} - ${score.highscore}</li>`
        }).join('');
    }
}

// Event Listeners
allScoresSelect.addEventListener('change', (event) => {
    if (event.target.value == 'All Scores') {
        getHighScores();
        return;
    }
    getFilteredScores(event.target.value);
})

myScoresSelect.addEventListener('focus', () => {
    myScoresSelect.add(new Option('My Scores', 'Temp Value'));
    myScoresSelect.lastChild.style.display = 'none';
    myScoresSelect.selectedIndex = myScoresSelect.options.length - 1;
})

myScoresSelect.addEventListener('change', event => {
    if (event.target.value == 'My Scores') {
        getPersonalScores();
        return;
    }
    getFilteredPersonalScores(event.target.value);
})

// Invocations
getHighScores();