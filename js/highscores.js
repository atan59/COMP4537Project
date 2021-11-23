// Constants
const highScoresList = document.querySelector('#highScoresList');
// const url = 'http://localhost:3000/API/v1/scores';
const url = 'https://s2api4537.azurewebsites.net/API/v1/scores';


// Globals
let highScores = [];
let response = null;

const getHighScores = async e => {
    response = await fetch(url);
    if (response.ok) {
        allScoresBtn.focus();
        highScores = await response.json();

        highScoresList.innerHTML = highScores.map(score => {
            return `<li class="high-score">${score.name} - ${score.highscore}</li>`
        }).join('');
    }
}

const getPersonalScores = async e => {
    const data = { uuid: uuid }

    response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        highScores = await response.json();

        highScoresList.innerHTML = highScores.map(score => {
            return `<li class="high-score">${score.name} - ${score.highscore}</li>`
        }).join('');
    }
}

// Event Listeners
allScoresBtn.addEventListener('click', getHighScores);
myScoresBtn.addEventListener('click', getPersonalScores);

// Invocations
getHighScores();