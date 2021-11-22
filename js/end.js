// Constants
const username = document.querySelector('#username');
const saveScoreBtn = document.querySelector('#saveScoreBtn');
const finalScore = document.querySelector('#finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const uuid = localStorage.getItem('uuid');
const postScoresURL = 'http://localhost:3000/API/v1/scores';

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

const MAX_HIGH_SCORES = 5;

// Globals
let response = null;

console.log(uuid);

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
});

saveHighScore = async e => {
    e.preventDefault();

    const data = {
        uuid: uuid,
        name: username.value,
        highscore: mostRecentScore
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
