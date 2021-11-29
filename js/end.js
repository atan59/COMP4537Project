// Constants
const username = document.querySelector('#username');
const saveScoreBtn = document.querySelector('#saveScoreBtn');
const finalScore = document.querySelector('#finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const uuid = localStorage.getItem('uuid');
const mostRecentCategory = localStorage.getItem('category');
// const postScoresURL = 'http://localhost:3000/API/v1/scores';
const postScoresURL = "https://s2api4537.azurewebsites.net/API/v1/scores";

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

const MAX_HIGH_SCORES = 5;

// Globals
let response = null;
let notyf = new Notyf({
    duration: 5000,
    position: {
        x: 'right',
        y: 'top',
    }
});

console.log(uuid);

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value.trim();
});

saveHighScore = async e => {
    e.preventDefault();

    const data = {
        uuid: uuid,
        name: username.value,
        highscore: mostRecentScore,
        category: mostRecentCategory
    }

    if (!/^[A-Za-z]+$/.test(data.name)) {
        notyf.error('Your name can only contain letters');
        return;
    }

    response = await fetch(postScoresURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        window.location.assign('./index.html');
    }

    // highScores.push(score);
    // highScores.sort((a, b) => {
    //     return b.score - a.score;
    // })

    // highScores.splice(5);

    // localStorage.setItem('highScores', JSON.stringify(highScores));
}
