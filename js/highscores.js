// Constants
const highScoresList = document.querySelector('#highScoresList');
// const url = 'http://localhost:3000/API/v1/scores';
const url = 'https://s2api4537.azurewebsites.net/API/v1/scores';


// Globals
let highScores = [];
let response = null;

const getHighScores = async () => {
    response = await fetch(url);
    if (response.ok) {
        highScores = await response.json();

        highScoresList.innerHTML = highScores.map(score => {
            return `<li class="high-score">${score.name} - ${score.highscore}</li>`
        }).join('');
    }
}

getHighScores();